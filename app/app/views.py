from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics
from .models import Employee, Receipt,ExpenseItem,Project
from .serializers import EmployeeSerializer,ExpenseItemSerializer,ProjectSerializer,ReceiptSerializer

def ping(request):
    return JsonResponse({'pong': 200})

class EmployeeList(generics.ListCreateAPIView):
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        return Employee.objects.all()

class EmployeeDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()

class ReceiptList(generics.ListCreateAPIView):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer

class ReceiptDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer


class ExpenseItemList(generics.ListCreateAPIView):
    serializer_class = ExpenseItemSerializer
    def get_queryset(self):
        return ExpenseItem.objects.all()

class ExpenseItemDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseItemSerializer
    queryset = ExpenseItem.objects.all()

class ProjectList(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    def get_queryset(self):
        return Project.objects.all()

class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()