from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q

from .models import (
    Category,
    JewelleryProduct,
    HeroBanner,
    Testimonial,
    NewsletterSubscriber,
    ContactEnquiry,
    ShopSettings,
)
from .serializers import (
    CategorySerializer,
    JewelleryProductSerializer,
    HeroBannerSerializer,
    TestimonialSerializer,
    NewsletterSubscriberSerializer,
    ContactEnquirySerializer,
    ShopSettingsSerializer,
)
from .emails import send_contact_emails, send_newsletter_welcome_email


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('order', 'name')
    serializer_class = CategorySerializer


class FeaturedCategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_featured=True).order_by('order', 'name')
    serializer_class = CategorySerializer


class ProductListView(generics.ListAPIView):
    serializer_class = JewelleryProductSerializer

    def get_queryset(self):
        queryset = JewelleryProduct.objects.select_related('category').all()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        featured = self.request.query_params.get('featured', None)
        bestseller = self.request.query_params.get('bestseller', None)

        if category:
            queryset = queryset.filter(Q(category__slug=category) | Q(category__name__iexact=category))
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(material__icontains=search) |
                Q(category__name__icontains=search)
            )
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() in ['true', '1'])
        if bestseller is not None:
            queryset = queryset.filter(is_bestseller=bestseller.lower() in ['true', '1'])

        return queryset


class FeaturedProductListView(generics.ListAPIView):
    queryset = JewelleryProduct.objects.select_related('category').filter(is_featured=True)
    serializer_class = JewelleryProductSerializer


class BestsellerProductListView(generics.ListAPIView):
    queryset = JewelleryProduct.objects.select_related('category').filter(is_bestseller=True)
    serializer_class = JewelleryProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    queryset = JewelleryProduct.objects.select_related('category').all()
    serializer_class = JewelleryProductSerializer
    lookup_field = 'slug'


class HeroBannerView(APIView):
    def get(self, request):
        banner = HeroBanner.objects.filter(is_active=True).first()
        if banner:
            serializer = HeroBannerSerializer(banner)
            return Response(serializer.data)
        # Default fallback response if no banner in DB yet
        return Response({
            "title": "The Art of Forever",
            "subtitle": "Jewellery designed to become part of your story.",
            "tagline": "HAUTE JOAILLERIE & TIMELESS BRILLIANCE",
            "image_url": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop",
            "button_text": "DISCOVER THE COLLECTION",
            "button_link": "#collections",
            "secondary_button_text": "EXPLORE OUR STORY →",
            "secondary_button_link": "#story",
            "is_active": True
        })


class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.filter(is_active=True).order_by('-rating', '-created_at')
    serializer_class = TestimonialSerializer


class ShopSettingsView(APIView):
    def get(self, request):
        settings = ShopSettings.load()
        serializer = ShopSettingsSerializer(settings)
        return Response(serializer.data)


class ContactEnquiryCreateView(APIView):
    def post(self, request):
        serializer = ContactEnquirySerializer(data=request.data)
        if serializer.is_valid():
            enquiry = serializer.save()
            # Send notification & acknowledgement emails
            send_contact_emails(enquiry)
            return Response(
                {
                    "success": True,
                    "message": "Thank you for reaching out to VETRI. Your inquiry has been received and our jewellery concierge will connect with you shortly.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class NewsletterSubscribeView(APIView):
    def post(self, request):
        serializer = NewsletterSubscriberSerializer(data=request.data)
        if serializer.is_valid():
            subscriber = serializer.save()
            send_newsletter_welcome_email(subscriber.email)
            return Response(
                {
                    "success": True,
                    "message": "Welcome to the VETRI Private Circle. You have been successfully subscribed.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
