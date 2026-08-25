from decimal import Decimal

from django.conf import settings
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from jewellery.emails import send_order_confirmation_email
from .cashfree import create_payment_order, get_payment_order, CashfreeError
from .models import Order, OrderItem, OrderStatusEvent
from .serializers import CreateOrderSerializer, OrderSerializer


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

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            customer_name=payload['name'],
            customer_email=payload['email'],
            customer_phone=payload['phone'],
            address=payload.get('address', ''),
            city=payload.get('city', ''),
            notes=payload.get('notes', ''),
            subtotal=subtotal,
            total_amount=subtotal,
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

        OrderStatusEvent.objects.create(order=order, status='PENDING', note='Order created, awaiting payment.')

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
        order.cashfree_payment_status = cf_status

        if cf_status == 'PAID' and order.status == 'PENDING':
            order.status = 'PAID'
            OrderStatusEvent.objects.create(order=order, status='PAID', note='Payment received via Cashfree.')
            send_order_confirmation_email(order)
        elif cf_status in ('EXPIRED', 'TERMINATED', 'FAILED') and order.status == 'PENDING':
            order.status = 'FAILED'
            OrderStatusEvent.objects.create(order=order, status='FAILED', note=f'Cashfree reported status: {cf_status}.')

        order.save(update_fields=['cashfree_payment_status', 'status', 'updated_at'])

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
