# Generated by Django 2.1.4 on 2019-07-05 22:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0031_auto_20190705_0451'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemrequest',
            name='preferred_meetup_date',
            field=models.CharField(blank=True, max_length=300),
        ),
        migrations.AddField(
            model_name='itemrequest',
            name='preferred_meetup_location',
            field=models.CharField(blank=True, max_length=300),
        ),
    ]