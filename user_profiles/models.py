from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, default='')
    last_name = models.CharField(max_length=255, default='')
    position = models.CharField(max_length=255, default='')
    phone = models.CharField(max_length=20, default='')
    city = models.CharField(max_length=20, default='')
    avatar = models.ImageField(blank=True, upload_to='avatars/')

    def __str__(self):
        return f'{self.user}'

    def save(self, *args, **kwargs):
        if self.first_name == "":
            self.first_name = f"{self.user}"
        if self.last_name == "":
            self.last_name = f"{self.user}"
        super().save(*args, **kwargs)

    def get_tasks_num(self):
        return self.tasks.all().count()
