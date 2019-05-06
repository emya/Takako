from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from knox.models import AuthToken

from .models import Note, Profile, Transaction, TravelerProfile
from django.contrib.auth.models import User
from .serializers import (
    NoteSerializer,
    TransactionSerializer,
    ProfileSerializer,
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

class ProfileViewSet(viewsets.ModelViewSet):
    #permission_classes = [permissions.AllowAny, ]
    serializer_class = ProfileSerializer

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
