# Generated by Django 2.1.4 on 2019-07-05 04:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0030_auto_20190704_2334'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='travelerprofile',
            name='user',
        ),
        migrations.DeleteModel(
            name='TravelerProfile',
        ),
    ]
