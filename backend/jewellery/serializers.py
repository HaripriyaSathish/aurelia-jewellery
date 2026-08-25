from rest_framework import serializers
from .models import (
    Category,
    JewelleryProduct,
    HeroBanner,
    Testimonial,
    NewsletterSubscriber,
    ContactEnquiry,
    ShopSettings,
)

class CategorySerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(source='get_image_url', read_only=True)
    product_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image_url', 'is_featured', 'order', 'product_count']


class JewelleryProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    image_url = serializers.CharField(source='primary_image', read_only=True)
    hover_image_url = serializers.CharField(source='secondary_image', read_only=True)

    class Meta:
        model = JewelleryProduct
        fields = [
            'id',
            'name',
            'slug',
            'category',
            'category_name',
            'category_slug',
            'description',
            'price',
            'old_price',
            'material',
            'carat_weight',
            'image_url',
            'hover_image_url',
            'is_featured',
            'is_bestseller',
            'is_new',
            'created_at',
        ]


class HeroBannerSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(source='get_image_url', read_only=True)

    class Meta:
        model = HeroBanner
        fields = [
            'id',
            'title',
            'subtitle',
            'tagline',
            'image_url',
            'button_text',
            'button_link',
            'secondary_button_text',
            'secondary_button_link',
            'is_active',
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    customer_image_url = serializers.CharField(source='get_image_url', read_only=True)

    class Meta:
        model = Testimonial
        fields = [
            'id',
            'customer_name',
            'customer_title',
            'quote',
            'rating',
            'customer_image_url',
            'is_active',
            'created_at',
        ]


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'subscribed_at', 'is_active']
        read_only_fields = ['subscribed_at', 'is_active']

    def validate_email(self, value):
        value = value.strip().lower()
        if NewsletterSubscriber.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already part of the VETRI Private Circle.")
        return value


class ContactEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEnquiry
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'created_at', 'is_read']
        read_only_fields = ['created_at', 'is_read']

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Please provide your name.")
        return value.strip()

    def validate_email(self, value):
        if not value.strip():
            raise serializers.ValidationError("Please provide your email address.")
        return value.strip()

    def validate_phone(self, value):
        if not value.strip():
            raise serializers.ValidationError("Please provide your phone number.")
        return value.strip()

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("Please enter your message or inquiry.")
        return value.strip()


class ShopSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopSettings
        fields = [
            'shop_name',
            'tagline',
            'phone_number',
            'whatsapp_number',
            'whatsapp_message',
            'email',
            'address',
            'opening_hours',
            'google_map_embed_url',
            'google_map_direct_url',
            'facebook_url',
            'instagram_url',
            'pinterest_url',
        ]
