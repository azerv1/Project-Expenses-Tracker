from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics
from .models import Employee, Receipt,ExpenseItem,Project
from .serializers import EmployeeSerializer,ExpenseItemSerializer,ProjectSerializer,ReceiptSerializer

def ping(request):
    return JsonResponse({'pong': 200})

# Create your views here.
