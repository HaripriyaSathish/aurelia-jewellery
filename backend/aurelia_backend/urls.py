from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

# Custom Admin Branding
admin.site.site_header = "AURELIA Fine Jewellery Administration"
admin.site.site_title = "AURELIA Admin Portal"
admin.site.index_title = "Haute Joaillerie Management & Boutique Operations"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('jewellery.urls')),
    path('api/auth/', include('accounts.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/chatbot/', include('chatbot.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Catch-all to serve React frontend single-page application
urlpatterns += [
    re_path(r'^(?!api|admin|media|static).*$', TemplateView.as_view(template_name='index.html'), name='frontend'),
]
