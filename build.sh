#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== 1. Building React Frontend ==="
cd frontend
npm install
npm run build
cd ..

echo "=== 2. Installing Backend Python Dependencies ==="
pip install -r backend/requirements.txt

echo "=== 3. Running Database Migrations & Seeding Data ==="
python backend/manage.py migrate
python backend/manage.py seed_data

echo "=== 4. Collecting Static Files ==="
python backend/manage.py collectstatic --no-input

echo "=== Build Complete Successfully ==="
