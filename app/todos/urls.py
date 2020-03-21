from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'lists', views.TodoListViewSet)
router.register(r'cards', views.CardViewSet)
