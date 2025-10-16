@echo off
title Automatic JDK 17 Installer
color 0B

echo.
echo ========================================================================
echo           AUTOMATIC JDK 17 INSTALLER FOR EXPENSE TRACKER
echo ========================================================================
echo.

REM Check if Java is already installed
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Java is already installed. Checking version...
    echo.
    java -version
    echo.
    
    REM Get Java version
    for /f tokens^=2-2^ delims^=.-_+^" %%j in ('java -version 2^>^&1') do set "jver=%%j"
    
    if !jver! GEQ 17 (
        echo [SUCCESS] Java 17 or higher is already installed!
        echo You're all set. No installation needed.
        echo.
        echo Press any key to continue to setup...
        pause >nul
        exit /b 0
    ) else (
        echo [WARNING] Java version is less than 17.
        echo Spring Boot requires Java 17 or higher.
        echo.
        echo Would you like to install JDK 17? (Y/N)
        set /p choice=
        if /i "!choice!" NEQ "Y" (
            echo Installation cancelled.
            pause
            exit /b 1
        )
    )
) else (
    echo [INFO] Java is not installed.
    echo.
    echo Would you like to install JDK 17 automatically? (Y/N)
    set /p choice=
    if /i "!choice!" NEQ "Y" (
        echo Installation cancelled.
        echo Please install Java 17 manually from: https://adoptium.net/
        pause
        exit /b 1
    )
)

echo.
echo ========================================================================
echo           DOWNLOADING JDK 17 (Eclipse Temurin)
echo ========================================================================
echo.
echo This will download and install JDK 17 from Eclipse Adoptium.
echo Source: https://adoptium.net/
echo.
echo Please wait...
echo.

REM Create temp directory
set TEMP_DIR=%TEMP%\jdk_installer
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

REM Detect architecture
echo [1/5] Detecting system architecture...
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set ARCH=x64
    echo System: 64-bit
) else (
    set ARCH=x86
    echo System: 32-bit
)
echo.

REM Download JDK 17
echo [2/5] Downloading JDK 17 installer...
echo This may take a few minutes depending on your internet speed...
echo.

set JDK_URL=https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.9%%2B9/OpenJDK17U-jdk_x64_windows_hotspot_17.0.9_9.msi
set JDK_INSTALLER=%TEMP_DIR%\jdk17_installer.msi

REM Download using PowerShell
powershell -Command "& {$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri '%JDK_URL%' -OutFile '%JDK_INSTALLER%' -UseBasicParsing}"

if %errorlevel% neq 0 (
    echo [ERROR] Failed to download JDK installer!
    echo.
    echo Please check your internet connection and try again.
    echo Or manually download from: https://adoptium.net/
    echo.
    pause
    exit /b 1
)

echo [SUCCESS] Download complete!
echo.

REM Install JDK
echo [3/5] Installing JDK 17...
echo.
echo This will open the JDK installer.
echo Please follow the installation wizard.
echo.
echo IMPORTANT: 
echo   - Accept the license agreement
echo   - Use default installation path (recommended)
echo   - Check "Set JAVA_HOME variable" if available
echo   - Check "Add to PATH" if available
echo.
pause

msiexec /i "%JDK_INSTALLER%" /passive ADDLOCAL=FeatureMain,FeatureEnvironment,FeatureJarFileRunWith,FeatureJavaHome

echo.
echo [4/5] Waiting for installation to complete...
timeout /t 10 /nobreak >nul

REM Set JAVA_HOME if not set
echo.
echo [5/5] Configuring environment variables...
echo.

REM Find JDK installation
set JDK_PATH=
for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk-17*") do set JDK_PATH=%%i
if not defined JDK_PATH (
    for /d %%i in ("C:\Program Files\Java\jdk-17*") do set JDK_PATH=%%i
)

if defined JDK_PATH (
    echo Found JDK at: %JDK_PATH%
    echo.
    
    REM Set JAVA_HOME permanently
    setx JAVA_HOME "%JDK_PATH%" /M >nul 2>&1
    if %errorlevel% equ 0 (
        echo [SUCCESS] JAVA_HOME set to: %JDK_PATH%
    ) else (
        echo [INFO] Could not set JAVA_HOME automatically (requires admin).
        echo Please set it manually in System Environment Variables.
    )
    
    REM Add to PATH
    setx PATH "%PATH%;%JDK_PATH%\bin" /M >nul 2>&1
    if %errorlevel% equ 0 (
        echo [SUCCESS] Added Java to PATH
    )
    
    REM Update current session
    set JAVA_HOME=%JDK_PATH%
    set PATH=%PATH%;%JDK_PATH%\bin
) else (
    echo [WARNING] Could not automatically detect JDK installation path.
    echo Please manually set JAVA_HOME to your JDK installation directory.
)

echo.
echo ========================================================================
echo.
echo [CLEANUP] Removing temporary files...
del /f /q "%JDK_INSTALLER%" >nul 2>&1

echo.
echo ========================================================================
echo           INSTALLATION COMPLETE!
echo ========================================================================
echo.

REM Verify installation
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Java is now installed and ready to use!
    echo.
    echo Installed version:
    java -version
    echo.
    echo You can now run your Spring Boot application!
    echo.
) else (
    echo [WARNING] Java command not found in current session.
    echo.
    echo Please close this window and open a new Command Prompt to use Java.
    echo Or restart your computer for changes to take effect.
    echo.
)

echo ========================================================================
echo.
echo Next steps:
echo   1. Close this window
echo   2. Open a new Command Prompt
echo   3. Verify installation: java -version
echo   4. Run START_ALL.bat to start your application
echo.
echo ========================================================================
echo.
pause
