from django.db import models

# Create your models here.
class Test(models.Model):
    name = models.CharField(max_length=20)
    mobile = models.CharField(max_length=20)
    email = models.CharField(max_length=500)

    def __str__(self):
        return self.name