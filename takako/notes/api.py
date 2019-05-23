import json
from rest_framework import viewsets, permissions, generics

from rest_framework.response import Response

from knox.models import AuthToken

from .models import Note, Profile, Transaction, TravelerProfile, Trip, ItemRequest
from django.contrib.auth.models import User
from .serializers import (
    NoteSerializer,
    TransactionSerializer,
    ItemRequestSerializer,
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
    #permission_classes = [permissions.AllowAny, ]
    serializer_class = NoteSerializer

class TransactionAPI(generics.GenericAPIView):
    serializer_class = TransactionSerializer

    def get(self, request):
        # Transaction for sent requests
        queryset_requester = Transaction.objects.all().filter(requester=request.user)
        # Transaction for received requests
        queryset_respondent = Transaction.objects.all().filter(respondent=request.user)
        return Response({ 'sent_requests': queryset_requester, 'received_requests': queryset_respondent})

class ItemRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ItemRequestSerializer

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
        queryset = ItemRequest.objects.all()

        if userId:
            user = User.objects.get(pk=userId)
            queryset_respondent = ItemRequest.objects.filter(respondent=user)
            queryset_requester = ItemRequest.objects.filter(requester=user)

            custom_data = {
                'sent_item_requests': self.serializer_class(queryset_requester, many=True).data,
                'received_item_requests': self.serializer_class(queryset_respondent, many=True).data,
            }
            return Response(custom_data)

        return queryset

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
