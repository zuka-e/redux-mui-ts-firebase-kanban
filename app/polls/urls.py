from django.urls import path

from . import views

app_name = 'polls' # 名前空間 templatesでの'polls:~'を利用する
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    # polls/id/ 名前付きルート(detail): templatesで使用
    path('<int:pk>/', views.DetailView.as_view(), name='detail'),
    path('<int:pk>/results/', views.ResultsView.as_view(), name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
