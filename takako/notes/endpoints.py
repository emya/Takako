from django.conf.urls import include, url
from rest_framework import routers

from .api import (
    NoteViewSet,
    ProfileViewSet,
    TravelerProfileViewSet,
    RegistrationAPI,
    LoginAPI,
    UserAPI
)

#from .views import ListNote

router = routers.DefaultRouter()
router.register('notes', NoteViewSet, 'notes')
router.register('profiles', ProfileViewSet, 'profiles')
router.register('travelers/profiles', TravelerProfileViewSet, 'traveler_profiles')
#router.register('notes', NoteViewSet, 'notes')

urlpatterns = [
    url("^", include(router.urls)),
    url("^auth/register/$", RegistrationAPI.as_view()),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/user/$", UserAPI.as_view()),
]
