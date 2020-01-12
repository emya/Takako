import json
from rest_framework import (
    status, viewsets, permissions, generics,
    parsers, renderers, views
)

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.db.models import Prefetch

from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import EmailMultiAlternatives

from django_rest_passwordreset.models import ResetPasswordToken
from django_rest_passwordreset.views import get_password_reset_token_expiry_time
from django_rest_passwordreset.signals import reset_password_token_created
from django.utils import timezone
from django.urls import reverse
from django.template.loader import render_to_string
from rest_framework.parsers import (
    MultiPartParser, FormParser, FileUploadParser, FormParser
)
from django.core.files.uploadedfile import InMemoryUploadedFile

from datetime import timedelta, datetime

from knox.models import AuthToken

from celery import Celery
import stripe
import boto3

import requests


from .models import (
    User, Note, Profile, Transfer,
    Trip, ItemRequest, Charge,
    PurchaseNotification, Meetup,
    SharedContact, ContactUs,
    RateTraveler, RateRequester, WishList
)
#from django.contrib.auth.models import User
from .serializers import (
    NoteSerializer,
    SharedContactSerializer,
    PurchaseNotificationSerializer,
    ItemRequestSerializer,
    ItemRequestHistorySerializer,
    ContactUsSerializer,
    TransferSerializer,
    ChargeSerializer,
    ProfileSerializer,
    TripSerializer,
    WishListSerializer,
    TravelerProfileSerializer,
    RateTravelerSerializer,
    RateRequesterSerializer,
    CreateUserSerializer,
    UserSerializer,
    LoginUserSerializer,
)

from .tasks import send_email

from .permissions import BaseUserPermissions, BaseTransactionPermissions

#from rest_framework.authentication import SessionAuthentication, BasicAuthentication
site_url = settings.SITE_URL

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class StripeAuthorizeCallbackAPI(views.APIView):

    def post(self, request):
        code = request.data.get('code')
        request_id = request.data.get('state')
        if code:
            data = {
                'client_secret': settings.STRIPE_SECRET_KEY,
                'grant_type': 'authorization_code',
                'client_id': settings.STRIPE_CLIENT_ID,
                'code': code
            }
            url = 'https://connect.stripe.com/oauth/token'
            resp = requests.post(url, params=data)

            stripe_user_id = resp.json()['stripe_user_id']
            stripe_access_token = resp.json()['access_token']
            stripe_refresh_token = resp.json()['refresh_token']
            user = User.objects.get(pk=self.request.user.id)
            #user = User.objects.get(pk=self.request.user.id)
            user.stripe_access_token = stripe_access_token
            user.stripe_refresh_token = stripe_refresh_token
            user.stripe_user_id = stripe_user_id
            user.save()

            return Response(data="User updated")

        return Response(data="User not updated")

class SharedContactViewSet(viewsets.ModelViewSet):
    queryset = SharedContact.objects.all()
    serializer_class = SharedContactSerializer

    def create(self, request):
        purchase_notification_id = request.data.pop("purchase_notification_id")
        purchase_notification = PurchaseNotification.objects.get(pk=purchase_notification_id)

        process_status = request.data.pop("process_status")

        purchase_notification.item_request.process_status = process_status
        now = timezone.now()
        purchase_notification.item_request.meetup_decided_at = now
        purchase_notification.item_request.save()

        accepted_meetup_id = request.data.pop("accepted_meetup_id")
        accepted_meetup = Meetup.objects.get(pk=accepted_meetup_id)
        purchase_notification.final_meetup = accepted_meetup

        action_taken_by = int(request.data.pop("action_taken_by"))
        purchase_notification.action_taken_by = action_taken_by
        purchase_notification.save()

        shared_contact = SharedContact.objects.create(
            purchase_notification=purchase_notification,
            user=self.request.user,
            **request.data
        )
        serializer = self.serializer_class(shared_contact)
        if action_taken_by == 0:
            # Notify requester
            user = purchase_notification.item_request.requester
        elif action_taken_by == 1:
            # Notify traveler
            user = purchase_notification.item_request.respondent

        link = f"{site_url}/login?next=/transaction/history/{purchase_notification.item_request.id}"
        html_message = render_to_string('email-meetup-accepted.html',
                                            {'user': user, 'link': link})
        send_email.delay(
                "Your meetup option has been accepted!",
                "Your meetup option has been accepted! Check at Torimo!",
                html_message, user.email)
        return Response(serializer.data)

