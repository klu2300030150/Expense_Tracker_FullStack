@echo off
echo Starting Expense Tracker Application...

REM Start MySQL if not running (commented out as it should be running as a service)
REM net start MySQL80

REM Start Backend (Spring Boot)
start cmd /k "cd backend && mvnw spring-boot:run"

REM Wait for backend to start
timeout /t 20

REM Start Frontend (React)
start cmd /k "npm run dev"

echo Application is starting...
echo Backend will be available at http://localhost:8080
echo Frontend will be available at http://localhost:5173