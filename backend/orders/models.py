import random
import string

from django.conf import settings
from django.db import models

from jewellery.models import JewelleryProduct


def generate_order_number():
    suffix = ''.join(random.choices(string.digits, k=6))
    return f"VET-{suffix}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Payment'),
        ('PAID', 'Paid / Confirmed'),
        ('FAILED', 'Payment Failed'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    order_number = models.CharField(max_length=30, unique=True, default=generate_order_number, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')

    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=30)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120, blank=True)
    notes = models.TextField(blank=True)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    cashfree_order_id = models.CharField(max_length=120, blank=True)
    payment_session_id = models.CharField(max_length=255, blank=True)
    cashfree_payment_status = models.CharField(max_length=40, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True, help_text="Cashfree payment ID (cf_payment_id)")
    payment_method = models.CharField(max_length=50, blank=True, help_text="e.g. card, upi, netbanking")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def cgst_amount(self):
        return round(self.tax_amount / 2, 2)

    @property
    def sgst_amount(self):
        return self.tax_amount - self.cgst_amount

    def __str__(self):
        return f"{self.order_number} ({self.status})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(JewelleryProduct, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=200)
    image_url = models.URLField(max_length=500, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product_name} x{self.quantity}"


class OrderStatusEvent(models.Model):
    """A simple tracking timeline entry, shown on the order tracking page."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='timeline')
    status = models.CharField(max_length=20, choices=Order.STATUS_CHOICES)
    note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.order.order_number} -> {self.status}"
