@echo off
echo Installing dependencies in the python11 conda environment...
call conda activate python11
pip install flask==2.3.3 flask-cors==4.0.0 flask-jwt-extended==4.5.3 werkzeug==2.3.7 opencv-python==4.8.0.76 mediapipe==0.10.8 numpy==1.24.3 Pillow==10.0.0 python-dotenv==1.0.0 gunicorn==21.2.0
echo.
echo Dependencies installed. Now starting the Flask backend server...
python app.py
pause
