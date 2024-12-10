from django.test import TestCase
from posts.models import *
# Create your tests here.

post = UserPosts.objects.get(id=1)
comments = Comment.objects.filter(post=post)
comments = [{'id': c.id, 'profile_image':c.user.userprofile.profile_image.url, 'username': c.user.username, 'comment': c.comment, 'created_at': c.created_at} for c in comments]
print(comments)