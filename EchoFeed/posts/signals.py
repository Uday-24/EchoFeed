from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F

from accounts.models import UserProfile
from .models import UserPosts, Like


@receiver(post_save, sender=UserPosts)
def increment_post_count(sender, instance, created, **kwargs):
    if created:
        profile = UserProfile.objects.get(user=instance.user)
        profile.post_count += 1
        profile.save()

@receiver(post_save, sender=Like)
def incremenet_like_count(sender, instance, created, **kwargs):
    if created:
        instance.post.like_count = F('like_count') + 1
        instance.post.save(update_fields=['like_count'])

@receiver(post_delete, sender=Like)
def decrement_like_count(sender, instance, **kwargs):
    instance.post.like_count = F('like_count') - 1
    instance.post.save(update_fields=['like_count'])