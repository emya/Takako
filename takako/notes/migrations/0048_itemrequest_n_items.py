# Generated by Django 2.1.4 on 2019-08-15 22:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0047_auto_20190811_0312'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemrequest',
            name='n_items',
            field=models.IntegerField(default=1),
        ),
    ]
