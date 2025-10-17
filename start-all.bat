@echo off
echo Starting Expense Tracker Application...
echo.
echo Starting Backend (Spring Boot)...
start "Backend" cmd /k "cd /d \"d:\D Drive\OneDrive - K L University\Desktop\EF2\backend\" && mvnw.cmd spring-boot:run"
timeout /t 10 /nobreak
echo.
echo Starting Frontend (React + Vite)...
start "Frontend" cmd /k "cd /d \"d:\D Drive\OneDrive - K L University\Desktop\EF2\" && npm run dev"
echo.
echo Both servers are starting...
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:8080
echo.
pause
