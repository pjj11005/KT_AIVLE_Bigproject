from django.urls import path

from . import api

urlpatterns = [
    path('create/', api.create_customer, name='api_create_customer'),
    path('update/<phone>', api.update_customer, name='api_update_customer'),
    path('from/<phone>', api.customer_check, name='api_customer_check'),
    
    path('spec', api.special_list, name="api_special_list"),
    path('spec/reqlist', api.special_req_list, name="api_special_req_list"),
    path('spec/req', api.special_req, name="api_special_request"),
    path('spec/set', api.special_set, name="api_special_set"),
    path('spec/del', api.special_del, name="api_special_delete"),
    path('<phone>', api.get_customer, name='api_get_customer')
]