#!/bin/bash
# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL is ready!"

# Initialize the database
python -c "from app import create_tables; create_tables()"

# Start the application
exec gunicorn --bind 0.0.0.0:5000 --workers 4 app:app

