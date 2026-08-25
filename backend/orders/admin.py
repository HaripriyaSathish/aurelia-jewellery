from django.contrib import admin
from .models import Order, OrderItem, OrderStatusEvent


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


class OrderStatusEventInline(admin.TabularInline):
    model = OrderStatusEvent
    extra = 1


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'total_amount', 'status', 'cashfree_payment_status', 'created_at')
    list_filter = ('status',)
    search_fields = ('order_number', 'customer_name', 'customer_email', 'customer_phone', 'cashfree_order_id')
    inlines = [OrderItemInline, OrderStatusEventInline]
    readonly_fields = ('order_number', 'cashfree_order_id', 'payment_session_id', 'cashfree_payment_status')
