from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import ToDo, User
from app.serializers.todo import ToDoSerializer
from app.views.permissions import IsAdminUser, IsOwnerOfToDo, IsUserEmailConfirmed


class ToDoListCreateAPIView(ListCreateAPIView):
    queryset = ToDo.objects.all()
    serializer_class = ToDoSerializer
    permission_classes = (IsAuthenticated, IsUserEmailConfirmed)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()

        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ToDoRetrieveUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = ToDo.objects.all()
    serializer_class = ToDoSerializer
    permission_classes = (IsAuthenticated, IsUserEmailConfirmed, IsOwnerOfToDo, )