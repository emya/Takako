# Generated by Django 2.1.4 on 2019-09-22 23:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0058_itemrequest_payment_transferred_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='image',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
