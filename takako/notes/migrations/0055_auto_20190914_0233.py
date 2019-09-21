# Generated by Django 2.1.4 on 2019-09-14 02:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0054_itemrequest_item_received_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='stripe_access_token',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='stripe_connect_created_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='stripe_user_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]