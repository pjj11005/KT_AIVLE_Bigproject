from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Customer
from useraccount.models import User
# Create your tests here.

class CustomerListTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        user = User.objects.create_user(
            name="hello",
            email="hello@voss.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=user)
        cls.access = refresh.access_token
                
        Customer.objects.create(
            name="Black",
            phone="01011112222"
        )
        Customer.objects.create(
            name="White",
            phone="01033332222"
        )
        cls.url = reverse("api_customers_list")

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )
    
    def test_customer_list_success(self):
        print("CL", self.url)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), len(Customer.objects.all()))

class CustomerCreateTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        user = User.objects.create_user(
            name="hello",
            email="hello@voss.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=user)
        cls.access = refresh.access_token

        cls.url = reverse("api_create_customer")
        
    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )
        self.data = {
            "phone": "01011112222",
        }
    
    def test_create_customer_success(self):
        print("CC", self.url)
        response = self.client.post(self.url, self.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["success"], True)

class CustomerReadTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        user = User.objects.create_user(
            name="hello",
            email="hello@voss.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=user)
        cls.access = refresh.access_token
                
        cls.data = Customer.objects.create(
            name="Black",
            phone="01011112222"
        )
        cls.url = reverse("api_read_customer", args=[cls.data.phone])
    
    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )
        self.data = {
            "phone": "01011112222"
        }
    
    def test_read_customer_success(self):
        print("RC", self.url)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["phone"], self.data["phone"])

class CustomerUpdateTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        user = User.objects.create_user(
            name="hello",
            email="hello@voss.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=user)
        cls.access = refresh.access_token

        cls.data = Customer.objects.create(
            name="Black",
            phone="01011112222"
        )
        cls.url = reverse("api_update_customer", args=[cls.data.phone])
    
    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )
        self.data = {
            "name": "White"
        }
    
    def test_update_customer_success(self):
        print("UC", self.url)
        response = self.client.put(self.url, self.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["name"], self.data["name"])

class CustomerCheckTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        user = User.objects.create_user(
            name="hello",
            email="hello@voss.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=user)
        cls.access = refresh.access_token

        cls.data = Customer.objects.create(
            name="Black",
            phone="01011112222"
        )
        cls.url = reverse("api_customer_check", args=[cls.data.phone])

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )

    def test_customer_check_exist(self):
        print("CCE", self.url)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["counts"], 1)
    
    def test_customer_check_not_exist(self):
        self.url = reverse("api_customer_check", args=["01022223333"])
        print("CCNE", self.url)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["phone"], "01022223333")

class CustomerSpecialTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        user = User.objects.create_user(
            name="hello",
            email="hello@voss.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=user)
        cls.access = refresh.access_token
                
        Customer.objects.create(
            name="Black",
            phone="01011112222"
        )
        Customer.objects.create(
            name="White",
            phone="01033332222",
            special_reg=True
        )
        Customer.objects.create(
            name="Orange",
            phone="01044442222",
            special_reg=True
        )
        cls.url = reverse("api_special_list")

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )

    def test_special_list_success(self):
        print("SL", self.url)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), len(Customer.objects.filter(special_reg=True)))

class CustomerSpecialListTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        user = User.objects.create_user(
            name="hello",
            email="hello@voss.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=user)
        cls.access = refresh.access_token
                
        Customer.objects.create(
            name="White",
            phone="01033332222",
            special_req=True
        )
        Customer.objects.create(
            name="Orange",
            phone="01044442222",
            special_req=True
        )
        cls.url = reverse("api_special_req_list")

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )

    def test_special_req_list_success(self):
        print("SRL", self.url)
        self.url = reverse("api_special_req_list")
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), len(Customer.objects.filter(special_req=True)))

class CustomerSpecialRequestTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        user = User.objects.create_user(
            name="hello",
            email="hello@voss.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=user)
        cls.access = refresh.access_token
                
        Customer.objects.create(
            name="White",
            phone="01033332222"
        )
        Customer.objects.create(
            name="Orange",
            phone="01044442222",
            special_req=True
        )
        cls.url = reverse("api_special_req")

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )

    def test_special_request_success(self):
        print("SRT", self.url)
        self.url = reverse("api_special_req")
        response = self.client.patch(self.url, {"phone": "01033332222"})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["special_req"], Customer.objects.get(phone="01033332222").special_req)
    
    def test_special_request_reject_success(self):
        print("SRF", self.url)
        self.url = reverse("api_special_req")
        response = self.client.patch(self.url, {"phone": "01044442222"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["special_req"], Customer.objects.get(phone="01044442222").special_req)

class CustomerSpecialChangeTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.user = User.objects.create_user(
            name="hello",
            email="hello@voss.com",
            password="12345678"
        )
        refresh = RefreshToken.for_user(user=cls.user)
        cls.access = refresh.access_token
                
        Customer.objects.create(
            name="White",
            phone="01033332222",
            special_req=True
        )
        Customer.objects.create(
            name="Orange",
            phone="01044442222",
            special_reg=True
        )
        cls.url = reverse("api_special_change")

    def setUp(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )

    def test_special_denied(self):
        print("SOn", self.url)
        self.url = reverse("api_special_change")
        response = self.client.patch(self.url, {"phone": "01033332222"})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_special_on_success(self):
        print("SOn", self.url)
        self.url = reverse("api_special_change")
        self.user.role = "Admin"
        response = self.client.patch(self.url, {"phone": "01033332222"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["special_reg"], Customer.objects.get(phone="01033332222").special_reg)
    
    def test_special_off_success(self):
        print("SOff", self.url)
        self.url = reverse("api_special_change")
        self.user.role = "A"
        response = self.client.patch(self.url, {"phone": "01044442222"})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["special_reg"], Customer.objects.get(phone="01044442222").special_reg)