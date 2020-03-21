from rest_framework import serializers

from .models import User, TodoList, Card


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'name', 'email')


class TodoListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True)

    class Meta:
        model = TodoList
        fields = ('id', 'user_id', 'user', 'title', 'description',
                  'created_at', 'updated_at')

    def create(self, validated_date):
        validated_date['user'] = validated_date.get('user_id', None)

        if validated_date['user'] is None:
            raise serializers.ValidationError("User Not Found.")

        del validated_date['user_id']

        return TodoList.objects.create(**validated_date)


class CardSerializer(serializers.ModelSerializer):
    todo_list = TodoListSerializer(read_only=True)
    todo_list_id = serializers.PrimaryKeyRelatedField(
        queryset=TodoList.objects.all(), write_only=True)

    class Meta:
        model = Card
        fields = (
            'id', 'todo_list_id', 'todo_list', 'title', 'body',
            'limit', 'created_at', 'updated_at'
        )

    def create(self, validated_date):
        validated_date['todo_list'] = validated_date.get('todo_list_id', None)

        if validated_date['todo_list'] is None:
            raise serializers.ValidationError("List Not Found.")

        del validated_date['todo_list_id']

        return Card.objects.create(**validated_date)
