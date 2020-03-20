from django.contrib import admin

from .models import User, TodoList, Card

admin.site.register(User)
admin.site.register(TodoList)
admin.site.register(Card)

