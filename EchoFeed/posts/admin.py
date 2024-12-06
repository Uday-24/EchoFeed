from django.contrib import admin
from .models import UserPosts,Like
# Register your models here.

admin.site.register(UserPosts)
admin.site.register(Like)