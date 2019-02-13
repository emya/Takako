from django.shortcuts import render
from .api import NoteViewSet

# Create your views here.

from rest_framework import viewsets, permissions, generics

#from knox.models import AuthToken

from .models import Note
from .serializers import NoteSerializer#, CreateUserSerializer, UserSerializer, LoginUserSerializer

