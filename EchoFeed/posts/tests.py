from django.test import TestCase
from .models import Comment
# Create your tests here.

data = Comment.objects.filter(post__id=1)
print(data)