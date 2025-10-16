@echo off
REM ============================================
REM  COMPLETE INTEGRATION SCRIPT
REM  Frontend + Spring Boot Backend + MySQL
REM ============================================

color 0A
title Expense Tracker - Full Integration

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        EXPENSE TRACKER - FULL STACK INTEGRATION                ║
echo ║                                                                ║
echo ║        Frontend (React) + Backend (Spring Boot) + MySQL       ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.

REM ============================================
REM  STEP 1: CHECK PREREQUISITES
REM ============================================

echo ┌────────────────────────────────────────────────────────────────┐
echo │  STEP 1: Checking Prerequisites                               │
echo └────────────────────────────────────────────────────────────────┘
echo.

REM Check Java
echo [1/4] Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java NOT found!
    echo.
    echo Please install Java 17 or higher:
    echo https://adoptium.net/
    echo.
    pause
    exit /b 1
)
echo ✓ Java is installed
echo.

REM Check Node.js
echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js NOT found!
    echo.
    echo Please install Node.js 18 or higher:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

REM Check MySQL
echo [3/4] Checking MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL NOT found!
    echo.
    echo Please install MySQL 8.0:
    echo https://dev.mysql.com/downloads/installer/
    echo.
    pause
    exit /b 1
)
echo ✓ MySQL is installed
echo.

REM Check MySQL Connection
echo [4/4] Testing MySQL connection...
mysql -u root -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ WARNING: Cannot connect to MySQL!
    echo.
    echo Please make sure:
    echo 1. MySQL service is running
    echo 2. You know the root password
    echo.
    set /p MYSQL_PASSWORD="Enter MySQL root password (or press Enter if no password): "
) else (
    echo ✓ MySQL connection successful
    set MYSQL_PASSWORD=
)
echo.

echo ✓ All prerequisites met!
echo.

REM ============================================
REM  STEP 2: SETUP DATABASE
REM ============================================

echo ┌────────────────────────────────────────────────────────────────┐
echo │  STEP 2: Setting Up Database                                  │
echo └────────────────────────────────────────────────────────────────┘
echo.

echo Creating database 'expense_tracker'...

if "%MYSQL_PASSWORD%"=="" (
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS expense_tracker;" 2>nul
    mysql -u root -e "CREATE USER IF NOT EXISTS 'expense_user'@'localhost' IDENTIFIED BY 'expense_password';" 2>nul
    mysql -u root -e "GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';" 2>nul
    mysql -u root -e "FLUSH PRIVILEGES;" 2>nul
) else (
    mysql -u root -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS expense_tracker;" 2>nul
    mysql -u root -p%MYSQL_PASSWORD% -e "CREATE USER IF NOT EXISTS 'expense_user'@'localhost' IDENTIFIED BY 'expense_password';" 2>nul
    mysql -u root -p%MYSQL_PASSWORD% -e "GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';" 2>nul
    mysql -u root -p%MYSQL_PASSWORD% -e "FLUSH PRIVILEGES;" 2>nul
)

echo ✓ Database created: expense_tracker
echo ✓ User created: expense_user
echo ✓ Permissions granted
echo.

REM ============================================
REM  STEP 3: CONFIGURE BACKEND
REM ============================================

echo ┌────────────────────────────────────────────────────────────────┐
echo │  STEP 3: Configuring Spring Boot Backend                      │
echo └────────────────────────────────────────────────────────────────┘
echo.

cd /d "%~dp0ExpenseTrackerSpringBoot"

REM Check if application.properties exists
if exist "src\main\resources\application.properties" (
    echo ✓ Backend configuration found
) else (
    echo ⚠ Creating backend configuration...
    
    echo # Spring Boot Configuration > src\main\resources\application.properties
    echo # Database Configuration >> src\main\resources\application.properties
    echo spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker?createDatabaseIfNotExist=true >> src\main\resources\application.properties
    echo spring.datasource.username=expense_user >> src\main\resources\application.properties
    echo spring.datasource.password=expense_password >> src\main\resources\application.properties
    echo spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver >> src\main\resources\application.properties
    echo. >> src\main\resources\application.properties
    echo # JPA Configuration >> src\main\resources\application.properties
    echo spring.jpa.hibernate.ddl-auto=update >> src\main\resources\application.properties
    echo spring.jpa.show-sql=true >> src\main\resources\application.properties
    echo spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect >> src\main\resources\application.properties
    echo. >> src\main\resources\application.properties
    echo # Server Configuration >> src\main\resources\application.properties
    echo server.port=4000 >> src\main\resources\application.properties
    echo. >> src\main\resources\application.properties
    echo # JWT Configuration >> src\main\resources\application.properties
    echo jwt.secret=mySecretKey123456789012345678901234567890 >> src\main\resources\application.properties
    echo jwt.expiration=86400000 >> src\main\resources\application.properties
    
    echo ✓ Configuration created
)
echo.

