from django.http import JsonResponse

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer, ProfileSerializer, UserStatusSerializer

@api_view(['GET', 'PATCH'])
def profile(request):
    print(request.data)
    print(request.FILES)
    user = request.user
    if request.method == 'GET':
        serializer = ProfileSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PATCH':
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if 'avatar' in request.FILES:
                user.avatar = request.FILES['avatar']
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# 상담원 상태 변경 [Work, Rest, Off]
@api_view(['PATCH'])
def status_change(request):
    user = request.user
    
    serializer = UserStatusSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        print(serializer.data)
        print(User.objects.get(id=user.id).active)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def user_list(request):
    if request.method == 'GET':
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

@api_view(['GET', 'PATCH', 'DELETE'])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return JsonResponse(status=404)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)

    elif request.method == 'PATCH':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        user.delete()
        return JsonResponse(status=204)