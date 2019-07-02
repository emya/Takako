from rest_framework import serializers

from .models import (
    Note, Profile, TravelerProfile,
    Trip, ItemRequest, Charge,
)

from rest_framework import serializers
from django.contrib.auth.models import User

from django.contrib.auth import authenticate

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'text', )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

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
    item_request = ItemRequestSerializer(read_only=True)

    class Meta:
        model = Charge
        fields = (
            'id', 'amount', 'user', 'item_request', 'card',
            'charge_id', 'email', 'token_id', 'type', 'status',
            'created_at', )


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        None,
                                        validated_data['password'])
        return user


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")