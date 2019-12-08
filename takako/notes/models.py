from django.db import models
from django.utils.translation import gettext as _
#from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

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
    terms_version = models.IntegerField(default=0)

    stripe_user_id = models.CharField(max_length=100, null=True, blank=True)
    stripe_access_token = models.CharField(max_length=100, null=True, blank=True)
    stripe_refresh_token = models.CharField(max_length=100, null=True, blank=True)
    stripe_connect_created_at = models.DateTimeField(null=True)

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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(max_length=500, blank=True)
    residence = models.CharField(max_length=100, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    image = models.CharField(max_length=200, null=True)

class Showcase(models.Model):
    #photo = models.ImageField(upload_to=content_file_name, blank=True)
    photo = models.ImageField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trips")
    destination = models.CharField(max_length=100, blank=True)
    departure_date = models.DateField(null=True, blank=True)
    arrival_date = models.DateField(null=True, blank=True)
    status = models.IntegerField(default=0)
    # Status
    # 0: just create the trip
    created_at = models.DateTimeField(default=timezone.now)

class ItemRequest(models.Model):
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_requests_created')
    respondent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_requests_received')
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=200, blank=True)
    item_id = models.CharField(max_length=200, blank=True)
    item_url = models.CharField(max_length=300, blank=True)
    item_image = models.CharField(max_length=200, null=True, blank=True)
    price_per_item = models.IntegerField(null=True)
    n_items = models.IntegerField(default=1)
    proposed_price = models.IntegerField()
    commission_fee = models.IntegerField()
    transaction_fee = models.IntegerField()
    # Method
    # 0: meet-up
    # 1: ship
    delivery_method = models.IntegerField(default=0)
    comment = models.CharField(max_length=200, blank=True)
    preferred_meetup_location = models.CharField(max_length=300, blank=True)
    preferred_meetup_date = models.CharField(max_length=300, blank=True)
    # Status
    # 0: sent request
    # 1: canceled request
    # 2: accepted request
    # 3: rejected request
    # 4: canceled request by traveler
    status = models.IntegerField(default=0)
    # Process Status
    # 0. request_sent
    # 1. request_responded
    # 2. payment_made
    # 3. purchase_notified
    # 4. meetup_suggested
    # 5. meetup_decided
    # 6. item_received
    # 7. payment_transferred
    # 8. request_cancelled
    # 9. request_cancelled_by_traveler
    process_status = models.CharField(max_length=100, default="request_sent")
    # Decline Reason
    # 0: Other
    # 1: The proposed price is not enough
    # 2: The commission fee is not enough
    # 3: The item is too big/heavy
    # 4: The item is hard to get
    decline_reason = models.IntegerField(default=-1)
    decline_reason_comment = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    responded_at = models.DateTimeField(null=True)
    paid_at = models.DateTimeField(null=True)
    purchase_notified_at = models.DateTimeField(null=True)
    meetup_suggested_at = models.DateTimeField(null=True)
    meetup_decided_at = models.DateTimeField(null=True)
    item_received_at = models.DateTimeField(null=True)
    payment_transferred_at = models.DateTimeField(null=True)

class Charge(models.Model):
    #amount in dollar
    amount = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_request = models.ForeignKey(ItemRequest, on_delete=models.CASCADE, related_name="charges")
    card = JSONField()
    address = JSONField()
    charge_id = models.CharField(max_length=100)
    # Null = True for now
    email = models.EmailField(null=True)
    token_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)

class Transfer(models.Model):
    #amount in dollar
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_request = models.ForeignKey(ItemRequest, on_delete=models.CASCADE, related_name="transfers")
    amount = models.IntegerField()
    #amount_reversed = models.IntegerField()
    #balance_transaction = models.CharField(max_length=100)
    currency = models.CharField(max_length=100)
    description = models.CharField(max_length=200, null=True)
    destination = models.CharField(max_length=100)
    #destination_payment = models.CharField(max_length=100)
    stripe_id = models.CharField(max_length=100)
    livemode = models.BooleanField()
    metadata = JSONField()
    object = models.CharField(max_length=100)
    #reversals = JSONField()
    #reversed = models.BooleanField()
    #source_transaction = models.CharField(max_length=100, null=True)
    #source_type = models.CharField(max_length=100, null=True)
    #transfer_group = models.CharField(max_length=100, null=True)

    created_at = models.DateTimeField(default=timezone.now)

class Meetup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    dtime = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=300, blank=True)
    comment = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

class PurchaseNotification(models.Model):
    item_request = models.ForeignKey(ItemRequest, on_delete=models.CASCADE, related_name="purchase_notification")
    preferred_phone = models.CharField(max_length=100, blank=True)
    preferred_email = models.CharField(max_length=200, blank=True)
    meetup_option1 = models.ForeignKey(Meetup, on_delete=models.CASCADE, related_name="purchase_notification_meetup1")
    meetup_option2 = models.ForeignKey(Meetup, null=True, on_delete=models.CASCADE, related_name="purchase_notification_meetup2")
    meetup_option3 = models.ForeignKey(Meetup, null=True, on_delete=models.CASCADE, related_name="purchase_notification_meetup3")
    # action_taken_by
    # 0: traveler
    # 1: requester
    action_taken_by = models.IntegerField(default=0)
    final_meetup = models.ForeignKey(Meetup, null=True, on_delete=models.CASCADE, related_name="purchase_notification_finalmeetup")
    created_at = models.DateTimeField(default=timezone.now)

class SharedContact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    preferred_phone = models.CharField(max_length=100, blank=True)
    preferred_email = models.CharField(max_length=200, blank=True)
    purchase_notification = models.ForeignKey(PurchaseNotification, on_delete=models.CASCADE, related_name="shared_contact")
    created_at = models.DateTimeField(default=timezone.now)

class ContactUs(models.Model):
    user = models.ForeignKey(User, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=200)
    message = models.CharField(max_length=300)

class RateTraveler(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_reviewer')
    item_request = models.ForeignKey(ItemRequest, on_delete=models.CASCADE)
    traveler = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_reviewee')
    rating = models.IntegerField()

class RateRequester(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_reviewer')
    item_request = models.ForeignKey(ItemRequest, on_delete=models.CASCADE)
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_reviewee')
    rating = models.IntegerField()

