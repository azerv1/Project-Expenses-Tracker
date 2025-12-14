from django.test import TestCase
from app.models import Employee, ExpenseItem,Receipt, Project
from rest_framework.test import APIClient

class IntegrationTest(TestCase):
    def setUp(self):
        """populate the db with a few objects"""
        self.client = APIClient()

        self.asterios = Employee.objects.create(name='asterios',age=23)
        self.nikos = Employee.objects.create(name='nikos',age=25)

        self.project = Project.objects.create(name='first project',description='descprition')
        self.project.employees.add(self.asterios)

        self.receipt = Receipt.objects.create(employee = self.asterios, project= self.project)

        self. expenses1 = ExpenseItem.objects.create(receipt=self.receipt,
                                              item='Tool',
                                              price=100,
                                              VAT=24)
        self.expenses2 = ExpenseItem.objects.create(receipt=self.receipt,
                                              item='Tool',
                                              price=200,
                                              VAT=14)
    def test_employee_is_posted_on_db(self):
        res = Employee.objects.all()
        assert str(res[0]) == 'asterios'

    def test_receipt_total_cost_calculation(self):
        receipt_cost = Receipt.objects.first().total
        assert receipt_cost == 124.0 + 228.0

    def test_project_total_cost_calculation(self):
        project_cost = Project.objects.first().total
        assert project_cost == 124.0 + 228.0
    
    def test_put_project_payload(self):
        url = f"/api/projects/{self.project.id}/"
        payload = {
            'name':'new project name',
            'description':'new description',
            'employees': [self.nikos.id]
        }
        response = self.client.put(url,payload, format='json')
        assert response.status_code == 200
        updated_project =Project.objects.get(id=self.project.id)
        assert updated_project.name == 'new project name'

    def test_put_expenses_payload(self):
        url = f"/api/expenses/{self.expenses1.id}/"
        payload = {
            'item':self.expenses1.item,
            'price':'100.00',
            'VAT':self.expenses1.VAT,
            'receipt':self.expenses1.receipt.id
        }
        
        response = self.client.put(url,payload, format='json')
        assert response.status_code == 200
        updated_expenses = ExpenseItem.objects.get(id=self.expenses1.id)
        assert updated_expenses.price == 100

    def test_put_employees_payload(self):
        url = f"/api/employees/{self.nikos.id}/"
        payload = {
            'name':self.nikos.name,
            'age':30
        }

        response = self.client.put(url,payload, format='json')
        assert response.status_code == 200
        updated_employee= Employee.objects.get(id=self.nikos.id)
        assert updated_employee.age == 30
