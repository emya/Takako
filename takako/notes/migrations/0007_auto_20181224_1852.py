# Generated by Django 2.1.4 on 2018-12-24 18:52

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notes', '0006_auto_20181224_1848'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='PSrofile',
            new_name='PSProfile',
        ),
    ]