class PurchaseNotificationViewSet(viewsets.ModelViewSet):
    queryset = PurchaseNotification.objects.all()
    serializer_class = PurchaseNotificationSerializer

    def create(self, request):
        request_id = request.data.pop("request_id")
        item_request = ItemRequest.objects.get(pk=request_id)
        item_request.process_status = "purchase_notified"
        now = timezone.now()
        item_request.purchase_notified_at = now
        item_request.save()

        meetup_option1 = request.data.pop("meetup_option1")
        meetup_option2 = request.data.pop("meetup_option2")
        meetup_option3 = request.data.pop("meetup_option3")

        meetup1 = Meetup.objects.create(user=self.request.user, **meetup_option1)
        meetup2 = Meetup.objects.create(user=self.request.user, **meetup_option2)
        meetup3 = Meetup.objects.create(user=self.request.user, **meetup_option3)

        purchase_notification = PurchaseNotification.objects.create(
            item_request=item_request, meetup_option1=meetup1,
            meetup_option2=meetup2, meetup_option3=meetup3,
            final_meetup=None, **request.data
        )
        serializer = self.serializer_class(purchase_notification)

        link = f"{site_url}/login?next=/transaction/history/{item_request.id}"
        html_message = render_to_string('email-purchase-notification.html', {'user': item_request.requester, 'link': link})

        # Notify respondent
        send_email.delay(
            "Your requested item has been purchased!",
            "Your requested item has been purchased! Check at Torimo!",
            html_message, item_request.requester.email)

        return Response(serializer.data)

class MeetupSuggestionViewSet(viewsets.ModelViewSet):
    queryset = PurchaseNotification.objects.all()
    serializer_class = PurchaseNotificationSerializer

    def create(self, request):
        purchase_notification_id = request.data.pop("purchase_notification_id")
        purchase_notification = PurchaseNotification.objects.get(pk=purchase_notification_id)

        meetup_option1 = request.data.pop("meetup_option1")
        meetup_option2 = request.data.pop("meetup_option2")
        meetup_option3 = request.data.pop("meetup_option3")
        process_status = request.data.pop("process_status")
        action_taken_by = int(request.data.pop("action_taken_by"))

        meetup1 = Meetup.objects.create(user=self.request.user, **meetup_option1)
        meetup2 = Meetup.objects.create(user=self.request.user, **meetup_option2)
        meetup3 = Meetup.objects.create(user=self.request.user, **meetup_option3)

        purchase_notification.meetup_option1 = meetup1
        purchase_notification.meetup_option2 = meetup2
        purchase_notification.meetup_option3 = meetup3
        purchase_notification.action_taken_by = action_taken_by
        purchase_notification.save()

        purchase_notification.item_request.process_status = process_status
        now = timezone.now()
        purchase_notification.item_request.meetup_suggested_at = now
        purchase_notification.item_request.save()
        serializer = self.serializer_class(purchase_notification)

        link = f"{site_url}/login?next=/transaction/history/{purchase_notification.item_request.id}"
        if action_taken_by == 0:
            # Notify requester
            user = purchase_notification.item_request.requester
        elif action_taken_by == 1:
            # Notify traveler
            user = purchase_notification.item_request.respondent

        html_message = render_to_string('email-meetup-suggested.html', {'user': user, 'link': link})
        send_email.delay("You got new meetup suggestion!", "You got new meetup suggestion! Check at Torimo!", html_message, user.email)
        return Response(serializer.data)


class ItemRequestHistoryViewSet(viewsets.ModelViewSet):
    permission_classes = [BaseTransactionPermissions,]
    queryset = ItemRequest.objects.all()
    serializer_class = ItemRequestHistorySerializer

class ItemRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ItemRequestSerializer
    queryset = ItemRequest.objects.all()

    def create(self, request):
        data = request.data.copy()
        respondent_id = data.pop("respondent_id")[0]
        trip_id = data.pop("trip_id")[0]
        item_image = data.pop("item_image")

        is_upload_image = False

        if item_image:
            image = item_image[0]
            if isinstance(image, InMemoryUploadedFile):
                data['item_image'] = image.name
                is_upload_image = True

        respondent = User.objects.get(pk=respondent_id)
        trip = Trip.objects.get(pk=trip_id)

        item_request = ItemRequest.objects.create(requester=request.user, respondent=respondent, trip=trip, **data.dict())
        serializer = self.serializer_class(item_request)

        if is_upload_image:
            upload_to_s3(image, f"requests/{serializer.data['id']}/{image.name}")

        link = f"{site_url}/login?next=/transaction/history/{item_request.id}"
        html_message = render_to_string('email-request-received.html', {'user': respondent, 'link': link})

        # Notify respondent
        send_email.delay("You got new Request!", "You got new Request! Check at Torimo!", html_message, respondent.email)

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        status = request.data.get("status")
        process_status = request.data.get("process_status")
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        link = f"{site_url}/login?next=/transaction/history/{instance.id}"

        if status and process_status:
            if status == 2 and process_status == "request_responded":
                # Request was accepted
                html_message = render_to_string('email-request-accepted.html', {'user': instance.requester, 'link': link})
                send_email.delay(
                    "Your request has been responded!",
                    "Your request has been responded! Check at Torimo!",
                    html_message, instance.requester.email)
            elif status == 1 and process_status == "request_cancelled":
                # Request was cancelled by requester
                html_message = render_to_string('email-request-cancelled-by-requester.html', {'user': instance.respondent, 'link': link})
                send_email.delay(
                    "The request has been cancelled",
                    "The request has been cancelled. Check at Torimo!",
                    html_message, instance.respondent.email)
            elif status == 4 and process_status == "request_cancelled_by_traveler":
                # Request was cancelled by traveler
                html_message = render_to_string('email-request-cancelled-by-traveler.html', {'user': instance.requester, 'link': link})
                send_email.delay(
                    "Your request has been cancelled",
                    "Your request has been cancelled. Check at Torimo!",
                    html_message, instance.requester.email)
            elif status == 3 and process_status == "request_responded":
                # Request was rejected
                html_message = render_to_string('email-request-declined.html', {'user': instance.requester, 'link': link})
                send_email.delay(
                    "Your request has been responded!",
                    "Your request has been responded! Check at Torimo!",
                    html_message, instance.requester.email)
        elif process_status:
            if process_status == "item_received":
                # Item received
                html_message = render_to_string('email-item-received.html', {'user': instance.respondent, 'link': link})
                send_email.delay(
                    "The requested item has been delivered!",
                    "The requested item has been delivered! Check at Torimo!",
                    html_message, instance.respondent.email)
        return Response(serializer.data)

    def list(self, request):
        userId = request.GET.get('userId')

        if userId:
            user = User.objects.get(pk=userId)
            queryset_respondent = ItemRequest.objects.filter(respondent=user).order_by('-created_at')
            queryset_requester = ItemRequest.objects.filter(requester=user).order_by('-created_at')

            custom_data = {
                'sent_item_requests': self.serializer_class(queryset_requester, many=True).data,
                'received_item_requests': self.serializer_class(queryset_respondent, many=True).data,
            }
            return Response(custom_data)

        return self.queryset

class ContactUsViewSet(viewsets.ModelViewSet):
    serializer_class = ContactUsSerializer
    queryset = ContactUs.objects.all()

    def create(self, request):
        user = request.user
        contactus = ContactUs.objects.create(user=user, **request.data)
        serializer = self.serializer_class(contactus)

        # Notify user
        html_message = render_to_string('email-contactus.html', {'user': user})
        send_email.delay("Thank you for your message", "Thank you for joining us!", html_message, request.data['email'])

        # Notify us
        send_email.delay("New message from our user", request.data['message'], None, settings.EMAIL_HOST_USER)
        return Response(serializer.data)

