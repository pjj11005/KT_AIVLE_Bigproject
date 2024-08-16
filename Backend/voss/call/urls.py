from django.urls import path
from . import api

urlpatterns = [
    path('receive/', api.receive_call, name="api_voc_record_receive"),
    path('update/', api.voc_record_update, name="api_voc_record_receive"),
    path('callnote/', api.voc_record_list, name="api_voc_record_list"),
    path('callnote/<phone>', api.voc_record_list, name="api_voc_record_list"),
    path('callmemo', api.voc_record_memo, name="api_voc_record_memo"),

    path('cnt/', api.today_voc, name='api_today_voc'), # 금일 콜 건수
    path('cnt/user/', api.today_voc_user, name='api_today_voc_user'),  # 상담사 금일 콜 건수

    path('dashboard/daily', api.daily_voc, name='api_daily_voc'),
    path('dashboard/weekly', api.weekly_voc, name='api_weekly_voc'),
    path('dashboard/monthly', api.monthly_voc, name='api_monthly_voc'),
    
    path('keyword/', api.keyword_counts, name='api_keyword_counts'),
]
