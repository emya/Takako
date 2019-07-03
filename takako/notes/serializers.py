from rest_framework import serializers

from .models import (
    User, Note, Profile, TravelerProfile,
    Trip, ItemRequest, Charge,
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
    user = UserSerializer(read_only=True)

    class Meta:
        model = TravelerProfile
        fields = ('id', 'bio', 'user')

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'bio', 'residence', 'birth_date', 'occupation', 'gender', 'user')

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ('id', 'departure_date', 'arrival_date', 'destination', 'status')


class ItemRequestSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)
    respondent = UserSerializer(read_only=True)
    trip = TripSerializer(read_only=True)

    class Meta:
        model = ItemRequest
        fields = (
            'id', 'requester', 'respondent', 'trip',
            'item_name', 'item_id', 'item_url', 'proposed_price',
            'delivery_method', 'comment', 'status')

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
    requester = UserSerializer(read_only=True)
    respondent = UserSerializer(read_only=True)
    trip = TripSerializer(read_only=True)

    class Meta:
        model = ItemRequest
        fields = (
            'id', 'requester', 'respondent', 'trip',
            'item_name', 'item_id', 'item_url', 'proposed_price',
            'delivery_method', 'comment', 'status', 'charge')

    def get_charge(self, obj):
        qs = obj.charges.all()
        return ChargeSerializer(qs, many=True, read_only=True).data

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