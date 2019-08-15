# Generated by Django 2.1.4 on 2019-08-11 03:07

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0043_charge_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='meetup',
            name='created_at',
            field=models.DateField(default=datetime.datetime(2019, 8, 11, 3, 7, 25, 352729, tzinfo=utc)),
        ),
        migrations.AddField(
            model_name='purchasenotification',
            name='created_at',
            field=models.DateField(default=datetime.datetime(2019, 8, 11, 3, 7, 25, 353389, tzinfo=utc)),
        ),
        migrations.AddField(
            model_name='sharedcontact',
            name='created_at',
            field=models.DateField(default=datetime.datetime(2019, 8, 11, 3, 7, 25, 354443, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='charge',
            name='created_at',
            field=models.DateField(default=datetime.datetime(2019, 8, 11, 3, 7, 25, 351967, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='itemrequest',
            name='created_at',
            field=models.DateField(default=datetime.datetime(2019, 8, 11, 3, 7, 25, 351130, tzinfo=utc)),
        ),
    ]