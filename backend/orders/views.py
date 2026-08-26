from decimal import Decimal

from django.conf import settings
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from jewellery.emails import send_order_confirmation_email
from .cashfree import create_payment_order, get_payment_order, get_order_payments, CashfreeError
from .models import Order, OrderItem, OrderStatusEvent
from .serializers import CreateOrderSerializer, OrderSerializer
from .signals import STATUS_NOTES
from .whatsapp import send_order_status_whatsapp


class CreateOrderView(APIView):
    """
    Creates a local Order + OrderItems from the cart, then registers it
    with Cashfree (test mode) and returns the payment_session_id the
    frontend needs to open the Cashfree Drop-in checkout.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        subtotal = sum(Decimal(str(i['price'])) * i['quantity'] for i in payload['items'])
        tax_amount = (subtotal * Decimal(str(settings.GST_RATE))).quantize(Decimal('0.01'))
        total_amount = subtotal + tax_amount

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            customer_name=payload['name'],
            customer_email=payload['email'],
            customer_phone=payload['phone'],
            address=payload.get('address', ''),
            city=payload.get('city', ''),
            notes=payload.get('notes', ''),
            subtotal=subtotal,
            tax_amount=tax_amount,
            total_amount=total_amount,
        )

        for item in payload['items']:
            OrderItem.objects.create(
                order=order,
                product_id=item.get('id'),
                product_name=item['name'],
                image_url=item.get('image_url', ''),
                price=item['price'],
                quantity=item['quantity'],
            )

        try:
            cf_data = create_payment_order(order)
        except CashfreeError as e:
            return Response(
                {
                    "success": False,
                    "message": str(e),
                    "order_number": order.order_number,
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        order.cashfree_order_id = cf_data.get('order_id', order.order_number)
        order.payment_session_id = cf_data.get('payment_session_id', '')
        order.save(update_fields=['cashfree_order_id', 'payment_session_id'])

        return Response({
            "success": True,
            "order_number": order.order_number,
            "payment_session_id": order.payment_session_id,
            "cashfree_env": settings.CASHFREE_ENV,
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    """
    Called by the frontend after the Cashfree checkout redirects back.
    Pulls the authoritative payment status from Cashfree and updates
    the local order accordingly.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, order_number):
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response({"success": False, "message": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            cf_data = get_payment_order(order.cashfree_order_id or order.order_number)
        except CashfreeError as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        cf_status = cf_data.get('order_status', '')

        if cf_status == 'PAID':
            payments = get_order_payments(order.cashfree_order_id or order.order_number)
            successful_payment = next((p for p in payments if p.get('payment_status') == 'SUCCESS'), None)
            transaction_id = str(successful_payment.get('cf_payment_id', '')) if successful_payment else ''
            payment_method = ((successful_payment.get('payment_group') or '').replace('_', ' ').title()) if successful_payment else ''

            # Atomic claim: only the request that actually flips PENDING -> PAID
            # sends the confirmation email/timeline entry/WhatsApp message,
            # even if verify is called concurrently (e.g. a duplicate frontend
            # effect run or a page refresh). .update() bypasses model signals
            # on purpose here, so the timeline/WhatsApp side effects are done
            # explicitly below instead of relying on the post_save signal.
            claimed = Order.objects.filter(pk=order.pk, status='PENDING').update(
                status='PAID',
                cashfree_payment_status=cf_status,
                transaction_id=transaction_id,
                payment_method=payment_method,
                updated_at=timezone.now(),
            )
            order.refresh_from_db()
            if claimed:
                OrderStatusEvent.objects.create(
                    order=order, status='PAID', note=STATUS_NOTES.get('PAID', ''),
                )
                send_order_confirmation_email(order)
                send_order_status_whatsapp(order)
        elif cf_status in ('EXPIRED', 'TERMINATED', 'FAILED'):
            claimed = Order.objects.filter(pk=order.pk, status='PENDING').update(
                status='FAILED', cashfree_payment_status=cf_status, updated_at=timezone.now(),
            )
            order.refresh_from_db()
            if claimed:
                OrderStatusEvent.objects.create(
                    order=order, status='FAILED', note=STATUS_NOTES.get('FAILED', ''),
                )
        else:
            order.cashfree_payment_status = cf_status
            order.save(update_fields=['cashfree_payment_status', 'updated_at'])

        return Response(OrderSerializer(order).data)


class OrderTrackingView(APIView):
    """
    Public order lookup: requires the order number plus the email or
    phone used at checkout, so a stranger cannot browse other orders.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        order_number = request.query_params.get('order_number', '').strip()
        email = request.query_params.get('email', '').strip().lower()
        phone = request.query_params.get('phone', '').strip()

        if not order_number or (not email and not phone):
            return Response(
                {"success": False, "message": "Provide the order number and the email or phone used at checkout."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qs = Order.objects.filter(order_number__iexact=order_number)
        if email:
            qs = qs.filter(customer_email__iexact=email)
        elif phone:
            qs = qs.filter(customer_phone=phone)

        order = qs.first()
        if not order:
            return Response({"success": False, "message": "No matching order was found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"success": True, "order": OrderSerializer(order).data})


class MyOrdersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        return Response(OrderSerializer(orders, many=True).data)
