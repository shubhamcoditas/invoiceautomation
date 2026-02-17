@echo off
echo Stopping any existing Node.js processes on port 5000...

REM Try to find and kill processes using port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Killing process %%a
    taskkill /PID %%a /F
)

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting server...
npm run dev

pause
