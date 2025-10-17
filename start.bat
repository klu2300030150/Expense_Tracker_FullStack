@echo off
echo Starting the application...

:: Start MySQL if not running (try this if you have permission)
:: net start MySQL80

:: Start Spring Boot backend
cd backend
start cmd /k "mvn spring-boot:run"

:: Wait for backend to start
timeout /t 20

:: Start frontend
cd ..
start cmd /k "npm run dev"

echo Application starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173