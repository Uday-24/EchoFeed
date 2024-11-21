from django.urls import path
from django.contrib.auth import views as auth

from . import views


urlpatterns = [
    # path('login/', auth.LoginView.as_view(template_name='accounts/login.html'), name='login'),
    path('register/', views.register, name='register'),
    path('check_username/', views.check_username, name='check_username'),
    path('check_email/', views.check_email, name='check_email'),
    path('verify_otp/', views.verify_otp, name='verify_otp'),
    path('login/', views.login_page, name='login'),
    path('reset_password/', auth.PasswordResetView.as_view(template_name="accounts/reset_password.html"), name='password_reset'),
    path('reset_password_sent/', auth.PasswordResetDoneView.as_view(template_name="accounts/reset_password_sent.html"), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth.PasswordResetConfirmView.as_view(template_name="accounts/reset_password_confirm.html"), name='password_reset_confirm'),
    path('reset_password_complete/', auth.PasswordResetCompleteView.as_view(template_name="accounts/reset_password_complete.html"), name='password_reset_complete'),
]
