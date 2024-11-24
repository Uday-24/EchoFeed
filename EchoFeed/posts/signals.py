from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import UserProfile
from .models import UserPosts


@receiver(post_save, sender=UserPosts)
def increment_post_count(sender, instance, created, **kwargs):
    if created:
        profile = UserProfile.objects.get(user=instance.user)
        profile.post_count += 1
        profile.save()