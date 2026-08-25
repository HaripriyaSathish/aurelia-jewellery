from django.urls import path
from .views import CreateOrderView, VerifyPaymentView, OrderTrackingView, MyOrdersView

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='order-create'),
    path('verify/<str:order_number>/', VerifyPaymentView.as_view(), name='order-verify'),
    path('track/', OrderTrackingView.as_view(), name='order-track'),
    path('my/', MyOrdersView.as_view(), name='order-my'),
]