class TransferViewSet(viewsets.ModelViewSet):
    stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer

    def create(self, request):
        item_request_id = request.data.pop("requestId")
        item_request = ItemRequest.objects.get(pk=item_request_id)
        if item_request.payment_transferred_at:
            return Response(data="Already Paid")

        user = User.objects.get(pk=self.request.user.id)
        amount = item_request.proposed_price + item_request.commission_fee

        stripe_transfer = stripe.Transfer.create(
            amount=amount*100,
            currency="usd",
            destination=user.stripe_user_id,
        )

        transfer = Transfer.objects.create(
            user=request.user,
            item_request=item_request,
            amount=amount,
            currency='usd',
            description=stripe_transfer.description,
            destination=stripe_transfer.destination,
            stripe_id=stripe_transfer.id,
            livemode=stripe_transfer.livemode,
            metadata=stripe_transfer.metadata,
            object=stripe_transfer.object,
        )
        serializer = self.serializer_class(transfer)
        now = timezone.now()
        item_request.payment_transferred_at = now
        item_request.process_status = "payment_transferred"
        item_request.save()

        link = f"{site_url}/login?next=/transaction/history/{item_request.id}"
        html_message = render_to_string(
            'email-payment-transferred.html', {'user': item_request.respondent, 'link': link})
        send_email.delay(
            "The payment has been transferred!",
            "The payment has been transferred! Check at Torimo!",
            html_message, item_request.respondent.email)

        return Response(data="Transferred")



class ChargeViewSet(viewsets.ModelViewSet):
    stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

    queryset = Charge.objects.all()
    serializer_class = ChargeSerializer

    def create(self, request):
        item_request_id = request.data.pop("item_request_id")
        body = request.data.pop("stripe_body")
        amount = request.data.pop("amount")
        address = request.data.pop("addresses")
        stripe_token = body["stripeToken"]

        stripe_charge = stripe.Charge.create(
            amount=amount*100,
            currency='usd',
            description=f'A charge for request {item_request_id}',
            source=stripe_token
        )
        charge_id = stripe_charge["id"]
        status = stripe_charge["status"]
        card = stripe_charge["payment_method_details"].get("card")
        type = stripe_charge["payment_method_details"].get("type")
        item_request = ItemRequest.objects.get(pk=item_request_id)

        if status == "succeeded":
            item_request.process_status = "payment_made"
            now = timezone.now()
            item_request.paid_at = now
            item_request.save()
            # Notify requester/traveler
            link = f"{site_url}/login?next=/transaction/history/{item_request.id}"
            html_message_requester = render_to_string(
                'email-payment-completed-requester.html', {'user': item_request.requester, 'link': link})
            send_email.delay(
                "Your payment has been successfully completed!",
                "Your payment has been successfully completed! Check at Torimo!",
                html_message_requester, item_request.requester.email)

            html_message_traveler = render_to_string(
                'email-payment-completed-traveler.html', {'user': item_request.respondent, 'link': link})
            send_email.delay(
                "A payment has been successfully completed!",
                "A payment has been successfully completed! Check at Torimo!",
                html_message_traveler, item_request.respondent.email)

        charge = Charge.objects.create(
            user=request.user,
            amount=amount,
            address=address,
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
    #permission_classes = [permissions.IsAuthenticated,]
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

    def list(self, request):
        pk = self.kwargs.get("pk")
        if pk:
            queryset = Trip.objects.filter(pk=int(pk))
            return queryset

        userId = request.GET.get('userId')

        queryset = Trip.objects.all()

        today = datetime.today()

        if userId:
            user = User.objects.get(pk=userId)
            queryset = queryset.filter(user=user)

        upcoming_trips = queryset.filter(arrival_date__gt=today).order_by('departure_date')
        past_trips = queryset.filter(arrival_date__lte=today).order_by('departure_date')
        custom_data = {
            'upcoming_trips': self.serializer_class(upcoming_trips, many=True).data,
            'past_trips': self.serializer_class(past_trips, many=True).data,
        }
        return Response(custom_data)


class RateTravelerViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated,]
    serializer_class = RateTravelerSerializer

    def create(self, request):
        torimo_feedback = request.data.pop("torimo_feedback")
        # Notify us
        if torimo_feedback:
            send_email.delay("New Feedback from our requester", torimo_feedback, None, settings.EMAIL_HOST_USER)

        item_request_id = request.data.pop("requestId")
        item_request = ItemRequest.objects.get(pk=item_request_id)
        traveler_id = request.data.pop("travelerId")
        traveler = User.objects.get(pk=traveler_id)
        rating = RateTraveler.objects.create(item_request=item_request, user=request.user, traveler=traveler, **request.data)
        serializer = self.serializer_class(rating)
        return Response(serializer.data)

class RateRequesterViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated,]
    serializer_class = RateRequesterSerializer

    def create(self, request):
        torimo_feedback = request.data.pop("torimo_feedback")
        # Notify us
        if torimo_feedback:
            send_email.delay("New Feedback from our traveler", torimo_feedback, None, settings.EMAIL_HOST_USER)

        item_request_id = request.data.pop("requestId")
        item_request = ItemRequest.objects.get(pk=item_request_id)
        requester = item_request.requester
        rating = RateRequester.objects.create(item_request=item_request, user=request.user, requester=requester, **request.data)
        serializer = self.serializer_class(rating)
        return Response(serializer.data)

class ProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [BaseUserPermissions, ]
    parser_classes = [MultiPartParser, FormParser, ]
    serializer_class = ProfileSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()
        img = data.pop('image')
        is_upload_image = False

        if img:
            image = img[0]
            if isinstance(image, InMemoryUploadedFile):
                data['image'] = image.name
                is_upload_image = True

        serializer = self.serializer_class(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if is_upload_image:
            upload_to_s3(image, f'profiles/{request.user.id}/{image.name}')
        return Response(serializer.data)

    def get_queryset(self):
        all = self.request.GET.get('all')
        others = self.request.GET.get('others')
        user_id = self.request.GET.get('userId')

        queryset = Profile.objects.all()

        if user_id:
            user = User.objects.get(pk=user_id)
            queryset = queryset.filter(user=user)
            return queryset
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
        destination = self.request.GET.get('destination')
        queryset = User.objects.all()

        if destination:
            # Users living in NY and have trips to the destination
            queryset = queryset.filter(
                trips__destination__contains=destination
            ).prefetch_related(Prefetch(
                'trips',
                queryset=Trip.objects.filter(
                    destination__contains=destination
                )
            )).order_by('trips__arrival_date')
            # Users living in the destination and visits to NY
            return queryset

        if all:
            return queryset
        if others:
            queryset = queryset.exclude(id=self.request.user.id)
            return queryset

        queryset = queryset.filter(id=self.request.user.id)
        return queryset

class WishListViewSet(viewsets.ModelViewSet):
    permission_classes = [BaseTransactionPermissions,]
    queryset = WishList.objects.all()
    serializer_class = WishListSerializer

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        Profile.objects.create(user=user)

        html_message = render_to_string('email-signup.html', {'user': user})
        send_email.delay("Welcome to Torimo!", "Thank you for joining us!", html_message, user.email)

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
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

class CustomPasswordResetView:
    @receiver(reset_password_token_created)
    def password_reset_token_created(sender, reset_password_token, *args, **kwargs):
        """
          Handles password reset tokens
          When a token is created, an e-mail needs to be sent to the user
        """
        site_name = "Torimo"

        # send an e-mail to the user
        context = {
            'current_user': reset_password_token.user,
            'email': reset_password_token.user.email,
            'reset_password_url': f"{site_url}/reset/password/{reset_password_token.key}",
            'site_name': site_name,
            'site_domain': site_url
        }

        # render email text
        html_message = render_to_string('email-forgotpswd.html', context)
        #email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

        send_email.delay("Forgot Password?", "Forgot Password?", html_message, reset_password_token.user.email)

def upload_to_s3(image, key):

    client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION
    )

    client.put_object(Bucket=settings.AWS_BUCKET_NAME, Key=key, Body=image)

