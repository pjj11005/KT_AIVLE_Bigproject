from rest_framework import serializers

# from useraccount.serializers import UserDetailSerializer

from useraccount.models import User
from .models import Post, Notification

class PostCreateSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Post
        fields = ['id', 'author', 'category', 'title', 'content']

class PostListSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Post
        fields = ['id', 'author', 'category', 'title', 'content', 'date', 'views']

class PostDetailSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='user.name')
    
    class Meta:
        model = Post
        fields = '__all__'
        
class NotificationSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='user.name')
    
    class Meta:
        model = Notification
        fields = ['id', 'author', 'created_at', 'content', 'is_read']