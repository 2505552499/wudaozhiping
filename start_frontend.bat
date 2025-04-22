@echo off
echo Starting the React frontend...
cd frontend
echo Installing dependencies if needed...
call npm install
echo Starting development server on port 3001...
set PORT=3001 
call npm start
if %ERRORLEVEL% NEQ 0 (
  echo Error starting the frontend server.
  echo Please check if port 3001 is already in use.
  echo You can try running: netstat -ano | findstr :3001
  pause
)
