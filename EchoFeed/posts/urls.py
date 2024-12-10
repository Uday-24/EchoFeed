from django.urls import path

from . import views

app_name = "posts"
urlpatterns = [
    path('upload_post/', views.upload_post, name='upload_post'),
    path('like/', views.like, name='like'),
    path('unlike/', views.unlike, name='unlike'),
    path('submit_comment/', views.submit_comment, name='submit_comment'),
]