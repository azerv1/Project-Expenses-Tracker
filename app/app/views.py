from django.shortcuts import render
from django.http import JsonResponse
def test(reqeust):
    return JsonResponse({1:1})
    o

def ping(request):
    return JsonResponse({'pong': 200})

# Create your views here.
