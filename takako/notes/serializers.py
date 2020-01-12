from rest_framework import serializers

from .models import (
    User, Note, Profile, Transfer,
    Trip, ItemRequest, Charge,
    Meetup, PurchaseNotification,
    SharedContact, ContactUs,
    RateTraveler, RateRequester, WishList
)

from rest_framework import serializers
#from django.contrib.auth.models import User

from django.contrib.auth import authenticate

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'text', )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')

class TravelerProfileSerializer(serializers.ModelSerializer):
    trip = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'profile', 'trip')

    def get_profile(self, obj):
        qs = obj.profile
        return ProfileSerializer(qs, read_only=True).data

    def get_trip(self, obj):
        qs = obj.trips.all()
        return TripSerializer(qs, many=True, read_only=True).data

class MeetupSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Meetup
        fields = ('id', 'user', 'date', 'dtime', 'address', 'comment')


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'bio', 'residence', 'birth_date', 'occupation', 'gender', 'image', 'user')

class TripSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'

class WishListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = WishList
        fields = '__all__'


class ItemRequestSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)
    respondent = UserSerializer(read_only=True)
    trip = TripSerializer(read_only=True)

    class Meta:
        model = ItemRequest
        fields = (
            'id', 'requester', 'respondent', 'trip', 'item_name', 'item_id',
            'item_url', 'item_image', 'price_per_item', 'n_items', 'proposed_price',
            'delivery_method', 'preferred_meetup_location', 'preferred_meetup_date',
            'comment', 'status', 'process_status', 'created_at', 'responded_at',
            'paid_at', 'purchase_notified_at', 'meetup_suggested_at', 'meetup_decided_at',
            'item_received_at', 'payment_transferred_at', 'decline_reason', 'decline_reason_comment',)

class PurchaseNotificationSerializer(serializers.ModelSerializer):
    item_request = ItemRequestSerializer(read_only=True)
    meetup_option1 = MeetupSerializer(read_only=True)
    meetup_option2 = MeetupSerializer(read_only=True)
    meetup_option3 = MeetupSerializer(read_only=True)
    final_meetup = MeetupSerializer(read_only=True)
    shared_contact = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseNotification
        fields = (
            'id', 'item_request', 'preferred_phone', 'preferred_email', 'meetup_option1',
            'meetup_option2', 'meetup_option3', 'action_taken_by', 'final_meetup', 'shared_contact'
        )

    def get_shared_contact(self, obj):
        qs = obj.shared_contact.all()
        return SharedContactSerializer(qs, many=True, read_only=True).data


class TransferSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Transfer


class ChargeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Charge
        fields = (
            'id', 'amount', 'user', 'item_request', 'card',
            'charge_id', 'email', 'token_id', 'type', 'status',
            'created_at', )

class ItemRequestHistorySerializer(serializers.ModelSerializer):
    charge = serializers.SerializerMethodField()
    purchase_notification = serializers.SerializerMethodField()
    requester = UserSerializer(read_only=True)
    respondent = UserSerializer(read_only=True)
    trip = TripSerializer(read_only=True)

    class Meta:
        model = ItemRequest
        fields = (
            'id', 'requester', 'respondent', 'trip', 'item_name',
            'item_id', 'item_url', 'item_image', 'price_per_item', 'n_items',
            'proposed_price', 'commission_fee', 'transaction_fee',
            'delivery_method', 'preferred_meetup_location', 'preferred_meetup_date',
            'comment', 'status', 'charge', 'process_status',
            'decline_reason', 'created_at', 'responded_at', 'paid_at', 'purchase_notified_at',
            'meetup_suggested_at', 'meetup_decided_at', 'item_received_at',
            'payment_transferred_at', 'decline_reason_comment', 'purchase_notification')

    def get_charge(self, obj):
        qs = obj.charges.all()
        return ChargeSerializer(qs, many=True, read_only=True).data

    def get_purchase_notification(self, obj):
        qs = obj.purchase_notification.all()
        return PurchaseNotificationSerializer(qs, many=True, read_only=True).data

class SharedContactSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SharedContact
        fields = ('id', 'user', 'preferred_phone', 'preferred_email', )

class ContactUsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ContactUs
        fields = ('id', 'user', 'name', 'email', 'message', )

class RateTravelerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RateTraveler
        fields = '__all__'

class RateRequesterSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RateRequester
        fields = '__all__'

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['first_name'],
            validated_data['last_name'],
            validated_data['email'],
            validated_data['password']
        )
        return user


class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")

