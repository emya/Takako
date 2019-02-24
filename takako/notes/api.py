from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from knox.models import AuthToken

from .models import Note, Profile, SProfile
from .serializers import (
    NoteSerializer,
    ProfileSerializer,
    SProfileSerializer,
    CreateUserSerializer,
    UserSerializer,
    LoginUserSerializer
)

#from rest_framework.authentication import SessionAuthentication, BasicAuthentication

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    #permission_classes = [permissions.AllowAny, ]
    serializer_class = NoteSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    #permission_classes = [permissions.AllowAny, ]
    serializer_class = ProfileSerializer

    def get_queryset(self):
        queryset = Profile.objects.all().filter(user=self.request.user)
        print("queryset", queryset)
        for q in queryset:
            print(q)
        return queryset

class SProfileViewSet(viewsets.ModelViewSet):
    #permission_classes = [permissions.AllowAny, ]
    serializer_class = SProfileSerializer

    def get_queryset(self):
        others = self.request.GET.get('others')
        all = self.request.GET.get('all')
        queryset = SProfile.objects.all()

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
