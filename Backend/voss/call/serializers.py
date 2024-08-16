from rest_framework import serializers
from .models import VocRecord
from useraccount.models import User 
from crm.models import Customer

class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model=VocRecord
        fields='__all__'

class RecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=VocRecord
        fields=['id', 'customer', 'user', 'date']

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model=User 
        fields=['id', 'name', 'role', 'avatar']

class CustomerListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Customer
        fields=['name', 'phone', 'counts']

class RecordListSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)
    customer = CustomerListSerializer(read_only=True)

    class Meta:
        model = VocRecord
        fields = ['id', 'date', 'summary', 'opinion', 'keyword', 'context', 'user', 'customer']
