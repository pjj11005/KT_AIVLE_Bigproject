from django.contrib.auth.decorators import login_required
from django.db import close_old_connections
from django.http import JsonResponse, StreamingHttpResponse
from django.utils import timezone
from asgiref.sync import sync_to_async
from rest_framework.authtoken.models import Token
import jwt
from django.conf import settings


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError, ErrorDetail
from rest_framework.response import Response

from .models import Post, Notification
from useraccount.models import User
from .serializers import PostListSerializer, PostCreateSerializer, PostDetailSerializer, NotificationSerializer

import asyncio
import json
from threading import Event
import asyncio
import base64

from asgiref.sync import sync_to_async
from django.db import close_old_connections

@sync_to_async
def get_user_notifications(user):
    close_old_connections()
    return list(Notification.objects.filter(is_read=False, user=user))

@sync_to_async
def get_user_by_id(user_id):
    return User.objects.get(id=user_id)



new_notification_event = Event()


def decode_jwt(jwt_token):
    # 토큰을 점(.)을 기준으로 분리
    parts = jwt_token.split('.')

    if len(parts) != 3:
        raise ValueError("Invalid token format")

    # 헤더와 페이로드 디코딩
    def decode_base64(data):
        # padding 추가
        padded = data + '=' * (4 - len(data) % 4)
        return base64.urlsafe_b64decode(padded)

    header = json.loads(decode_base64(parts[0]))
    payload = json.loads(decode_base64(parts[1]))

    # 서명은 디코딩하지 않음 (비밀 키로 검증해야 함)
    signature = parts[2]

    return {
        "header": header,
        "payload": payload,
        "signature": signature
    }

async def sse_stream(request):
    auth_header = request.headers.get('Authorization', '')
    user = None
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        print(token)
        try:
            decoded_token = decode_jwt(token)
            user_id = decoded_token['payload']['user_id']
            user = await get_user_by_id(user_id)
        except Exception as e:
            print(f"Token decoding error: {str(e)}")

    async def event_stream(user):
        print('event_stream 시작')
        while True:
            try:
                print("while 루프 시작")
                print("user: ", user)  # user 객체를 직접 출력하지 않음

                if user:
                    notifications = await get_user_notifications(user)
                    print('notifications 조회 결과:', notifications)

                    if notifications:
                        print("알림 존재, 직렬화 시작")
                        serializer = NotificationSerializer(notifications, many=True)
                        serialized_data = await sync_to_async(lambda: serializer.data)()
                        yield f"data: {json.dumps(serialized_data)}\n\n".encode('utf-8')
                        print("알림 데이터 전송 완료")
                    else:
                        print("알림 없음, keepalive 전송")
                        yield f"data: {json.dumps({'keepalive': True})}\n\n".encode('utf-8')
                else:
                    print("인증되지 않은 사용자")
                    yield f"data: {json.dumps({'error': 'User not authenticated'})}\n\n".encode('utf-8')
                    break

                print("5초 대기 시작")
                await asyncio.sleep(5)
                print("5초 대기 완료")
            except Exception as e:
                print(f"Error in event stream: {e}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n".encode('utf-8')
                break

    response = StreamingHttpResponse(event_stream(user), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response

@api_view(['PATCH'])
def mark_notification_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(pk=notification_id)
        notification.is_read = True
        notification.save()
        print(notification.is_read)
        notifications = Notification.objects.filter(is_read=False)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    except Notification.DoesNotExist:
        raise ValidationError("You have not specified a valid alarm number")
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def posts_list(request):
    serializer = PostListSerializer(Post.objects.all(), many=True)

    return Response(serializer.data)

@api_view(['GET'])
def posts_detail(request, pk):
    try :
        post = Post.objects.get(pk=pk)
        post.views += 1
        post.save()

        serializer = PostDetailSerializer(post)
        
        return Response(serializer.data)
    except Post.DoesNotExist:
        raise ValidationError({'post': [ErrorDetail(string='Enter a valid post.', code='invalid')]})
    except Exception as e:
        raise ValidationError({"server": [ErrorDetail(string=e, code='error')]})

@api_view(['POST'])
def create_post(request):
    try:
        if request.user.role == "A":
            serializer = PostCreateSerializer(data=request.data)

            if serializer.is_valid():
                post = serializer.save(user_id=request.user.id)

                Notification.objects.create(
                    user=request.user,
                    id=post,
                    content=f"새로운 공지사항이 등록되었습니다.\n\n'{post.title}'"
                )
                
                new_notification_event.set()
                
                return Response(serializer.data)
            else:
                raise Exception("Data is required.")
        else:
            raise Exception("권한이 없습니다.")
        
    except Exception as e:
        response = {
            'statusCode': 400,
            'errorCode': 400,
            'message': str(e),
            'result': None,
            'timesstamp': timezone.now().isoformat()
        }
        return JsonResponse(response, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_post(request, pk):
    post = Post.objects.get(pk=pk)

    if request.user == post.user:
        serializer = PostListSerializer(post, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data)
        else:
            response = {
                'statusCode': 400,
                'errorCode': 400,
                'message': "Data is required.",
                'result': None,
                'timesstamp': timezone.now().isoformat()
            }
            return JsonResponse(response, status=status.HTTP_400_BAD_REQUEST)
    else:
        response = {
            'statusCode': 401,
            'errorCode': 401,
            'message': "Unauthorized",
            'result': None,
            'timesstamp': timezone.now().isoformat()
        }
        return JsonResponse(response, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['DELETE'])
def delete_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)

        if request.user == post.user:
            post.delete()
        
            return Response({'success': True})
        else:
            raise ValueError("You have not authority.")
    except Exception as e:
        return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
