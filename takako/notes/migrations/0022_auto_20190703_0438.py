# Generated by Django 2.1.4 on 2019-07-03 04:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0021_auto_20190703_0214'),
    ]

    operations = [
        migrations.AlterField(
            model_name='charge',
            name='item_request',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='charges', to='notes.ItemRequest'),
        ),
    ]