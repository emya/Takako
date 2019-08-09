# Generated by Django 2.1.4 on 2019-08-07 06:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0041_auto_20190804_1825'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchasenotification',
            name='final_meetup',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='purchase_notification_finalmeetup', to='notes.Meetup'),
        ),
        migrations.AlterField(
            model_name='purchasenotification',
            name='meetup_option1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchase_notification_meetup1', to='notes.Meetup'),
        ),
        migrations.AlterField(
            model_name='purchasenotification',
            name='meetup_option2',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='purchase_notification_meetup2', to='notes.Meetup'),
        ),
        migrations.AlterField(
            model_name='purchasenotification',
            name='meetup_option3',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='purchase_notification_meetup3', to='notes.Meetup'),
        ),
    ]