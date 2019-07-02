from django.conf.urls import include, url
from rest_framework import routers

from .api import (
    NoteViewSet,
    ProfileViewSet,
    TripViewSet,
    ItemRequestViewSet,
    ChargeViewSet,
    RequestHistoryAPI,
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
#router.register('requests/item/?P<id>\d+)$', ItemRequestViewSet, 'request_item')
router.register('requests/item', ItemRequestViewSet, 'request_item')
router.register('requests/charge', ChargeViewSet, 'request_charge')
router.register('travelers/profiles', TravelerProfileViewSet, 'traveler_profiles')
#router.register('notes', NoteViewSet, 'notes')

urlpatterns = [
    url("^", include(router.urls)),
    url("^auth/register/$", RegistrationAPI.as_view()),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/user/$", UserAPI.as_view()),
    url(r"^stripe/", include("djstripe.urls", namespace="djstripe")),
    url('^requests/history/$', RequestHistoryAPI.as_view()),
]

