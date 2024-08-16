from django.conf import settings
from django.http import HttpResponseRedirect
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView, PasswordResetView
from rest_framework import status

from .models import User
from .serializers import CustomRegisterSerializer, CustomPasswordResetSerializer

# Create your views here.
class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

class CustomLoginView(LoginView):
    def get_response(self):

        orginal_response = super().get_response()
        if orginal_response.status_code == status.HTTP_200_OK :
            user = User.objects.get(id=self.user.id)
            print("print입니다~\n\n",user, user.avatar)
            mydata = {"name": user.name, "role": user.get_role_display(), "avatar" : '/media/' + str(user.avatar)}
            orginal_response.data['user'].update(mydata)
            
        return orginal_response


class CustomPasswordResetView(PasswordResetView):
    serializer_class = CustomPasswordResetSerializer

def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(
        f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/"
    )