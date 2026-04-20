from django.http import HttpResponse

from . import views
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    AddressListCreateAPIView,
    AddressDetailAPIView,
    OrderDetailAPIView,
    OrderListAPIView,
    menu_list, OrderCreateAPIView, UserOrdersAPIView,
    remove_from_cart,
    set_default_address,
    get_user_profile,
    CartAPIView,
    process_checkout,
)

urlpatterns = [
    path('addresses/', AddressListCreateAPIView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', AddressDetailAPIView.as_view(), name='address-detail'),
    path('addresses/<int:pk>/set-default/', set_default_address, name='set-default-address'),
    path('profile/', get_user_profile, name='user-profile'),
    path('checkout/', process_checkout, name='process-checkout'),
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('cart/<int:pk>/', remove_from_cart, name='cart-remove'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('menu/', menu_list),
    path('orders/create/', OrderCreateAPIView.as_view()),
    path('orders/', OrderListAPIView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
    path('orders/', UserOrdersAPIView.as_view()),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('test/', lambda request: HttpResponse("OK")),
]
