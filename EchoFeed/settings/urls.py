from django.urls import path, include
from . import views

app_name = 'settings'
urlpatterns = [
    path('', views.edit_profile, name='edit_profile'),
    path('account_privacy/', views.account_privacy, name='account_privacy'),
    path('comments/', views.comments, name='comments'),
    path('blocked/', views.blocked, name='blocked'),
    path('password_and_security/', views.password_and_security, name='password_and_security'),
    path('personal_details/', views.personal_details, name='personal_details'),
    path('handle_2fa_private_account/', views.handle_2fa_private_account, name='handle_2fa_private_account'),
    path('birthday/', views.birthday, name='birthday'),
]