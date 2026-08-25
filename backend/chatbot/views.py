from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .engine import handle_message


class ChatbotMessageView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = (request.data.get('message') or '').strip()
        context = request.data.get('context') or {}

        if not message:
            return Response({"success": False, "message": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(context, dict):
            context = {}

        result = handle_message(message, context)
        return Response({"success": True, **result})
