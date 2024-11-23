from django.urls import path

from . import views

app_name = "posts"
urlpatterns = [
    path('upload_post/', views.upload_post, name='upload_post')
]