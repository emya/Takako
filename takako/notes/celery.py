import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'takako.settings')

app = Celery('takako')
app.config_from_object('django.conf:settings')


# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

app.conf.CELERYBEAT_SCHEDULE = {
    'add-every-noon': {
        'task': 'notes.tasks.remind_payment',
        'schedule': crontab(minute=0, hour=17)
    },
}

app.conf.CELERYBEAT_SCHEDULE = {
    'add-every-noon': {
        'task': 'notes.tasks.notify_featured_trips',
        'schedule': crontab(0, 0, day_of_month='1,10,20')
    },
}
