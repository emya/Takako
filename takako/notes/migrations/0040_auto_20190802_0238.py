# Generated by Django 2.1.4 on 2019-08-02 02:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0039_auto_20190730_0333'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemrequest',
            name='delivery_method',
            field=models.IntegerField(default=0),
        ),
    ]