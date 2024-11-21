from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_images/', default='profile_images/pu.jpg')
    nickname = models.CharField(max_length=50, null=True, blank=True, default='')
    bio = models.TextField(max_length=250, null=True, blank=True)
    post_count = models.PositiveIntegerField(default=0)
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.user.username

class Follow(models.Model):
    follower = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="following_set")
    following = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="follower_set")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')
        indexes = [
            models.Index(fields=['follower', 'following']),
        ]

    def __str__(self) -> str:
        return f"{self.follower} follows {self.following}"
    
class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_private_account = models.BooleanField(default=False)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    comments_settings = models.CharField(max_length=10, choices=[('Everyone','Everyone'), ('Followers', 'Followers'), ('No one', 'No one')], default='Everyone')
    is_2fa_on = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Settings for {self.user.username}"