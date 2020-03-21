from rest_framework import serializers

from .models import User, TodoList, Card


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'email', 'created_at', 'updated_at')


class TodoListSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TodoList
        fields = ('user', 'title', 'description', 'created_at', 'updated_at')


class CardSerializer(serializers.ModelSerializer):
    todo_list = TodoListSerializer()

    class Meta:
        model = Card
        fields = (
            'todo_list', 'title', 'body',
            'limit', 'created_at', 'updated_at'
        )
