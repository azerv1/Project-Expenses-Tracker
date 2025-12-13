from django.urls import path
from .views import (ping, 
                    ReceiptDetail,ReceiptList,
                    ProjectList, ProjectDetail,
                    EmployeeList,EmployeeDetail,
                    ExpenseItemList,ExpenseItemDetail)

urlpatterns = [
    path('ping/',ping,name='ping'),
    path('employees/',EmployeeList.as_view()),
    path('employees/<int:pk>/', EmployeeDetail.as_view()),
    path('projects/',ProjectList.as_view()),
    path('projects/<int:pk>/',ProjectDetail.as_view()),
    path('receipts/',ReceiptList.as_view()),
    path('receipts/<int:pk>/',ReceiptDetail.as_view()),
    path('expenses/',ExpenseItemList.as_view()),
    path('expenses/<int:pk>/',ExpenseItemDetail.as_view()),
]