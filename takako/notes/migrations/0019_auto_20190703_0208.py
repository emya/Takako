# Generated by Django 2.1.4 on 2019-07-03 02:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0018_auto_20190702_0431'),
    ]

    operations = [
        migrations.AlterField(
            model_name='charge',
            name='item_request',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='notes.ItemRequest'),
        ),
    ]
