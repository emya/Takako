# Generated by Django 2.1.4 on 2019-07-07 21:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0035_auto_20190707_2131'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchasenotification',
            name='final_meetup',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='purcharse_notification_finalmeetup', to='notes.Meetup'),
        ),
        migrations.AlterField(
            model_name='purchasenotification',
            name='meetup_option2',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='purcharse_notification_meetup2', to='notes.Meetup'),
        ),
        migrations.AlterField(
            model_name='purchasenotification',
            name='meetup_option3',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='purcharse_notification_meetup3', to='notes.Meetup'),
        ),
    ]
