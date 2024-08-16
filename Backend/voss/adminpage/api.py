from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from crm.serializers import CustomerSerializer
from call.serializers import RecordSerializer
from call.models import VocRecord
from crm.models import Customer
from notice.serializers import PostDetailSerializer
from notice.models import Post
from useraccount.models import User
from useraccount.serializers import UserSerializer, ProfileSerializer
from django.db.models import Sum

import logging

logger = logging.getLogger(__name__)

#admin-home
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_home(request):
    user = request.user
    if user.role == "A":  # 관리자 권한 확인
        user_serializer = ProfileSerializer(user)
        
        # 당일 받은 콜 건수
        total_call_cnt = User.objects.filter(role='U').aggregate(total_call_cnt=Sum('counts'))['total_call_cnt']
        
        # 민원인 리스트
        customers = Customer.objects.all()
        customer_serializer = CustomerSerializer(customers, many=True)
        
        # 상담사 리스트
        consultants = User.objects.filter(role='U')
        consultant_serializer = UserSerializer(consultants, many=True)
        
        # 결과 JSON 응답 생성
        response_data = {
            'total_call_cnt':total_call_cnt,
            'admin_info': user_serializer.data,
            'customers_list': customer_serializer.data,
            'consultants_list': consultant_serializer.data,
        }
        
        return JsonResponse(response_data, status=200)
    else:
        return JsonResponse({'detail': 'User does not have admin privileges'}, status=403)