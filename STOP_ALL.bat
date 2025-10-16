@echo off
title Expense Tracker - Stop All Services
color 0C

echo.
echo ========================================================================
echo           EXPENSE TRACKER - STOP ALL SERVICES
echo ========================================================================
echo.
echo This will stop:
echo   - Spring Boot Backend (Port 4000)
echo   - React Frontend (Port 5173)
echo.
echo ========================================================================
echo.

echo Stopping Spring Boot Backend (Port 4000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":4000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend stopped
) else (
    echo [INFO] Backend not running or already stopped
)

echo.
echo Stopping React Frontend (Port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend stopped
) else (
    echo [INFO] Frontend not running or already stopped
)

echo.
echo ========================================================================
echo.
echo All services stopped!
echo.
echo You can close the Backend and Frontend terminal windows now.
echo.
echo ========================================================================
echo.
pause
