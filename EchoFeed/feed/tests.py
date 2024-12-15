from django.test import TestCase
from posts.models import *
from accounts.models import *
# Create your tests here.

current_user = User.objects.get(username='uday')
user_profile = UserProfile.objects.get(user=current_user)
following = Follow.objects.filter(follower=user_profile).values_list('following__user',flat=True)
liked_post = Like.objects.filter(user=current_user).values_list('post', flat=True)
posts = UserPosts.objects.filter(user__in=following).order_by('-creation_time').exclude(id__in=liked_post)
print(posts)