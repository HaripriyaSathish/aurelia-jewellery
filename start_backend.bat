@echo off
echo ====================================================
echo Starting AURELIA Fine Jewellery - Django Backend
echo ====================================================
cd /d %~dp0\backend
call .\venv\Scripts\activate
python manage.py migrate
python manage.py seed_data
echo Running server on http://127.0.0.1:8000/ ...
python manage.py runserver 127.0.0.1:8000
pause
