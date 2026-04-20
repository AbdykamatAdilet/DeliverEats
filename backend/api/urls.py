from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    AddressListCreateAPIView, AddressDetailAPIView,
    CartAPIView, get_user_profile, process_checkout
)

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', get_user_profile, name='profile'),
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('addresses/', AddressListCreateAPIView.as_view(), name='addresses'),
    path('checkout/', process_checkout, name='checkout'),
]