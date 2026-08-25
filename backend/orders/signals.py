"""
Whenever an Order's status changes (from API code like VerifyPaymentView,
or from a staff member editing it in Django admin), automatically:
  1. Append a timeline entry (OrderStatusEvent) so the tracking page
     reflects it.
  2. Send a WhatsApp status update to the customer for the milestones
     that matter to them (paid/shipped/out for delivery/delivered).
"""
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from .models import Order, OrderStatusEvent
from .whatsapp import send_order_status_whatsapp

STATUS_NOTES = {
    'PENDING': 'Order created, awaiting payment.',
    'PAID': 'Payment received, order confirmed.',
    'FAILED': 'Payment failed.',
    'PROCESSING': 'Your order is being prepared.',
    'SHIPPED': 'Your order has been shipped.',
    'OUT_FOR_DELIVERY': 'Your order is out for delivery.',
    'DELIVERED': 'Your order has been delivered.',
    'CANCELLED': 'Order cancelled.',
}

WHATSAPP_NOTIFY_STATUSES = {'PAID', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'}


@receiver(pre_save, sender=Order)
def _capture_previous_status(sender, instance, **kwargs):
    if not instance.pk:
        instance._previous_status = None
        return
    try:
        instance._previous_status = Order.objects.get(pk=instance.pk).status
    except Order.DoesNotExist:
        instance._previous_status = None


@receiver(post_save, sender=Order)
def _log_status_change_and_notify(sender, instance, created, **kwargs):
    previous_status = getattr(instance, '_previous_status', None)

    if created:
        OrderStatusEvent.objects.create(
            order=instance, status=instance.status, note=STATUS_NOTES.get(instance.status, '')
        )
        return

    if previous_status is not None and previous_status != instance.status:
        OrderStatusEvent.objects.create(
            order=instance, status=instance.status, note=STATUS_NOTES.get(instance.status, '')
        )
        if instance.status in WHATSAPP_NOTIFY_STATUSES:
            send_order_status_whatsapp(instance)
