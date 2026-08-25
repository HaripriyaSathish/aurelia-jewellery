from django.contrib.auth import get_user_model, authenticate
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    EmailLoginSerializer,
    ForgotPasswordSerializer,
    ResetPasswordConfirmSerializer,
)
from jewellery.emails import send_password_reset_email

User = get_user_model()


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Your VETRI account has been created.",
                    "user": UserSerializer(user).data,
                    **tokens_for_user(user),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"success": False, "message": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response({
            "success": True,
            "user": UserSerializer(user).data,
            **tokens_for_user(user),
        })


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        user = request.user
        for field in ('first_name', 'last_name'):
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()

        profile, _ = Profile.objects.get_or_create(user=user)
        for field in ('phone', 'address', 'city'):
            if field in request.data:
                setattr(profile, field, request.data[field])
        profile.save()

        return Response(UserSerializer(user).data)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].strip().lower()

        user = User.objects.filter(email__iexact=email).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            send_password_reset_email(user, uid, token)

        # Always respond success to avoid leaking which emails are registered
        return Response({
            "success": True,
            "message": "If an account exists for that email, a password reset link has been sent.",
        })


class ResetPasswordConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response(
                {"success": False, "message": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"success": False, "message": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response({"success": True, "message": "Your password has been reset. You can now sign in."})
