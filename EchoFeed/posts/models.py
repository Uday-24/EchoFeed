from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import uuid

# Create your models here.
class UserPosts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post_img = models.ImageField(upload_to='posts/')
    caption = models.TextField(max_length=500, null=True, blank=True)
    slug = models.SlugField(unique=True)
    creation_time = models.DateTimeField(auto_now_add=True)
    reports = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        # Generate a unique slug only if it is not already set
        if not self.slug:
            base_slug = slugify(self.caption[:50] if self.caption else self.user.username)
            unique_slug = base_slug
            counter = 1
            
            # Ensure the slug is unique
            while UserPosts.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{uuid.uuid4().hex[:8]}"  # Generate random unique suffix
            
            self.slug = unique_slug

        super(UserPosts, self).save(*args, **kwargs)
    def __str__(self) -> str:
        return f"{self.user.username}'s post"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(UserPosts, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.username} Liked 'id={self.post.id}' post"