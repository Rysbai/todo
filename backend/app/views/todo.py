from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from app.models import ToDo, User
from app.serializers.todo import ToDoSerializer
from app.views.permissions import IsAdminUser, IsOwnerOfToDo


class ToDoListCreateAPIView(ListCreateAPIView):
    queryset = ToDo.objects.all()
    serializer_class = ToDoSerializer
    permission_classes = (IsAuthenticated, )


class ToDoRetrieveUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = ToDo.objects.all()
    serializer_class = ToDoSerializer
    permission_classes = (IsAuthenticated, IsOwnerOfToDo)