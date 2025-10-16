@echo off
REM ============================================
REM  INTEGRATED STARTUP SCRIPT
REM  Frontend + Spring Boot + MySQL
REM ============================================

echo.
echo ================================================
echo    EXPENSE TRACKER - FULL STACK STARTUP
echo ================================================
echo.

REM Check MySQL
echo [1/4] Checking MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL not found! Please install MySQL first.
    echo Download: https://dev.mysql.com/downloads/installer/
    pause
    exit /b 1
)
echo [OK] MySQL is installed
echo.

REM Check Java
echo [2/4] Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found! Please install JDK 17+
    echo Download: https://adoptium.net/
    pause
    exit /b 1
)
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VERSION=%%g
)
echo [OK] Java version: %JAVA_VERSION%
echo.

REM Check Node.js
echo [3/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js 18+
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed
echo.

REM MySQL Connection Test
echo [4/4] Testing MySQL connection...
mysql -u root -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Cannot connect to MySQL with root user
    echo Please make sure MySQL is running
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "%CONTINUE%"=="y" exit /b 1
) else (
    echo [OK] MySQL connection successful
)
echo.

REM Create database if not exists
echo Creating database if not exists...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS expense_tracker;" 2>nul
mysql -u root -e "CREATE USER IF NOT EXISTS 'expense_user'@'localhost' IDENTIFIED BY 'expense_password';" 2>nul
mysql -u root -e "GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';" 2>nul
mysql -u root -e "FLUSH PRIVILEGES;" 2>nul
echo [OK] Database setup complete
echo.

echo ================================================
echo    STARTING SERVICES
echo ================================================
echo.

REM Start Spring Boot Backend in new window
echo [Starting Backend] Spring Boot API on port 4000...
cd /d "%~dp0ExpenseTrackerSpringBoot"
start "Expense Tracker Backend" cmd /k "echo Starting Spring Boot Backend... & mvnw.cmd spring-boot:run"
echo [OK] Backend starting in new window
echo.

REM Wait for backend to start
echo Waiting for backend to initialize (15 seconds)...
timeout /t 15 /nobreak >nul
echo.

REM Test backend health
echo Testing backend health...
curl -s http://localhost:4000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Backend might still be starting up
    echo Check the backend window for status
) else (
    echo [OK] Backend is responding
)
echo.

REM Start Frontend in new window
echo [Starting Frontend] React app on port 5173...
cd /d "%~dp0ExpenseFrontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    start "Frontend Setup" cmd /k "npm install && npm run dev"
) else (
    start "Expense Tracker Frontend" cmd /k "echo Starting React Frontend... & npm run dev"
)
echo [OK] Frontend starting in new window
echo.

echo ================================================
echo    STARTUP COMPLETE!
echo ================================================
echo.
echo Services are starting in separate windows:
echo.
echo [Frontend]  http://localhost:5173
echo [Backend]   http://localhost:4000
echo [Database]  MySQL on localhost:3306
echo.
echo ================================================
echo.
echo NEXT STEPS:
echo 1. Wait for both windows to finish starting
echo 2. Open browser: http://localhost:5173
echo 3. Register a new user
echo 4. Start tracking expenses!
echo.
echo TIPS:
echo - Backend window shows Spring Boot logs
echo - Frontend window shows React dev server
echo - Press Ctrl+C in each window to stop
echo.
echo ================================================
echo.
pause
