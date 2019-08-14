from .celery import app

@app.task
def send_email(subject, message, to_email):
    from django.core.mail import send_mail
    from django.conf import settings

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [to_email],
        fail_silently=False,
    )