from django.db import models
from django.utils.translation import gettext as _
#from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

from jsonfield import JSONField

import datetime
from django.utils import timezone

import uuid


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, first_name, last_name, email, password, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=True,
            last_login=now,
            date_joined=now,
            **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, first_name, last_name, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(first_name, last_name, email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(max_length=254, null=True, blank=True)
    last_name = models.CharField(max_length=254, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):  # __unicode__ on Python 2
        return self.email

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
