from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    AddressListCreateAPIView,
    AddressDetailAPIView,
    logout_view,
    remove_from_cart,
    set_default_address,
    get_user_profile,
    CartAPIView,
    process_checkout,
    menu_list, 
    OrderCreateAPIView, 
    UserOrdersAPIView, 
    OrderDetailAPIView
)

urlpatterns = [
    path('addresses/', AddressListCreateAPIView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', AddressDetailAPIView.as_view(), name='address-detail'),
    path('addresses/<int:pk>/set-default/', set_default_address, name='set-default-address'),
    
    path('profile/', get_user_profile, name='user-profile'),
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('cart/<int:pk>/', remove_from_cart, name='cart-remove'),
    path('checkout/', process_checkout, name='process-checkout'),
    
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_view, name='logout'),

    path('menu/', menu_list, name='menu'),
    path('orders/', UserOrdersAPIView.as_view(), name='user-orders'), 
    path('orders/create/', OrderCreateAPIView.as_view(), name='order-create'),
    path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
]