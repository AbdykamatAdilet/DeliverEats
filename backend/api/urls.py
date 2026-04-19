from django import views
from django.urls import path
from .views import (
    AddressListCreateAPIView,
    AddressDetailAPIView,
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
    path('login/', views.login_view, name='login'),
]