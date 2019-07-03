import json
from rest_framework import status, viewsets, permissions, generics

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

from knox.models import AuthToken

from .models import (
    Note, Profile, TravelerProfile,
    Trip, ItemRequest, Charge,
)
from django.contrib.auth.models import User
from .serializers import (
    NoteSerializer,
    ItemRequestSerializer,
    ItemRequestHistorySerializer,
    ChargeSerializer,
    ProfileSerializer,
    TripSerializer,
    TravelerProfileSerializer,
    CreateUserSerializer,
    UserSerializer,
    LoginUserSerializer
)

#from rest_framework.authentication import SessionAuthentication, BasicAuthentication

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class ItemRequestHistoryViewSet(viewsets.ModelViewSet):
    queryset = ItemRequest.objects.all()
    serializer_class = ItemRequestHistorySerializer

class ItemRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ItemRequestSerializer
    queryset = ItemRequest.objects.all()

    def create(self, request):
        respondent_id = request.data.pop("respondent_id")
        trip_id = request.data.pop("trip_id")
        respondent = User.objects.get(pk=respondent_id)
        trip = Trip.objects.get(pk=trip_id)
        item_request = ItemRequest.objects.create(requester=request.user, respondent=respondent, trip=trip, **request.data)
        serializer = self.serializer_class(item_request)
        return Response(serializer.data)

    def list(self, request):
        userId = request.GET.get('userId')

        if userId:
            user = User.objects.get(pk=userId)
            queryset_respondent = ItemRequest.objects.filter(respondent=user)
            queryset_requester = ItemRequest.objects.filter(requester=user)

            custom_data = {
                'sent_item_requests': self.serializer_class(queryset_requester, many=True).data,
                'received_item_requests': self.serializer_class(queryset_respondent, many=True).data,
            }
            return Response(custom_data)

        return self.queryset

    """
    def get_queryset(self):
        userId = self.request.GET.get('userId')

        queryset = ItemRequest.objects.all()

        if userId:
            user = User.objects.get(pk=userId)
            queryset_requester = queryset.filter(requester=user)
            queryset_respondent = queryset.filter(respondent=user)
            return queryset

        # TODO: handle exception
        queryset = queryset.filter(user=self.request.user)
        return queryset
    """

import stripe
class ChargeViewSet(viewsets.ModelViewSet):
    stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

    queryset = Charge.objects.all()
    serializer_class = ChargeSerializer

    def create(self, request):
        item_request_id = request.data.pop("item_request_id")
        body = request.data.pop("stripe_body")
        stripe_token = body["stripeToken"]
        stripe_charge = stripe.Charge.create(
            amount=500,
            currency='usd',
            description='A Django charge',
            source=stripe_token
        )
        amount = stripe_charge["amount"]
        charge_id = stripe_charge["id"]
        status = stripe_charge["status"]
        card = stripe_charge["payment_method_details"].get("card")
        type = stripe_charge["payment_method_details"].get("type")
        item_request = ItemRequest.objects.get(pk=item_request_id)
        charge = Charge.objects.create(
            user=request.user,
            amount=amount,
            item_request=item_request,
            card=card,
            charge_id=charge_id,
            token_id=stripe_token,
            type=type,
            status=status,
        )
        serializer = self.serializer_class(charge)
        return Response(serializer.data)

class TripViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated,]
    serializer_class = TripSerializer

    def create(self, request):
        trip = Trip.objects.create(user=request.user, **request.data)
        serializer = self.serializer_class(trip)
        return Response(serializer.data)

    def update(self, request, pk):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def get_queryset(self):
        userId = self.request.GET.get('userId')

        queryset = Trip.objects.all()

        if userId:
            user = User.objects.get(pk=userId)
            queryset = queryset.filter(user=user)
            return queryset

        # TODO: handle exception
        queryset = queryset.filter(user=self.request.user)
        return queryset

class ProfileViewSet(viewsets.ModelViewSet):
    #permission_classes = [permissions.AllowAny, ]
    serializer_class = ProfileSerializer

    def update(self, request, pk):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def get_queryset(self):
        userId = self.request.GET.get('userId')
        all = self.request.GET.get('all')
        others = self.request.GET.get('others')
        residence = self.request.GET.get('residence')
        destination = self.request.GET.get('destination')

        queryset = Profile.objects.all()

        if userId:
            user = User.objects.get(pk=userId)
            queryset = queryset.filter(user=user)
            return queryset

        if residence:
            queryset = queryset.filter(residence=residence)

        if all:
            return queryset
        if others:
            queryset = queryset.exclude(user=self.request.user)
            return queryset

        # TODO: handle exception
        queryset = queryset.filter(user=self.request.user)
        return queryset

class TravelerProfileViewSet(viewsets.ModelViewSet):
    #permission_classes = [permissions.AllowAny, ]
    serializer_class = TravelerProfileSerializer

    def get_queryset(self):
        others = self.request.GET.get('others')
        all = self.request.GET.get('all')
        queryset = TravelerProfile.objects.all()

        if all:
            return queryset
        if others:
            queryset = queryset.exclude(user=self.request.user)
            return queryset

        queryset = queryset.filter(user=self.request.user)
        return queryset

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        Profile.objects.create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        print("login request", request)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
