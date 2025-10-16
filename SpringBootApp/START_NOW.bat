@echo off
echo ============================================
echo Starting Spring Boot with React Frontend
echo ============================================
echo.
echo This script:
echo 1. Uses pre-built React files from ExpenseFrontend/dist
echo 2. Copies them to src/main/resources/static
echo 3. Starts Spring Boot on port 4000
echo.

REM Set JAVA_HOME
set JAVA_HOME=C:\Users\DACHARLASREEKAR\.jdks\openjdk-24

REM Ensure React build files are in static directory
echo Copying React build files...
xcopy /Y /E /I "..\ExpenseFrontend\dist\*" "src\main\resources\static\"

REM Build Spring Boot (skip frontend plugin and tests)
echo Building Spring Boot application...
C:\Users\DACHARLASREEKAR\tools\apache-maven-3.9.9\bin\mvn.cmd clean package -Pfrontend-skip -DskipTests

REM Start Spring Boot
echo.
echo Starting Spring Boot server on port 4000...
echo.
java -jar target\springboot-app-0.0.1-SNAPSHOT.jar

pause