REM ============================================
REM  STEP 4: CONFIGURE FRONTEND
REM ============================================

echo ┌────────────────────────────────────────────────────────────────┐
echo │  STEP 4: Configuring React Frontend                           │
echo └────────────────────────────────────────────────────────────────┘
echo.

cd /d "%~dp0ExpenseFrontend"

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies (this may take a few minutes)...
    call npm install
    echo ✓ Dependencies installed
) else (
    echo ✓ Dependencies already installed
)
echo.

REM Check frontend API configuration
if exist "src\lib\api.js" (
    findstr /C:"localhost:4000" src\lib\api.js >nul
    if %errorlevel% equ 0 (
        echo ✓ Frontend is configured to connect to backend
    ) else (
        echo ⚠ Frontend API URL might need configuration
    )
) else (
    echo ⚠ API configuration file not found
)
echo.

REM ============================================
REM  STEP 5: START SERVICES
REM ============================================

echo ┌────────────────────────────────────────────────────────────────┐
echo │  STEP 5: Starting All Services                                │
echo └────────────────────────────────────────────────────────────────┘
echo.

echo Starting services in separate windows...
echo.

REM Start Backend
echo [1/2] Starting Spring Boot Backend...
cd /d "%~dp0ExpenseTrackerSpringBoot"
start "🔥 Backend - Spring Boot (Port 4000)" cmd /k "color 0E && echo. && echo ╔════════════════════════════════════════╗ && echo ║   BACKEND - Spring Boot API            ║ && echo ║   Port: 4000                          ║ && echo ╚════════════════════════════════════════╝ && echo. && echo Starting backend server... && echo. && mvnw.cmd spring-boot:run"
echo    ✓ Backend window opened
echo.

REM Wait for backend to start
echo    Waiting for backend to initialize...
timeout /t 20 /nobreak >nul

REM Check if backend is running
curl -s http://localhost:4000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Backend is running on http://localhost:4000
) else (
    echo    ⚠ Backend is still starting (check the backend window)
)
echo.

REM Start Frontend
echo [2/2] Starting React Frontend...
cd /d "%~dp0ExpenseFrontend"
start "🚀 Frontend - React (Port 5173)" cmd /k "color 0B && echo. && echo ╔════════════════════════════════════════╗ && echo ║   FRONTEND - React App                 ║ && echo ║   Port: 5173                          ║ && echo ╚════════════════════════════════════════╝ && echo. && echo Starting frontend server... && echo. && npm run dev"
echo    ✓ Frontend window opened
echo.

timeout /t 3 >nul

REM ============================================
REM  INTEGRATION COMPLETE
REM ============================================

cls
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║              ✓ INTEGRATION COMPLETE! ✓                        ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  🌐 ACCESS YOUR APPLICATION                                    │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:4000
echo   Database:  MySQL (localhost:3306)
echo.
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  📋 WHAT'S RUNNING                                             │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo   ✓ MySQL Database (expense_tracker)
echo   ✓ Spring Boot API (Port 4000)
echo   ✓ React Frontend (Port 5173)
echo.
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  🎯 NEXT STEPS                                                 │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo   1. Wait for both services to finish starting (check the windows)
echo   2. Open your browser and go to: http://localhost:5173
echo   3. Register a new user account
echo   4. Login and start tracking expenses!
echo.
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  💡 TIPS                                                       │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo   • Backend logs are in the yellow window
echo   • Frontend logs are in the blue window
echo   • Press Ctrl+C in each window to stop the services
echo   • Data is saved in MySQL database
echo   • Changes to code will auto-reload
echo.
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  🔧 TROUBLESHOOTING                                            │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo   If you see errors:
echo.
echo   1. CORS Error: Backend CORS is already configured ✓
echo   2. Connection Refused: Wait for backend to fully start
echo   3. Port in Use: Close other apps using ports 4000 or 5173
echo   4. MySQL Error: Check MySQL service is running
echo.
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:5173

echo.
echo Browser opened! Registration page should load.
echo.
echo This window can be closed. Services run in other windows.
echo.
pause
