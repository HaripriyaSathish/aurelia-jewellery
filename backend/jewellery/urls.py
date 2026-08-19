from django.urls import path
from .views import (
    CategoryListView,
    FeaturedCategoryListView,
    ProductListView,
    FeaturedProductListView,
    BestsellerProductListView,
    ProductDetailView,
    HeroBannerView,
    TestimonialListView,
    ShopSettingsView,
    ContactEnquiryCreateView,
    NewsletterSubscribeView,
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/featured/', FeaturedCategoryListView.as_view(), name='category-featured'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/featured/', FeaturedProductListView.as_view(), name='product-featured'),
    path('products/bestsellers/', BestsellerProductListView.as_view(), name='product-bestsellers'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('hero/', HeroBannerView.as_view(), name='hero-banner'),
    path('testimonials/', TestimonialListView.as_view(), name='testimonial-list'),
    path('settings/', ShopSettingsView.as_view(), name='shop-settings'),
    path('contact/', ContactEnquiryCreateView.as_view(), name='contact-enquiry'),
    path('newsletter/subscribe/', NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
]
