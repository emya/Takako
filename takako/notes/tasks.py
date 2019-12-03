from .celery import app


from .models import ItemRequest
from datetime import datetime

from django.template.loader import render_to_string
from django.conf import settings



site_url = settings.SITE_URL

@app.task
def send_email(subject, message, html_message, to_email):
    from django.core.mail import send_mail
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [to_email],
        fail_silently=False,
        html_message=html_message
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
            item_request.requester.email,
        )
