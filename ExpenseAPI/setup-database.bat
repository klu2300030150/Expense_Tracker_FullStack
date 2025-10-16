@echo off
echo Creating MySQL database for ExpenseTracker...
echo.

mysql -u root -pSreekar@8297 -e "CREATE DATABASE IF NOT EXISTS expense_tracker;"
if %errorlevel% neq 0 (
    echo Error: Could not connect to MySQL or create database
    echo.
    echo Make sure:
    echo 1. MySQL is running
    echo 2. Password is correct: Sreekar@8297
    echo 3. MySQL bin folder is in PATH
    pause
    exit /b 1
)

mysql -u root -pSreekar@8297 expense_tracker < schema.sql
if %errorlevel% neq 0 (
    echo Error: Could not create users table
    pause
    exit /b 1
)

echo.
echo ✓ Database 'expense_tracker' created successfully!
echo ✓ Table 'users' created successfully!
echo.
echo Testing connection...
mysql -u root -pSreekar@8297 -e "USE expense_tracker; SHOW TABLES; DESCRIBE users;"
echo.
echo Setup complete! Your backend can now connect to MySQL.
pause
