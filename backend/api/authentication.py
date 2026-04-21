"""
api/authentication.py

A drop-in replacement for JWTAuthentication that does NOT raise
AuthenticationFailed when the token is invalid or expired.

Standard JWTAuthentication raises AuthenticationFailed for ANY bad token,
even on AllowAny views like /api/login/. This is because DRF runs
authentication before checking permissions.

This class returns (None, None) on any token error instead of raising,
which lets AllowAny views proceed normally while still authenticating
valid tokens on protected views.
"""

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class SoftJWTAuthentication(JWTAuthentication):
    """
    JWTAuthentication that silently ignores invalid / expired tokens
    instead of raising AuthenticationFailed.

    Result:
    - Valid token   → (user, token)   — protected views work normally
    - Invalid token → (None, None)    — AllowAny views are not blocked
    - No token      → (None, None)    — same as before
    """

    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except (InvalidToken, TokenError):
            return None