from django.db import models
from django.contrib.postgres.fields import ArrayField

from crm.models import Customer
from useraccount.models import User

class VocRecord(models.Model):
    id=models.AutoField(primary_key=True, editable=False)
    user=models.ForeignKey(User, related_name='voc_records', on_delete=models.DO_NOTHING)
    customer=models.ForeignKey(Customer, related_name='voc_records', on_delete=models.CASCADE)
    date=models.DateTimeField(auto_now_add=True, editable=False)
    summary=models.TextField(null=True)
    opinion=models.TextField(blank=True, null=True)
    keyword=ArrayField(models.TextField(), blank=True, default=[])
    context=models.TextField(null=True)
