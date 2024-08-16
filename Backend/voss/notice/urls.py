from django.urls import path

from . import api

urlpatterns = [
    path('', api.posts_list, name='api_posts_list'),
    path('create/', api.create_post, name='api_create_post'),
    path('read/<pk>/', api.posts_detail, name='api_read_post'),
    path('update/<pk>/', api.update_post, name='api_update_post'),
    path('delete/<pk>/', api.delete_post, name='api_delete_post'),
    
    path('sse/', api.sse_stream, name='sse_stream'),
    path('mark-as-read/<int:notification_id>/', api.mark_notification_as_read, name='mark_notification_as_read')
]