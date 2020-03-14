from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def detail(request, question_id):
    return HttpResponse("Question_no = %s" % question_id)

def results(request, question_id):
    response = "Result of %s"
    return HttpResponse(response % question_id)

def vote(request, question_id):
    return HttpResponse("Vote on question %s" % question_id)
