from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, help_text="Fallback external image URL")
    is_featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def get_image_url(self):
        if self.image:
            return self.image.url
        return self.image_url or ''

    def __str__(self):
        return self.name


class JewelleryProduct(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    material = models.CharField(max_length=150, default="18K Yellow Gold & Solitaire Diamond")
    carat_weight = models.CharField(max_length=50, blank=True, default="1.50 CT")
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, help_text="Primary product image URL")
    hover_image = models.ImageField(upload_to='products/hover/', blank=True, null=True)
    hover_image_url = models.URLField(max_length=500, blank=True, help_text="Secondary/model hover image URL")
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Jewellery Product'
        verbose_name_plural = 'Jewellery Products'
        ordering = ['-is_bestseller', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def primary_image(self):
        if self.image:
            return self.image.url
        return self.image_url or ''

    @property
    def secondary_image(self):
        if self.hover_image:
            return self.hover_image.url
        return self.hover_image_url or self.primary_image

    def __str__(self):
        return f"{self.name} - ₹{self.price}"


class HeroBanner(models.Model):
    title = models.CharField(max_length=200, default="The Art of Forever")
    subtitle = models.TextField(default="Jewellery designed to become part of your story.")
    tagline = models.CharField(max_length=150, default="HAUTE JOAILLERIE & TIMELESS BRILLIANCE", blank=True)
    image = models.ImageField(upload_to='hero/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True)
    button_text = models.CharField(max_length=60, default="DISCOVER THE COLLECTION")
    button_link = models.CharField(max_length=120, default="#collections")
    secondary_button_text = models.CharField(max_length=60, default="EXPLORE OUR STORY →", blank=True)
    secondary_button_link = models.CharField(max_length=120, default="#story", blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Hero Banner'
        verbose_name_plural = 'Hero Banners'

    @property
    def get_image_url(self):
        if self.image:
            return self.image.url
        return self.image_url or ''

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    customer_name = models.CharField(max_length=120)
    customer_title = models.CharField(max_length=150, blank=True, default="Private Collector, Chennai")
    quote = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    customer_image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    customer_image_url = models.URLField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'
        ordering = ['-rating', '-created_at']

    @property
    def get_image_url(self):
        if self.customer_image:
            return self.customer_image.url
        return self.customer_image_url or ''

    def __str__(self):
        return f"{self.customer_name} ({self.rating} Stars)"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Newsletter Subscriber'
        verbose_name_plural = 'Newsletter Subscribers'
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email


class ContactEnquiry(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    subject = models.CharField(max_length=200, blank=True, default="Jewellery Inquiry / Private Consultation")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Contact Enquiry'
        verbose_name_plural = 'Contact Enquiries'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject} ({self.created_at.strftime('%d %b %Y')})"


class ShopSettings(models.Model):
    shop_name = models.CharField(max_length=120, default="VETRI FINE JEWELLERY")
    tagline = models.CharField(max_length=200, default="The Art of Forever — Mastercrafted Haute Joaillerie")
    phone_number = models.CharField(max_length=40, default="+91 98765 43210")
    whatsapp_number = models.CharField(max_length=40, default="+91 98765 43210")
    whatsapp_message = models.TextField(default="Hello VETRI, I would like to know more about your jewellery collection.")
    email = models.EmailField(default="hello@vetrijewels.com")
    address = models.CharField(max_length=255, default="123 Luxury Street, Chennai, Tamil Nadu, India")
    opening_hours = models.CharField(max_length=255, default="Mon – Sat: 10:30 AM – 8:30 PM | Sun: 11:00 AM – 7:00 PM")
    google_map_embed_url = models.TextField(
        default="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.589139886364!2d80.2452!3d13.0475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266497f1f9e53%3A0x6b4f7b21e8d6411!2sKhader%20Nawaz%20Khan%20Rd%2C%20Nungambakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000"
    )
    google_map_direct_url = models.URLField(
        max_length=500,
        default="https://maps.google.com/?q=Khader+Nawaz+Khan+Road+Nungambakkam+Chennai"
    )
    facebook_url = models.URLField(default="https://facebook.com/vetrijewels", blank=True)
    instagram_url = models.URLField(default="https://instagram.com/vetrijewels", blank=True)
    pinterest_url = models.URLField(default="https://pinterest.com/vetrijewels", blank=True)

    class Meta:
        verbose_name = 'Shop Settings'
        verbose_name_plural = 'Shop Settings'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return self.shop_name
