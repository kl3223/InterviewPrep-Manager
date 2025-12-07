@echo off

REM InterviewPrep Manager - Silent Startup Script
REM This script runs all services silently without terminal windows
REM Only the Electron application window will be visible
echo ================================================
echo InterviewPrep Manager - Silent Startup
echo ================================================

REM Check if we're in the correct directory
if not exist "backend" (    
    echo ERROR: backend directory not found. Please run this script from project root.
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ERROR: frontend directory not found. Please run this script from project root.
    pause
    exit /b 1
)

REM 1. Start Backend Server silently
echo.
echo [1/3] Starting Backend Server...
start "Backend Server" /b cmd /c "cd /d %~dp0 && venv311\Scripts\activate && python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 >nul 2>&1"

REM Wait for backend initialization
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM 2. Start Frontend Dev Server silently
echo.
echo [2/3] Starting Frontend Dev Server...
start "Frontend Dev Server" /b cmd /c "cd /d %~dp0frontend && npm run dev >nul 2>&1"

REM Wait for frontend initialization
echo Waiting for frontend to start...
timeout /t 8 /nobreak >nul

REM 3. Start Electron App silently (only GUI will be visible)
echo.
echo [3/3] Starting Electron App...
start "Electron App" /b cmd /c "cd /d %~dp0frontend && npm run electron:dev >nul 2>&1"

echo.
echo ================================================
echo Application startup complete!
echo The InterviewPrep Manager window should appear shortly.
echo.
echo Note: Services are running in the background.
echo To stop all services, please restart your computer or
echo use Task Manager to terminate Python and Node.js processes.
echo ================================================

REM Exit immediately without waiting
exit
