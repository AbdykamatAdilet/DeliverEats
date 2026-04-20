from . import views
from django.contrib import admin
from django.urls import path, include
from .views import (
    AddressListCreateAPIView,
    AddressDetailAPIView,
    OrderDetailAPIView,
    OrderListAPIView,
    menu_list,
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
    path('profile/', get_user_profile, name='profile'),
    path('checkout/', process_checkout, name='process-checkout'),
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('cart/<int:pk>/', remove_from_cart, name='cart-remove'),
    path('login/', views.login_view, name='login'),
    path('menu/', menu_list),
    path('orders/', OrderListAPIView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
    path('admin/', admin.site.urls),
]