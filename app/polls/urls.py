from django.urls import path

from . import views

app_name = 'polls' # 名前空間 templatesでの'polls:~'を利用する
urlpatterns = [
    path('', views.index, name='index'),
    # polls/id/ 名前付きルート(detail): templatesで使用
    path('<int:question_id>/', views.detail, name='detail'),
    path('<int:question_id>/results/', views.results, name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
