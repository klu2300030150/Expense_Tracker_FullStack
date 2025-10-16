@echo off
setlocal enabledelayedexpansion
title System Requirements Checker & Auto-Installer
color 0E

echo.
echo ========================================================================
echo      EXPENSE TRACKER - SYSTEM REQUIREMENTS CHECKER
echo ========================================================================
echo.
echo This script will check and install all required software:
echo   - Java JDK 17+
echo   - Node.js 18+
echo   - MySQL 8+
echo.
echo ========================================================================
echo.

set ALL_OK=1

REM ========================================================================
REM CHECK JAVA
REM ========================================================================
echo [CHECK 1/3] Java JDK 17 or higher...
echo.

java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Java is NOT installed
    echo.
    set ALL_OK=0
    set NEED_JAVA=1
) else (
    echo [✓] Java is installed
    java -version
    
    REM Check version
    for /f tokens^=2-2^ delims^=.-_+^" %%j in ('java -version 2^>^&1') do set "jver=%%j"
    if !jver! LSS 17 (
        echo.
        echo [X] Java version is less than 17
        echo [!] Spring Boot requires Java 17 or higher
        set ALL_OK=0
        set NEED_JAVA=1
    ) else (
        echo [✓] Java version 17+ detected
    )
)
echo.

REM ========================================================================
REM CHECK NODE.JS
REM ========================================================================
echo [CHECK 2/3] Node.js 18 or higher...
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js is NOT installed
    echo.
    set ALL_OK=0
    set NEED_NODE=1
) else (
    echo [✓] Node.js is installed
    node --version
    echo.
)

REM ========================================================================
REM CHECK MYSQL
REM ========================================================================
echo [CHECK 3/3] MySQL 8 or higher...
echo.

mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] MySQL is NOT installed or not in PATH
    echo.
    set ALL_OK=0
    set NEED_MYSQL=1
) else (
    echo [✓] MySQL is installed
    mysql --version
    echo.
)

echo ========================================================================
echo.

REM ========================================================================
REM SUMMARY
REM ========================================================================
if %ALL_OK%==1 (
    echo [SUCCESS] All requirements are satisfied!
    echo.
    echo You are ready to run the Expense Tracker application.
    echo.
    echo Press any key to start the application...
    pause >nul
    call "%~dp0START_ALL.bat"
    exit /b 0
) else (
    echo [WARNING] Some requirements are missing.
    echo.
    echo Missing software:
    if defined NEED_JAVA echo   - Java JDK 17+
    if defined NEED_NODE echo   - Node.js 18+
    if defined NEED_MYSQL echo   - MySQL 8+
    echo.
    echo ========================================================================
    echo.
    echo Would you like to install missing software automatically? (Y/N)
    set /p auto_install=
    echo.
    
    if /i "!auto_install!" NEQ "Y" (
        echo Installation cancelled.
        echo.
        echo Please install manually:
        if defined NEED_JAVA echo   - Java: https://adoptium.net/
        if defined NEED_NODE echo   - Node.js: https://nodejs.org/
        if defined NEED_MYSQL echo   - MySQL: https://dev.mysql.com/downloads/installer/
        echo.
        pause
        exit /b 1
    )
)

REM ========================================================================
REM AUTO INSTALLATION
REM ========================================================================
echo ========================================================================
echo           AUTOMATIC INSTALLATION
echo ========================================================================
echo.

REM Install Java if needed
if defined NEED_JAVA (
    echo.
    echo ========================================================================
    echo [1/3] Installing Java JDK 17...
    echo ========================================================================
    echo.
    call "%~dp0INSTALL_JDK.bat"
    if %errorlevel% neq 0 (
        echo [ERROR] Java installation failed!
        set INSTALL_FAILED=1
    ) else (
        echo [SUCCESS] Java installed successfully!
    )
    echo.
)

REM Install Node.js if needed
if defined NEED_NODE (
    echo.
    echo ========================================================================
    echo [2/3] Installing Node.js...
    echo ========================================================================
    echo.
    echo Downloading Node.js installer...
    echo.
    
    set NODE_URL=https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi
    set NODE_INSTALLER=%TEMP%\node_installer.msi
    
    powershell -Command "& {$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_INSTALLER%' -UseBasicParsing}"
    
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to download Node.js installer!
        echo Please download manually from: https://nodejs.org/
        set INSTALL_FAILED=1
    ) else (
        echo [SUCCESS] Download complete!
        echo.
        echo Installing Node.js...
        echo Please follow the installation wizard.
        echo.
        msiexec /i "%NODE_INSTALLER%" /passive
        
        echo Waiting for installation to complete...
        timeout /t 15 /nobreak >nul
        
        del /f /q "%NODE_INSTALLER%" >nul 2>&1
        echo [SUCCESS] Node.js installed!
    )
    echo.
)

REM MySQL installation instructions
if defined NEED_MYSQL (
    echo.
    echo ========================================================================
    echo [3/3] MySQL Installation
    echo ========================================================================
    echo.
    echo MySQL installer is too large to download automatically.
    echo.
    echo Please install MySQL manually:
    echo.
    echo 1. Go to: https://dev.mysql.com/downloads/installer/
    echo 2. Download: "mysql-installer-community-8.0.XX.X.msi"
    echo 3. Run the installer
    echo 4. Choose "Developer Default" setup type
    echo 5. Set root password (remember it!)
    echo 6. Complete the installation
    echo.
    echo Opening MySQL download page in your browser...
    start https://dev.mysql.com/downloads/installer/
    echo.
    echo Press any key after MySQL installation is complete...
    pause >nul
    echo.
)

REM ========================================================================
REM FINAL CHECK
REM ========================================================================
echo ========================================================================
echo           VERIFYING INSTALLATIONS
echo ========================================================================
echo.

echo Checking Java...
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Java is working
    java -version
) else (
    echo [X] Java installation verification failed
    echo Please restart your computer and try again
    set INSTALL_FAILED=1
)
echo.

echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Node.js is working
    node --version
) else (
    echo [X] Node.js installation verification failed
    echo Please restart your computer and try again
    set INSTALL_FAILED=1
)
echo.

echo Checking MySQL...
mysql --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] MySQL is working
    mysql --version
) else (
    echo [!] MySQL installation verification pending
    echo If you just installed MySQL, please restart your computer
)
echo.

echo ========================================================================
echo.

if defined INSTALL_FAILED (
    echo [WARNING] Some installations may have failed or require a restart.
    echo.
    echo Please:
    echo   1. Restart your computer
    echo   2. Run this script again to verify
    echo.
) else (
    echo [SUCCESS] All installations completed!
    echo.
    echo IMPORTANT: Please restart your computer for changes to take effect.
    echo.
    echo After restart, run START_ALL.bat to start the application.
    echo.
)

echo ========================================================================
echo.
pause
