from django.conf.urls import include, url
from rest_framework import routers

from .api import (
    NoteViewSet,
    StripeAuthorizeCallbackAPI,
    SharedContactViewSet,
    MeetupSuggestionViewSet,
    PurchaseNotificationViewSet,
    ProfileViewSet,
    TripViewSet,
    ItemRequestViewSet,
    ContactUsViewSet,
    TransferViewSet,
    ChargeViewSet,
    ItemRequestHistoryViewSet,
    TravelerProfileViewSet,
    RateTravelerViewSet,
    RateRequesterViewSet,
    WishListViewSet,
    RegistrationAPI,
    LoginAPI,
    UserAPI,
)

#from .views import ListNote

router = routers.DefaultRouter()
router.register('notes', NoteViewSet, 'notes')
router.register('purchase/notification', PurchaseNotificationViewSet, 'purchase_notification')
router.register('suggest/meetups', MeetupSuggestionViewSet, 'suggest_meetup')
router.register('share/contact', SharedContactViewSet, 'share_contact')
router.register('contact/us', ContactUsViewSet, 'contact_us')
router.register('profiles', ProfileViewSet, 'profiles')
router.register('trips', TripViewSet, 'trips')
router.register('wishlist', WishListViewSet, 'wishlist')
#router.register('requests/item/?P<id>\d+)$', ItemRequestViewSet, 'request_item')
router.register('requests/item', ItemRequestViewSet, 'request_item')
router.register('requests/charge', ChargeViewSet, 'request_charge')
router.register('requests/transfer', TransferViewSet, 'request_transfer')
router.register('requests/history', ItemRequestHistoryViewSet, 'request_item_history')
router.register('travelers/profiles', TravelerProfileViewSet, 'traveler_profiles')
router.register('rate/traveler', RateTravelerViewSet, 'rate_traveler')
router.register('rate/requester', RateRequesterViewSet, 'rate_requester')
#router.register('notes', NoteViewSet, 'notes')

urlpatterns = [
    url("^", include(router.urls)),
    url("^auth/register/$", RegistrationAPI.as_view()),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/user/$", UserAPI.as_view()),
    url(r"^stripe/", include("djstripe.urls", namespace="djstripe")),
    url(r"^users/stripe/oauth/callback", StripeAuthorizeCallbackAPI.as_view()),

    # NEW: The django-rest-passwordreset urls to request a token and confirm pw-reset
    url(r"^reset/password/", include('django_rest_passwordreset.urls', namespace='password_reset')),
]

