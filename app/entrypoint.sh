#!/bin/sh

echo 'making migrations'
python manage.py makemigrations

echo 'migrating'
python manage.py migrate

echo 'creating admin of doesnt exist'
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
username = "${DJANGO_SUPERUSER_USERNAME}"
email = "${DJANGO_SUPERUSER_EMAIL}"
password = "${DJANGO_SUPERUSER_PASSWORD}"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print("Superuser created!")
else:
    print("Superuser already exists.")
EOF

echo 'starting server'
python manage.py runserver 0.0.0.0:8000