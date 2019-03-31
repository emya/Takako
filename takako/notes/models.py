from django.db import models
from django.contrib.auth.models import User


class Note(models.Model):
    text = models.CharField(max_length=255)
    user = models.ForeignKey(User, related_name="notes",
                              on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    residence = models.CharField(max_length=100, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)

class SProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)


class Showcase(models.Model):
    #photo = models.ImageField(upload_to=content_file_name, blank=True)
    photo = models.ImageField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = models.CharField(max_length=100, blank=True)
    departure_date = models.DateField(null=True, blank=True)
    arrival_date = models.DateField(null=True, blank=True)
    status = models.IntegerField()
