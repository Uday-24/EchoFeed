from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_private_account = models.BooleanField(default=False)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], null=True, blank=True)
    comments_settings = models.CharField(max_length=10, choices=[('Everyone','Everyone'), ('Followers', 'Followers'), ('No one', 'No one')], default='Everyone')
    is_2fa_on = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Settings for {self.user.username}"