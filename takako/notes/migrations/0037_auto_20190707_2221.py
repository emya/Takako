# Generated by Django 2.1.4 on 2019-07-07 22:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0036_auto_20190707_2132'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchasenotification',
            name='item_request',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchase_notification', to='notes.ItemRequest'),
        ),
    ]