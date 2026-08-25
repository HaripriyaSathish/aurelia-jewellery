from django.contrib import admin
from .models import Order, OrderItem, OrderStatusEvent


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


class OrderStatusEventInline(admin.TabularInline):
    model = OrderStatusEvent
    extra = 0
    readonly_fields = ('status', 'note', 'created_at')
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'total_amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('order_number', 'customer_name', 'customer_email', 'customer_phone', 'cashfree_order_id', 'transaction_id')
    inlines = [OrderItemInline, OrderStatusEventInline]
    readonly_fields = (
        'order_number', 'cashfree_order_id', 'payment_session_id', 'cashfree_payment_status',
        'transaction_id', 'payment_method', 'subtotal', 'tax_amount', 'total_amount',
    )

    def get_fieldsets(self, request, obj=None):
        return (
            (None, {'fields': ('order_number', 'user', 'status')}),
            ('Customer', {'fields': ('customer_name', 'customer_email', 'customer_phone', 'address', 'city', 'notes')}),
            ('Pricing', {'fields': ('subtotal', 'tax_amount', 'total_amount')}),
            ('Payment', {'fields': ('cashfree_order_id', 'payment_session_id', 'cashfree_payment_status', 'transaction_id', 'payment_method')}),
        )
