from django.conf.urls import include, url
from rest_framework import routers

from .api import (
    NoteViewSet,
    SharedContactViewSet,
    MeetupSuggestionViewSet,
    PurchaseNotificationViewSet,
    ProfileViewSet,
    TripViewSet,
    ItemRequestViewSet,
    ChargeViewSet,
    ItemRequestHistoryViewSet,
    TravelerProfileViewSet,
    RegistrationAPI,
    LoginAPI,
    UserAPI,
    CustomPasswordTokenVerificationView
)

#from .views import ListNote

router = routers.DefaultRouter()
router.register('notes', NoteViewSet, 'notes')
router.register('purchase/notification', PurchaseNotificationViewSet, 'purchase_notification')
router.register('suggest/meetups', MeetupSuggestionViewSet, 'suggest_meetup')
router.register('share/contact', SharedContactViewSet, 'share_contact')
router.register('profiles', ProfileViewSet, 'profiles')
router.register('trips', TripViewSet, 'trips')
#router.register('requests/item/?P<id>\d+)$', ItemRequestViewSet, 'request_item')
router.register('requests/item', ItemRequestViewSet, 'request_item')
router.register('requests/charge', ChargeViewSet, 'request_charge')
router.register('requests/history', ItemRequestHistoryViewSet, 'request_item_history')
router.register('travelers/profiles', TravelerProfileViewSet, 'traveler_profiles')
#router.register('notes', NoteViewSet, 'notes')

urlpatterns = [
    url("^", include(router.urls)),
    url("^auth/register/$", RegistrationAPI.as_view()),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/user/$", UserAPI.as_view()),
    url(r"^stripe/", include("djstripe.urls", namespace="djstripe")),

    # NEW: The django-rest-passwordreset urls to request a token and confirm pw-reset
    url(r"^reset/password/", include('django_rest_passwordreset.urls', namespace='password_reset')),
]

