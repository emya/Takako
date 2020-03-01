from .celery import app


from .models import User, ItemRequest, Trip
from datetime import datetime

from django.template.loader import render_to_string
from django.conf import settings



site_url = settings.SITE_URL

@app.task
def send_email(subject, message, html_message, to_emails):
    from django.core.mail import send_mail
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        to_emails,
        fail_silently=False,
        html_message=html_message
    )

@app.task
def send_mass_email(subject, message, html_message, to_emails):
    from django.core.mail import EmailMultiAlternatives, get_connection
    connection = get_connection(
        username=settings.EMAIL_HOST_USER,
        password=settings.EMAIL_HOST_PASSWORD,
        fail_silently=False,
    )
    messages = [
        EmailMultiAlternatives(subject, message, settings.EMAIL_HOST_USER, [to_email],
                               alternatives=[(html_message, 'text/html')],
                               connection=connection)
        for to_email in to_emails
    ]
    return connection.send_messages(messages)

# Periodic task to let users know what features trips we have
@app.task
def notify_featured_trips():
    today = datetime.today()
    users = User.objects.all()
    featured_trips = Trip.objects.filter(departure_date__gte=today)
    if featured_trips:
        link = f"{site_url}/trips"
        html_message = render_to_string('email-featured-trips.html', {'trips': featured_trips, 'link': link})
        # The function to send email defined above
        send_mass_email(
            "Featured trips for you",
            "Featured upcoming trips for you",
            html_message,
            [user.email for user in users],
        )

# Periodic task to remind users who forget Payment
@app.task
def remind_payment():
    today = datetime.today()
    item_requests = ItemRequest.objects.filter(
        status=2, process_status="request_responded", trip__arrival_date__lte=today)

    for item_request in item_requests:
        link = f"{site_url}/login?next=/transaction/history/{item_request.id}"
        html_message = render_to_string('email-payment-reminder.html', {'user': item_request.requester, 'link': link})
        # The function to send email defined above
        send_email(
            "We're waiting for your action",
            "We're waiting for your action to move your requet forward on Torimo",
            html_message,
            [item_request.requester.email],
        )
