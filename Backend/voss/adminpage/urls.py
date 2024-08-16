from django.urls import path
from . import api
from crm import api as crm_api
# from notice import api as notice_api
from useraccount import api as user_api
# from call import api as call_api


urlpatterns = [
    path('admin-home/', api.admin_home, name='admin-home'),

    # Counselor URLs
    path('user/', user_api.user_list, name='user-list'),
    path('user/<pk>/', user_api.user_detail, name='user-detail'),
]