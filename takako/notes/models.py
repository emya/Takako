from django.db import models
from django.contrib.auth.models import User
import datetime


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

class TravelerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)

class Showcase(models.Model):
    #photo = models.ImageField(upload_to=content_file_name, blank=True)
    photo = models.ImageField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Transaction(models.Model):
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_requests_created')
    respondent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_requests_received')
    # Status
    # 0: sent request
    # 1: canceled request
    # 2: accepted request
    # 3: rejected request
    # 4: purchased
    # 5: done (paid to respondent)
    status = models.IntegerField()
    price = models.IntegerField()
    created_at = models.DateField(null=True, blank=True)
    updated_at = models.DateField(null=True, blank=True)

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = models.CharField(max_length=100, blank=True)
    departure_date = models.DateField(null=True, blank=True)
    arrival_date = models.DateField(null=True, blank=True)
    status = models.IntegerField(default=0)
    # Status
    # 0: just create the trip

class ItemRequest(models.Model):
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_requests_created')
    respondent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_requests_received')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=200, blank=True)
    item_id = models.CharField(max_length=200, blank=True)
    item_url = models.CharField(max_length=300, blank=True)
    proposed_price = models.IntegerField()
    delivery_method = models.IntegerField()
    # method
    # 0: ship
    # 1: meet-up
    comment = models.CharField(max_length=200, blank=True)
    created_at = models.DateField(default=datetime.date.today)
