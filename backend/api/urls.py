from django.urls import path
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
    clear_cart,
    login_view,
)

urlpatterns = [
    # Auth
    path('login/', login_view, name='login'),
    path('profile/', get_user_profile, name='profile'),

    # Menu
    path('menu/', menu_list, name='menu-list'),

    path('addresses/', AddressListCreateAPIView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', AddressDetailAPIView.as_view(), name='address-detail'),
    path('addresses/<int:pk>/set-default/', set_default_address, name='set-default-address'),

    path('cart/', CartAPIView.as_view(), name='cart'),
    path('cart/clear/', clear_cart, name='clear-cart'),
    path('cart/<int:pk>/', remove_from_cart, name='cart-remove'),

    # Checkout
    path('checkout/', process_checkout, name='process-checkout'),

    # Orders
    path('orders/', OrderListAPIView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
]