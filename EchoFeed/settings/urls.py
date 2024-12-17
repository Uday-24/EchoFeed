from django.urls import path, include
from . import views

app_name = 'settings'
urlpatterns = [
    path('', views.edit_profile, name='edit_profile'),
]