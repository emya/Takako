from django.conf.urls import include, url
from rest_framework import routers

from .api import (
    NoteViewSet,
    TransactionAPI,
    ProfileViewSet,
    TripViewSet,
    ItemRequestViewSet,
    TravelerProfileViewSet,
    RegistrationAPI,
    LoginAPI,
    UserAPI
)

#from .views import ListNote

router = routers.DefaultRouter()
router.register('notes', NoteViewSet, 'notes')
router.register('profiles', ProfileViewSet, 'profiles')
router.register('trips', TripViewSet, 'trips')
router.register('requests/item', ItemRequestViewSet, 'request_item')
router.register('travelers/profiles', TravelerProfileViewSet, 'traveler_profiles')
#router.register('notes', NoteViewSet, 'notes')

urlpatterns = [
    url("^", include(router.urls)),
    url("^auth/register/$", RegistrationAPI.as_view()),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/user/$", UserAPI.as_view()),
    url('^transactions/$', TransactionAPI.as_view()),
]

