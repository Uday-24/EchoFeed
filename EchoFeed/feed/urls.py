from django.urls import path

from . import views

app_name = "feed"
urlpatterns = [
   path('', views.index, name="index"),
   path('profile/', views.profile, name="profile"),
   path('update_profile/', views.update_profile, name="update_profile"),
   path('profile_search/', views.profile_search, name="profile_search"),
   path('user_profile/<str:user>', views.user_profile, name="user_profile"),
   path('follow/', views.follow, name="follow"),
   path('unfollow/', views.unfollow, name="unfollow"),
]