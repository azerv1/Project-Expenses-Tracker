from rest_framework import serializers
from .models import Employee, ExpenseItem,Receipt, Project

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class ExpenseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseItem
        fields = '__all__'

class ReceiptSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    employee_name = serializers.CharField(source = 'employee.name', read_only = True)
    project_name = serializers.CharField(source = 'project.name', read_only = True)

    class Meta:
        model = Receipt
        fields = ['id', 'project','project_name', 'employee','employee_name', 'date', 'total']

    def get_total(self, obj):
        return obj.total


class ProjectSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ['name','description','employees','total']

    def get_total(self, obj):
        return obj.total