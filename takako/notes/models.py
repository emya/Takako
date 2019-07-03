from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from jsonfield import JSONField

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
    gender = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)

class TravelerProfile(models.Model):
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
    # Status
    # 0: sent request
    # 1: canceled request
    # 2: accepted request
    # 3: rejected request
    status = models.IntegerField(default=0)
    created_at = models.DateField(default=datetime.date.today)

class Charge(models.Model):
    amount = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_request = models.ForeignKey(ItemRequest, on_delete=models.CASCADE, related_name="charges")
    card = JSONField()
    charge_id = models.CharField(max_length=100)
    # Null = True for now
    email = models.EmailField(null=True)
    token_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    created_at = models.DateField(default=datetime.date.today)
