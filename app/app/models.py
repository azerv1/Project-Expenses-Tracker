import uuid
from django.db import models
from django.core.validators import MinValueValidator
from auditlog.registry import auditlog

        
class Employee(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField(validators=[MinValueValidator(18)])
    
    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField() 
    employees = models.ManyToManyField(Employee, related_name='projects') 

    def __str__(self):
        return self.name
    @property
    def total(self):
        return sum(r.total for r in self.receipts.all())

class Receipt(models.Model):
    employee =  models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='receipts')
    date = models.DateField(auto_now_add=True)
    project =  models.ForeignKey(Project, on_delete=models.CASCADE, related_name='receipts')

    @property
    def total(self):
        return sum(item.price * (1+ item.VAT/100) * item.quantity for item in self.items.all())

    def __str__(self):
        return f"{self.employee}: {self.total}$"

class ExpenseItem(models.Model):
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE, related_name='items')
    item = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10,decimal_places=2, validators=[MinValueValidator(0)])
    VAT = models.DecimalField(max_digits=4,decimal_places=2,validators=[MinValueValidator(0)]) # 24% 14% etc, not 0.24
    quantity = models.IntegerField(default=1,validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.item}: {self.price}$, {self.VAT}% VAT"

# audit log registering for audit trails
auditlog.register(Employee)
auditlog.register(Project)
auditlog.register(Receipt)
auditlog.register(ExpenseItem)