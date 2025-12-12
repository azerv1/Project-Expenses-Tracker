from django.contrib import admin
from .models import Employee, ExpenseItem,Receipt, Project

admin.site.register(Employee)
admin.site.register(ExpenseItem)
admin.site.register(Receipt)
admin.site.register(Project)
# Register your models here.
