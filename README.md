# Project Expenses Tracker

## Business Problem

This django DRF API solves a hypothetical business problem, that appears when the costs of a Project, are not tracked properly.
The API provides a simple database schema to track the total spendings for a project, the receipts, and the involved employees purchases.

## Technical Solutions

The tech stack of the app is Django (Django Rest Framework), PostgreSQL, React, Vite and Docker. The database schema consists of Projects, Employees, Receipts and ExpenseItems. The app implements calculated fields that automatically compute:

- The total cost of each receipt, based on its associated expense items
- The total cost of each project, aggregated from all linked receipts

## Using & Exploring the API

The endpoints of the API are:
`'/'`
`'/api/ping'`
`'/api/employees/'`
`'/api/employees/{id}'`
`'/api/projects/'`
`'/api/projects/{id}'`
`'/api/receipts/'`
`'/api/receipts/{id}'`
`'/api/expenses/'`
`'/api/expenses/{id}'`

### Added features:

- React Frontend
- Integration tests
- Input validation
- Rate limiting Middleware
- Audit logs accesible at `/admin`
- Gunicorn

## Setup & Testing

First rename the `.env_dev` file to `.env` .
Run the test suite in a fresh database using `docker compose -f docker-compose-test.yml up --abort-on-container-exit --exit-code-from api`
Run the application using `docker compose up --build`
