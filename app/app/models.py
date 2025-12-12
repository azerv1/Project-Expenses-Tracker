import uuid
from django.db import models

class Employee(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    
    def __str__(self):
        return self.name

class Receipt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    employee =  models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='receipts')
    date = models.DateField(auto_now_add=True)

    @property
    def total(self):
        return sum(item.price * (1+ item.VAT/100) for item in self.items.all())

    def __str__(self):
        return f"{self.employee}: {self.total}$"

class ExpenseItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    receipt =  models.ForeignKey(Receipt, on_delete=models.CASCADE, related_name='items')
    item = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    VAT = models.DecimalField(max_digits=4,decimal_places=2) # 24% 14% etc, not 0.24

    def __str__(self):
        return f"{self.item}: {self.price}$, {self.VAT}% VAT"

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=100)
    description = models.CharField() 
    employees = models.ManyToManyField(Employee, related_name='employees') 

    def __str__(self):
        return self.name