from django.db.models.signals import post_save, post_delete
from django.contrib.auth.models import User
from .models import *
from settings.models import *
from django.dispatch import receiver

from accounts.models import Follow

@receiver(post_save, sender=User)
def bulit_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        UserSettings.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.userprofile.save()
    instance.usersettings.save()

@receiver(post_save, sender=Follow)
def update_on_follow(sender, instance, created, **kwargs):
    if created:
        instance.follower.following_count += 1
        instance.following.followers_count += 1
        instance.follower.save()
        instance.following.save()

@receiver(post_delete, sender=Follow)
def update_on_delete(sender, instance, **kwargs):
    instance.follower.following_count -= 1
    instance.following.followers_count -= 1
    instance.follower.save()
    instance.following.save()