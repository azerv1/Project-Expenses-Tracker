from django.test import TestCase
from app.models import Employee, ExpenseItem,Receipt, Project

class ModelsTest(TestCase):# Create your tests here.
    def setUp(self):
        """populate the db with a few objects"""

        asterios = Employee.objects.create(name='asterios',age=23)
        nikos = Employee.objects.create(name='nikos',age=25)

        project = Project.objects.create(name='first project',description='descprition')
        project.employees.add(asterios)

        receipt = Receipt.objects.create(employee = asterios, project= project)

        expenses1 = ExpenseItem.objects.create(receipt=receipt,
                                              item='Tool',
                                              price=100,
                                              VAT=24)
        expenses2 = ExpenseItem.objects.create(receipt=receipt,
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