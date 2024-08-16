# from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Post
from useraccount.models import User
# Create your tests here.

class NoticeListTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.user = User.objects.create_user(
            name="hello",
            email="1004@gmail.com",
            password="12345678"
        )
        cls.refresh = RefreshToken.for_user(user=cls.user)
        cls.access = cls.refresh.access_token

        cls.post = Post.objects.create(
            user=cls.user,
            title="test title",
            content="test context"
        )
        cls.url = reverse("api_posts_list")
        
    def setUp(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

    def test_notice_list_success(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

class NoticeCreateTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.user = User.objects.create_user(
            name="hello",
            email="1004@gmail.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=cls.user)
        cls.access = refresh.access_token
        
        cls.url = reverse("api_create_post")

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )
        self.data = {
            "title": "Title",
            "content": "Context"
        }
    
    def test_notice_create_success(self):
        response  = self.client.post(self.url, data=self.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["success"], True)

class NoticeReadTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.user = User.objects.create_user(
            name="hello",
            email="1004@gmail.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=cls.user)
        cls.access = refresh.access_token
        
        cls.post = Post.objects.create(
            user=cls.user,
            title="test title",
            content="test context"
        )

        cls.url = reverse("api_read_post", args=[cls.post.id])

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )

    def test_notice_read_success(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["views"], Post.objects.get(id=self.post.id).views)

class NoticeUpdateTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.user = User.objects.create_user(
            name="hello",
            email="1004@gmail.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=cls.user)
        cls.access = refresh.access_token
        
        cls.post = Post.objects.create(
            user=cls.user,
            title="test title",
            content="test context"
        )
        cls.url = reverse("api_update_post", args=[cls.post.id])

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )
        self.data = {
            "user": self.user,
            "title": "Modified title",
            "content": "Modified context"
        }

    def test_notice_update_success(self):
        response = self.client.put(self.url, data=self.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

class NoticeDeleteTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.user = User.objects.create_user(
            name="hello",
            email="1004@gmail.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=cls.user)
        cls.access = refresh.access_token
        
        cls.post = Post.objects.create(
            user=cls.user,
            title="test title",
            content="test context"
        )
        cls.url = reverse("api_delete_post", args=[cls.post.id])
    
    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )

    def test_notice_delete_success(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["success"], True)