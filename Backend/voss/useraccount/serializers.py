from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import PasswordResetSerializer
from rest_framework import serializers 
from .models import User

import logging
import re

logger = logging.getLogger(__name__)

def validate_korean_name(name):
    pattern = re.compile(r'^[가-힣]+$') # 한글 이름만 입력
    if pattern.match(name):
        return True
    return False

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='get_role_display')
    
    class Meta:
        model=User
        fields='__all__'

class CustomRegisterSerializer(RegisterSerializer):
    phone = serializers.CharField(max_length=11, required=True)
    name = serializers.CharField(max_length=64)
    
    def validate_phone(self, phone):
        if User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError("A user is already registered with this phone number.")
        return phone
    
    def validate_name(self, name):
        if not validate_korean_name(name):
            raise serializers.ValidationError("You have not specified a valid name")
        return name
    
    def save(self, request):
        user = super().save(request)
        user.phone = self.validated_data.get('phone', '')
        user.name = self.validated_data.get('name', '')
        user.save()
        logger.info(f"Saving user with data: {self.validated_data}")
        return user

class CustomPasswordResetSerializer(PasswordResetSerializer):
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This is an unregistered email.")

        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

        return value

class ProfileSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='get_role_display')
    
    class Meta:
        model=User
        fields=['id', 'email', 'phone', 'name', 'role', 'avatar']

class UserStatusSerializer(serializers.ModelSerializer):
    active = serializers.CharField(source='get_active_display')
    
    class Meta:
        model=User
        fields=['id', 'email', 'active']