# Generated by Django 2.1.4 on 2019-07-03 23:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0027_auto_20190703_2255'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='username',
            new_name='first_name',
        ),
        migrations.AddField(
            model_name='user',
            name='last_name',
            field=models.CharField(blank=True, max_length=254, null=True),
        ),
    ]