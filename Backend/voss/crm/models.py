import uuid

from django.db import models

# Create your models here.
class Customer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True, null=True)
    
    phone = models.CharField(max_length=11, null=False, unique=True)
    special_req = models.BooleanField(default=False)
    special_reg = models.BooleanField(default=False)
    counts = models.IntegerField(default=0)
    last_call = models.DateTimeField(auto_now=True)
