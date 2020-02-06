from rest_framework import serializers

from app.models import ToDo, User


class ToDoSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user.id'
    )

    class Meta:
        model = ToDo
        fields = ('user_id', 'name', 'description', 'start_at', 'finish_at', 'is_done')

    def create(self, validated_data):
        user = validated_data.pop("user")["id"]

        todo = ToDo.objects.create(
            user=user,
            **validated_data
        )
        todo.save()

        return todo
