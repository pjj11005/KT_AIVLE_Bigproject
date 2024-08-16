# Generated by Django 5.0.6 on 2024-07-24 04:32

import django.contrib.postgres.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('crm', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='VocRecord',
            fields=[
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('summary', models.TextField(null=True)),
                ('opinion', models.TextField(blank=True, null=True)),
                ('keyword', django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), blank=True, default=[], size=None)),
                ('context', models.TextField(null=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='voc_records', to='crm.customer')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='voc_records', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
