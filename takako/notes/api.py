import json
from rest_framework import (
    status, viewsets, permissions, generics,
    parsers, renderers
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

from datetime import timedelta

from knox.models import AuthToken

from celery import Celery

from .models import (
    User, Note, Profile,
    Trip, ItemRequest, Charge,
    PurchaseNotification, Meetup,
    SharedContact
)
#from django.contrib.auth.models import User
from .serializers import (
    NoteSerializer,
    SharedContactSerializer,
    PurchaseNotificationSerializer,
    ItemRequestSerializer,
    ItemRequestHistorySerializer,
    ChargeSerializer,
    ProfileSerializer,
    TripSerializer,
    TravelerProfileSerializer,
    CreateUserSerializer,
    UserSerializer,
    LoginUserSerializer,
)

from .tasks import send_email

from .permissions import BaseUserPermissions, BaseTransactionPermissions

#from rest_framework.authentication import SessionAuthentication, BasicAuthentication

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class SharedContactViewSet(viewsets.ModelViewSet):
    queryset = SharedContact.objects.all()
    serializer_class = SharedContactSerializer

    def create(self, request):
        purchase_notification_id = request.data.pop("purchase_notification_id")
        purchase_notification = PurchaseNotification.objects.get(pk=purchase_notification_id)


        process_status = request.data.pop("process_status")

        purchase_notification.item_request.process_status = process_status
        purchase_notification.item_request.save()

        accepted_meetup_id = request.data.pop("accepted_meetup_id")
        accepted_meetup = Meetup.objects.get(pk=accepted_meetup_id)
        purchase_notification.final_meetup = accepted_meetup

        purchase_notification.action_taken_by = 1
        purchase_notification.save()

        shared_contact = SharedContact.objects.create(
            purchase_notification=purchase_notification,
            user=self.request.user,
            **request.data
        )
        serializer = self.serializer_class(shared_contact)
        return Response(serializer.data)

class PurchaseNotificationViewSet(viewsets.ModelViewSet):
    queryset = PurchaseNotification.objects.all()
    serializer_class = PurchaseNotificationSerializer

    def create(self, request):
        request_id = request.data.pop("request_id")
        item_request = ItemRequest.objects.get(pk=request_id)
        item_request.process_status = "purchase_notified"
        item_request.save()

        meetup_option1 = request.data.pop("meetup_option1")
        meetup_option2 = request.data.pop("meetup_option2", None)
        meetup_option3 = request.data.pop("meetup_option3", None)

        meetup1 = Meetup.objects.create(user=self.request.user, **meetup_option1)
        meetup2 = None
        meetup3 = None

        if meetup_option2:
            meetup2 = Meetup.objects.create(user=self.request.user, **meetup_option2)

        if meetup_option3:
            meetup3 = Meetup.objects.create(user=self.request.user, **meetup_option3)

        purchase_notification = PurchaseNotification.objects.create(
            item_request=item_request, meetup_option1=meetup1,
            meetup_option2=meetup2, meetup_option3=meetup3,
            final_meetup=None, **request.data
        )
        serializer = self.serializer_class(purchase_notification)
        return Response(serializer.data)

class MeetupSuggestionViewSet(viewsets.ModelViewSet):
    queryset = PurchaseNotification.objects.all()
    serializer_class = PurchaseNotificationSerializer

    def create(self, request):
        purchase_notification_id = request.data.pop("purchase_notification_id")
        purchase_notification = PurchaseNotification.objects.get(pk=purchase_notification_id)


        meetup_option1 = request.data.pop("meetup_option1")
        meetup_option2 = request.data.pop("meetup_option2", None)
        meetup_option3 = request.data.pop("meetup_option3", None)
        process_status = request.data.pop("process_status")
        action_taken_by = int(request.data.pop("action_taken_by"))

        meetup1 = Meetup.objects.create(user=self.request.user, **meetup_option1)
        meetup2 = None
        meetup3 = None

        if meetup_option2:
            meetup2 = Meetup.objects.create(user=self.request.user, **meetup_option2)

        if meetup_option3:
            meetup3 = Meetup.objects.create(user=self.request.user, **meetup_option3)

        purchase_notification.meetup_option1 = meetup1
        purchase_notification.meetup_option2 = meetup2
        purchase_notification.meetup_option3 = meetup3
        purchase_notification.action_taken_by = action_taken_by
        purchase_notification.save()

        purchase_notification.item_request.process_status = process_status
        purchase_notification.item_request.save()

        serializer = self.serializer_class(purchase_notification)
        return Response(serializer.data)


class ItemRequestHistoryViewSet(viewsets.ModelViewSet):
    permission_classes = [BaseTransactionPermissions,]
    queryset = ItemRequest.objects.all()
    serializer_class = ItemRequestHistorySerializer

class ItemRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ItemRequestSerializer
    queryset = ItemRequest.objects.all()

    def create(self, request):
        respondent_id = request.data.pop("respondent_id")
        trip_id = request.data.pop("trip_id")
        respondent = User.objects.get(pk=respondent_id)
        trip = Trip.objects.get(pk=trip_id)
        item_request = ItemRequest.objects.create(requester=request.user, respondent=respondent, trip=trip, **request.data)
        serializer = self.serializer_class(item_request)

        # Notify respondent
        send_email.delay("You got new Request!", "You got new Request! Check at Torimo!", respondent.email)
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

import stripe
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
            description='A Django charge',
            source=stripe_token
        )
        charge_id = stripe_charge["id"]
        status = stripe_charge["status"]
        card = stripe_charge["payment_method_details"].get("card")
        type = stripe_charge["payment_method_details"].get("type")
        item_request = ItemRequest.objects.get(pk=item_request_id)

        if status == "succeeded":
            item_request.process_status = "payment_made"
            item_request.save()

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
        pk = self.kwargs.get("pk")
        if pk:
            queryset = Trip.objects.filter(pk=int(pk))
            return queryset

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
    permission_classes = [BaseUserPermissions, ]
    serializer_class = ProfileSerializer

    def update(self, request, pk):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
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
                trips__destination=destination
            ).prefetch_related(Prefetch(
                'trips',
                queryset=Trip.objects.filter(
                    destination=destination
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

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        Profile.objects.create(user=user)

        send_email.delay("Welcome to Torimo!", "Thank you for joining us!", user.email)

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
        site_url = "http://localhost:8000"
        site_name = "Torimo"

        # send an e-mail to the user
        context = {
            'current_user': reset_password_token.user,
            'email': reset_password_token.user.email,
            'reset_password_url': "{}/password-reset/{}".format(site_url, reset_password_token.key),
            'site_name': site_name,
            'site_domain': site_url
        }

        # render email text
        #email_html_message = render_to_string('email/user_reset_password.html', context)
        #email_plaintext_message = render_to_string('email/user_reset_password.txt', context)
        email_plaintext_message = f"Hey let's change passward at {site_url}/reset/password/{reset_password_token.key}"

        msg = EmailMultiAlternatives(
            # title:
            "Password Reset for {}".format(site_name),
            # message:
            email_plaintext_message,
            # from:
            "noreply@{}".format(site_url),
            # to:
            [reset_password_token.user.email]
        )
        #msg.attach_alternative(email_html_message, "text/html")
        msg.send()

