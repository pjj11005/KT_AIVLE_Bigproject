from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import VocRecord
from .serializers import RecordSerializer, RecordCreateSerializer, RecordListSerializer

from crm.models import Customer
from useraccount.models import User
from crm.serializers import CustomerSerializer

from datetime import datetime
from django.db.models import Count, Q

from rest_framework.decorators import api_view

from rest_framework import status
from django.utils import timezone

from django.db.models import Sum
from datetime import timedelta
from calendar import monthrange
from collections import Counter
from django.db.models.functions import TruncDay, TruncMonth, TruncWeek
from rest_framework.decorators import permission_classes

# 전화 받고 기록지 생성
@api_view(['POST'])
@permission_classes([])
def receive_call(request):
    try:
        phone = request.data['phone']
        id = request.data['id']
        customer, _ = Customer.objects.get_or_create(phone=phone)
        customer.counts += 1
        customer.save()
        user = User.objects.get(id=id)
        user.counts += 1
        user.save()
 
        voc_record = VocRecord.objects.create(user=user, customer=customer)
        record_serializer = RecordCreateSerializer(voc_record)
 
        return Response(record_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PATCH'])
def voc_record_update(request):
    try:
        record = VocRecord.objects.get(id=request.data['id'])
        serializer = RecordSerializer(record, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# call_counts
@api_view(['GET'])
def total_call_counts(request):
    today = datetime.today().date()
    
    # 오늘 날짜의 request.user의 counts 필드 값
    user_today_counts = User.objects.filter(pk=request.user.pk).aggregate(Sum('counts'))['counts__sum'] or 0
    
    # 오늘 날짜의 전체 사용자들의 counts 필드 합
    all_users_today_counts = User.objects.all().aggregate(Sum('counts'))['counts__sum'] or 0
    
    return Response({
        'user_today_counts': user_today_counts,
        'all_users_today_counts': all_users_today_counts
    })

# 키워드 카운터
@api_view(['GET'])
def keyword_counts(request):
    today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timezone.timedelta(days=1)

    all_keywords = VocRecord.objects.filter(
        date__gte=today_start,
        date__lt=today_end
    ).values_list('keyword', flat=True)

    # 키워드 분리 및 집계
    keyword_list = [keyword.strip() for keywords in all_keywords for keyword in keywords]
    keyword_counts = Counter(keyword_list)

    # 상위 3개의 키워드 추출
    top_keywords = keyword_counts.most_common(3)
    result = [{'keyword': k, 'count': c} for k, c in top_keywords]

    return Response(result)

# 통화 내역 목록
@api_view(['GET'])
def voc_record_list(request, phone):
    # phone = request.GET['phone']
    if phone:
        try:
            customer = Customer.objects.get(phone=phone)
            records = VocRecord.objects.filter(customer=customer.id)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        records = VocRecord.objects.all()

    serializer = RecordListSerializer(records, many=True)
    return Response(serializer.data)

# 통화 내역 업데이트
@api_view(['PATCH'])
def voc_record_update(request):
    try:
        record = VocRecord.objects.get(id=request.data['id'])
        serializer = RecordSerializer(record, data=request.data, partial=True)
        if request.user.id == record.user_id:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
        else:
            return Response({'message':'Not Author User'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        Response({'message':e})
        # return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except VocRecord.DoesNotExist as e:
        response = {
            'statusCode': 400,
            'errorCode': 400,
            'message': str(e),
            'result': None,
            'timesstamp': datetime.now().isoformat()
        }
        return JsonResponse(response, status=400)
        # return JsonResponse({'errors': 'VOC record not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        response = {
            'statusCode': 400,
            'errorCode': 400,
            'message': str(e),
            'result': None,
            'timesstamp': datetime.now().isoformat()
        }
        return JsonResponse(response, status=400)
        # return JsonResponse({'errors': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def voc_record_memo(request):
    try:
        user = request.user.id
        customer = Customer.objects.get(id=request.data['customer'])
        record = customer.voc_records.filter(user=user).last()
        # record = VocRecord.objects.filter(user=user, customer=customer).lastest('date')
        record.opinion = request.data['memo']
        record.save()
        
        serializer = RecordSerializer(record)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Customer.DoesNotExist as e:
        raise ValueError(str(e))
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 통화 내역 삭제
@api_view(['DELETE'])        
def voc_record_delete(request, pk):
    try:
        voc_record = VocRecord.objects.get(pk=pk)
        voc_record.delete()
        return Response({'success':True})
    except VocRecord.DoesNotExist as e:
        response = {
            'statusCode': 400,
            'errorCode': 400,
            'message': str(e),
            'result': None,
            'timesstamp': datetime.now().isoformat()
        }
        return JsonResponse(response, status=400)

    except Exception as e:
        print(e)
        response = {
            'statusCode': 400,
            'errorCode': 400,
            'message': str(e),
            'result': None,
            'timesstamp': datetime.now().isoformat()
        }
        return JsonResponse(response, status=400)

@api_view(['GET'])
def daily_voc(request):
    try:
        # 사용자가 선택한 연도와 월을 request에서 가져오기
        year = int(request.GET.get('year'))
        month = int(request.GET.get('month'))
        
        # 해당 월의 시작일과 마지막일 계산
        start_date = timezone.datetime(year, month, 1)
        end_date = timezone.datetime(year, month, monthrange(year, month)[1])
        
        # 해당 월의 일별 VOC 통계
        daily_voc_stats = VocRecord.objects.filter(date__gte=start_date, date__lte=end_date).annotate(
            day=TruncDay('date')
        ).values('day').annotate(count=Count('id')).order_by('day')
        
        return Response(list(daily_voc_stats))
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def weekly_voc(request):
    try:
        # 오늘 날짜를 기준으로 현재 주의 시작일(월요일)과 마지막일(일요일) 계산
        today = timezone.now()
        start_date = today - timedelta(days=today.weekday())  # 이번 주 월요일
        end_date = start_date + timedelta(days=6)  # 이번 주 일요일

        # 요일별 VOC 통계
        weekly_voc_stats = VocRecord.objects.filter(date__gte=start_date, date__lte=end_date).annotate(
            day=TruncDay('date')
        ).values('day').annotate(
            count=Count('id'),
            special_count=Count('customer__id', filter=Q(customer__special_reg=True)),
            regular_count=Count('customer__id', filter=Q(customer__special_reg=False))
        ).order_by('day')

        return Response(list(weekly_voc_stats))
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])    
def monthly_voc(request):
    try:
        # 현재 날짜 기준으로 1년 전 데이터부터 조회
        start_date = timezone.now() - timedelta(days=365)
        
        # 월별 VOC 통계
        monthly_voc_stats = VocRecord.objects.filter(date__gte=start_date).annotate(
            month=TruncMonth('date')
        ).values('month').annotate(count=Count('id')).order_by('month')
        
        return Response(list(monthly_voc_stats))
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# 오늘 유저 콜 건수
@api_view(['GET'])
def today_voc(request):
    try:
        # 오늘 날짜
        today_date = timezone.now().date()
        count = VocRecord.objects.filter(date__date=today_date).count()

        return Response({'today_voc': count})
    except Exception as e:
        return Response({'error': '서버 내부 오류가 발생했습니다.' + str(e)}, status=500) #오류 메시지를 일반화하여 보안 강화 str(e) 나중에 삭제

# 오늘 전체 콜 건수
@api_view(['GET'])
def today_voc_user(request):
    try:
        # 현재 인증된 사용자
        user = request.user

        # 오늘 날짜 (시작과 끝)
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timezone.timedelta(days=1)

        # 오늘 날짜의 현재 사용자 레코드 수 조회
        count = VocRecord.objects.filter(
            user_id=user.id,
            date__gte=today_start,
            date__lt=today_end
        ).count()

        return Response({'today_voc_user': count}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)