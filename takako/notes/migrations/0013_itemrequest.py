# Generated by Django 2.1.4 on 2019-05-14 04:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notes', '0012_auto_20190512_0546'),
    ]

    operations = [
        migrations.CreateModel(
            name='ItemRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(blank=True, max_length=200)),
                ('item_id', models.CharField(blank=True, max_length=200)),
                ('item_url', models.CharField(blank=True, max_length=300)),
                ('proposed_price', models.IntegerField()),
                ('delivery_method', models.IntegerField()),
                ('comment', models.CharField(blank=True, max_length=200)),
                ('requester', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itemrequest_requests_created', to=settings.AUTH_USER_MODEL)),
                ('respondent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itemrequest_requests_received', to=settings.AUTH_USER_MODEL)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='notes.Trip')),
            ],
        ),
    ]