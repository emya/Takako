# Generated by Django 2.1.4 on 2019-07-03 05:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0022_auto_20190703_0438'),
    ]

    operations = [
        migrations.AlterField(
            model_name='charge',
            name='item_request',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='charge', to='notes.ItemRequest'),
        ),
    ]