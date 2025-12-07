@echo off

REM InterviewPrep Manager One-Click Startup Script
REM This script will automatically start backend service, frontend dev server and Electron app

echo ================================================
echo InterviewPrep Manager - One-Click Startup
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

REM 1. Start Backend Server
echo.
echo [1/3] Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0 && venv311\Scripts\activate && python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for backend initialization
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM 2. Start Frontend Dev Server
echo.
echo [2/3] Starting Frontend Dev Server...
start "Frontend Dev Server" cmd /k "cd /d %~dp0frontend && npm run dev"

REM Wait for frontend initialization
echo Waiting for frontend to start...
timeout /t 8 /nobreak >nul

REM 3. Start Electron App
echo.
echo [3/3] Starting Electron App...
start "Electron App" cmd /k "cd /d %~dp0frontend && npm run electron:dev"

echo.
echo ================================================
echo All services started successfully!
echo The application will open in Electron window
echo To close all services, close all opened command windows
echo ================================================

REM Keep window open
echo.
echo Press any key to exit this script...
pause >nul
