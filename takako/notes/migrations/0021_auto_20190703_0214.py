# Generated by Django 2.1.4 on 2019-07-03 02:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0020_auto_20190703_0213'),
    ]

    operations = [
        migrations.RenameField(
            model_name='charge',
            old_name='item_request_id',
            new_name='item_request',
        ),
    ]