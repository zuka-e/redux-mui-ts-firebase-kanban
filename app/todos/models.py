from django.db import models


class User(models.Model):
  name = models.CharField(max_length=20)
  email = models.EmailField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.name

class TodoList(models.Model):
  user = models.ForeignKey(User, related_name='users', on_delete=models.CASCADE)
  title = models.CharField(max_length=30)
  description = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.title

class Card(models.Model):
  todo_list = models.ForeignKey(TodoList, related_name='todo_lists', on_delete=models.CASCADE)
  title = models.CharField(max_length=30)
  body = models.TextField()
  limit = models.DateField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.title

