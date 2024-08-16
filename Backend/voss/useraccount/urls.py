from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from dj_rest_auth.registration.views import RegisterView, VerifyEmailView, ConfirmEmailView
from dj_rest_auth.views import LoginView, LogoutView, PasswordResetView, PasswordChangeView, PasswordResetConfirmView
from allauth.account.views import AccountInactiveView
from rest_framework_simplejwt.views import TokenBlacklistView, TokenRefreshView

from .views import CustomRegisterView, CustomLoginView, CustomPasswordResetView, password_reset_confirm_redirect
from . import api

urlpatterns = [
    path('register/', CustomRegisterView.as_view(), name='rest_register'),
    path('register/confirm/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    path('register/confirm/<key>', ConfirmEmailView.as_view(), name='account_confirm_email'),
    
    path('login/', CustomLoginView.as_view(), name='rest_login'),
    path('logout/', TokenBlacklistView.as_view(), name='token_black'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('profile/', api.profile, name='profile'),
    path('status/', api.status_change, name='status_change'),
    path('inactive/', AccountInactiveView.as_view(), name='account_inactive'),
    
    path("password/reset/", CustomPasswordResetView.as_view(), name="rest_password_reset"),
    path("password/reset/confirm/<str:uidb64>/<str:token>/", password_reset_confirm_redirect, name="password_reset_confirm"),
    path("password/reset/confirm/", PasswordResetConfirmView.as_view(), name="rest_password_reset_confirm"),

    path('password/change/', PasswordChangeView.as_view(), name='rest_password_change'),
]