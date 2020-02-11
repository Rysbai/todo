from rest_framework import serializers

from app.models import ToDo, User


class ToDoSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        source='user.id',
        read_only=True
    )

    class Meta:
        model = ToDo
        fields = ('id', 'user_id', 'name', 'description', 'start_at', 'finish_at', 'is_done')

        extra_kwargs = {
            'user': {
                'default': serializers.CreateOnlyDefault(
                    serializers.CurrentUserDefault()
                ),
                # perhaps add 'read_only': True here too.
            }
        }

    def create(self, validated_data):
        user = validated_data.pop("user")

        todo = ToDo.objects.create(
            user=user,
            **validated_data
        )
        todo.save()

        return todo

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.is_done = validated_data.get('is_done', instance.is_done)
        instance.save()

        return instance
