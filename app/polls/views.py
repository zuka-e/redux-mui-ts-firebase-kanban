from django.http import HttpResponseRedirect
# from django.template import loader
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views import generic

from .models import Question, Choice


# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     # template = loader.get_template('polls/index.html')
#     # context = {'latest_question_list': latest_question_list,}
#     # return HttpResponse(template.render(context, request))
#     context = {'latest_question_list': latest_question_list}
#     return render(request, 'polls/index.html', context)
class IndexView(generic.ListView):
    # デフォルト <app>/<model>_list.html (-> polls/question_list.html)
    template_name = 'polls/index.html' # デフォルトから変更
    # デフォルト<model>_list(-> question_list)から変更
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by('-pub_date')[:5]

# def detail(request, question_id):
#     # try:
#     #     question = Question.objects.get(pk=question_id)
#     # except Question.DoesNotExist:
#     #     raise Http404("Question does not exist")
#     # 要求されたIDが存在しなければ404例外, 上記と同じ(ショートカット)
#     question = get_object_or_404(Question, pk=question_id)
#     return render(request, 'polls/detail.html', {'question': question})
class DetailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'

# def results(request, question_id):
#     question = get_object_or_404(Question, pk=question_id)
#     return render(request, 'polls/results.html', {'question': question})
class ResultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'

def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist): # 選択肢選ばなかった場合
        return render(request, 'polls/detail.html', {
            'question': question,
            'error_message': "You did't select a choice.",
        })
    else:
        selected_choice.votes += 1 # choiceモデルのvotesカラム
        selected_choice.save()
        return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))
