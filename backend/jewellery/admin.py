from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category,
    JewelleryProduct,
    HeroBanner,
    Testimonial,
    NewsletterSubscriber,
    ContactEnquiry,
    ShopSettings,
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_featured', 'order', 'preview_image']
    list_filter = ['is_featured']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_featured', 'order']

    def preview_image(self, obj):
        url = obj.get_image_url
        if url:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #c8a86b;" />', url)
        return "No image"
    preview_image.short_description = "Preview"


@admin.register(JewelleryProduct)
class JewelleryProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'old_price', 'material', 'is_bestseller', 'is_featured', 'is_new', 'preview_thumbnail']
    list_filter = ['category', 'is_bestseller', 'is_featured', 'is_new', 'created_at']
    search_fields = ['name', 'description', 'material', 'category__name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'is_bestseller', 'is_featured', 'is_new']
    readonly_fields = ['created_at', 'large_preview']

    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'slug', 'category', 'description', 'material', 'carat_weight')
        }),
        ('Pricing', {
            'fields': ('price', 'old_price')
        }),
        ('Media & Imagery', {
            'fields': ('image', 'image_url', 'hover_image', 'hover_image_url', 'large_preview')
        }),
        ('Visibility & Badges', {
            'fields': ('is_featured', 'is_bestseller', 'is_new', 'created_at')
        }),
    )

    def preview_thumbnail(self, obj):
        url = obj.primary_image
        if url:
            return format_html('<img src="{}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px; border: 1px solid #e0d0b0;" />', url)
        return "No image"
    preview_thumbnail.short_description = "Photo"

    def large_preview(self, obj):
        url = obj.primary_image
        if url:
            return format_html('<img src="{}" style="max-width: 250px; max-height: 250px; object-fit: cover; border-radius: 6px; border: 2px solid #b8945a;" />', url)
        return "No image available"
    large_preview.short_description = "Current Image Preview"


@admin.register(HeroBanner)
class HeroBannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'is_active', 'button_text', 'banner_preview']
    list_editable = ['is_active']

    def banner_preview(self, obj):
        url = obj.get_image_url
        if url:
            return format_html('<img src="{}" style="width: 120px; height: 50px; object-fit: cover; border-radius: 4px;" />', url)
        return "No image"
    banner_preview.short_description = "Banner Preview"


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'customer_title', 'rating', 'is_active', 'avatar_preview']
    list_filter = ['rating', 'is_active', 'created_at']
    search_fields = ['customer_name', 'quote']
    list_editable = ['is_active']

    def avatar_preview(self, obj):
        url = obj.get_image_url
        if url:
            return format_html('<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />', url)
        return "No avatar"
    avatar_preview.short_description = "Avatar"


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'subscribed_at', 'is_active']
    list_filter = ['is_active', 'subscribed_at']
    search_fields = ['email']
    list_editable = ['is_active']


@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'subject', 'created_at', 'status_badge']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'phone', 'subject', 'message']
    readonly_fields = ['name', 'email', 'phone', 'subject', 'message', 'created_at']
    actions = ['mark_as_read', 'mark_as_unread']

    def status_badge(self, obj):
        if obj.is_read:
            return format_html('<span style="background: #2e7d32; color: #fff; padding: 3px 8px; border-radius: 12px; font-size: 11px;">Read</span>')
        return format_html('<span style="background: #b8945a; color: #fff; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">NEW / UNREAD</span>')
    status_badge.short_description = "Status"

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected enquiries as Read"

    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
    mark_as_unread.short_description = "Mark selected enquiries as Unread"


@admin.register(ShopSettings)
class ShopSettingsAdmin(admin.ModelAdmin):
    list_display = ['shop_name', 'phone_number', 'email', 'address']

    def has_add_permission(self, request):
        # Only allow 1 instance
        if ShopSettings.objects.exists():
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        return False
