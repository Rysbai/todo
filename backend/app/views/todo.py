from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import ToDo
from app.serializers.todo import ToDoSerializer
from app.views.permissions import IsOwnerOfToDo, IsUserEmailConfirmed


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

    def get(self, request, *args, **kwargs):
        user = request.user
        actual = request.query_params.get('actual', None)

        if actual and actual == 'True':
            todos = self.queryset.filter(user=user, is_done=False, finish_at__gte=timezone.now()).order_by('finish_at')
        elif actual and actual == 'False':
            todos = self.queryset.filter(user=user, is_done=True, finish_at__lte=timezone.now()).order_by('is_done', 'finish_at')
        else:
            todos = self.queryset.filter(user=user).order_by('is_done', 'finish_at')

        serializer = self.serializer_class(todos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class ToDoRetrieveUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = ToDo.objects.all()
    serializer_class = ToDoSerializer
    permission_classes = (IsAuthenticated, IsUserEmailConfirmed, IsOwnerOfToDo, )