import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models

# Create your models here.
class CustomUserManager(UserManager):
    def _create_user(self, name, email, password, **extra_fields):
        if not email:
            raise ValueError("You have not specified a valid e-mail address")
        
        phone = extra_fields.pop('phone', None)
        if not phone:
            raise ValueError("You have not specified a valid phone number")
        
        name = extra_fields.pop('name', None)
        if not name:
            raise ValueError("You have not specified a valid name")
        
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)

        return user

    def create_user(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('role', 'I')
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(name, email, password, **extra_fields)
    
    def create_superuser(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('role', 'A')
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(name, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('U', 'User'),
        ('I', '인턴'),
        ('E', '사원'),
        ('A', '관리자'),
    )
    ACTIVE_CHOICES = (
        ('W', 'Work'),
        ('R', 'Rest'),
        ('O', 'Off'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=11, null=False, unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    avatar = models.ImageField(upload_to='uploads/avatars')
    counts = models.IntegerField(default=0, null=True)

    is_active = models.BooleanField(default=True)
    active = models.CharField(max_length=1, default='O', choices=ACTIVE_CHOICES)
    is_superuser = models.BooleanField(default=False)
    role = models.CharField(max_length=1, default='I', choices=ROLE_CHOICES)

    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']