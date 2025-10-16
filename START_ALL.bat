@echo off
title Expense Tracker - Complete System Startup
color 0A

echo.
echo ========================================================================
echo           EXPENSE TRACKER - FULL STACK STARTUP SCRIPT
echo ========================================================================
echo.
echo This script will start all components of your Expense Tracker:
echo   1. MySQL Database
echo   2. Spring Boot Backend (Port 4000)
echo   3. React Frontend (Port 5173)
echo.
echo ========================================================================
echo.

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MySQL command not found!
    echo Please ensure MySQL is installed and added to PATH.
    echo.
) else (
    echo [OK] MySQL is installed
)

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed!
    echo.
    echo Would you like to install JDK 17 automatically? (Y/N)
    set /p install_java=
    if /i "!install_java!"=="Y" (
        echo.
        echo Starting automatic JDK installation...
        call "%~dp0INSTALL_JDK.bat"
        if %errorlevel% neq 0 (
            echo Installation failed or cancelled.
            pause
            exit /b 1
        )
    ) else (
        echo Please install Java 17 manually from https://adoptium.net/
        echo.
        pause
        exit /b 1
    )
) else (
    echo [OK] Java is installed
    
    REM Check Java version
    for /f tokens^=2-2^ delims^=.-_+^" %%j in ('java -version 2^>^&1') do set "jver=%%j"
    if !jver! LSS 17 (
        echo [WARNING] Java version is less than 17. Spring Boot requires Java 17+
        echo.
        echo Would you like to install JDK 17? (Y/N)
        set /p upgrade_java=
        if /i "!upgrade_java!"=="Y" (
            call "%~dp0INSTALL_JDK.bat"
        ) else (
            echo [WARNING] Continuing with current Java version. This may cause errors.
            timeout /t 3 /nobreak >nul
        )
    )
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
)

echo.
echo ========================================================================
echo.

REM Step 1: Start MySQL
echo [STEP 1/3] Starting MySQL Service...
echo.
net start mysql >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] MySQL service started
) else (
    echo [INFO] MySQL service is already running or requires manual start
)
echo.

REM Step 2: Start Spring Boot Backend
echo [STEP 2/3] Starting Spring Boot Backend...
echo.
echo Opening Spring Boot in a new window...
echo Backend will run on: http://localhost:4000
echo.
start "Spring Boot Backend - Port 4000" cmd /k "cd /d "%~dp0SpringBootApp" && echo Starting Spring Boot Backend... && echo. && (mvn spring-boot:run || "%MAVEN_HOME%\bin\mvn.cmd" spring-boot:run)"

REM Wait a bit for backend to start
echo Waiting 10 seconds for backend to initialize...
timeout /t 10 /nobreak >nul

REM Step 3: Start React Frontend
echo.
echo [STEP 3/3] Starting React Frontend...
echo.
echo Opening React Frontend in a new window...
echo Frontend will run on: http://localhost:5173
echo.
start "React Frontend - Port 5173" cmd /k "cd /d "%~dp0ExpenseFrontend" && echo Starting React Frontend... && echo. && npm run dev"

echo.
echo ========================================================================
echo.
echo [SUCCESS] All components are starting!
echo.
echo Your Expense Tracker is now running:
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:4000
echo   Health:    http://localhost:4000/health
echo.
echo ========================================================================
echo.
echo IMPORTANT:
echo   - Two new windows opened for Backend and Frontend
echo   - Wait ~30 seconds for everything to fully start
echo   - Check those windows for any errors
echo   - Press Ctrl+C in each window to stop that service
echo.
echo ========================================================================
echo.
echo Quick Test URLs:
echo   1. Backend Health: http://localhost:4000/health
echo   2. Frontend App:   http://localhost:5173
echo.
echo ========================================================================
echo.
echo Press any key to open the frontend in your browser...
pause >nul

REM Open browser to frontend
start http://localhost:5173

echo.
echo Browser opened. If nothing happened, manually open: http://localhost:5173
echo.
echo This window can be closed. Backend and Frontend are running in separate windows.
echo.
pause
