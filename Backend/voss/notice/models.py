import uuid

from django.db import models
from useraccount.models import User

# Create your models here.
class Post(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='users', db_column='author_id')
    category = models.CharField(max_length=10, default='미분류')
    title = models.CharField(max_length=255)
    content = models.TextField()
    views = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
class Notification(models.Model):
    id = models.OneToOneField(Post, primary_key=True, on_delete=models.CASCADE, related_name='alarm')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alarm')
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return self.content