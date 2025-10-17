# Runs the Spring Boot app on port 4000
# Usage: powershell -ExecutionPolicy Bypass -File .\run-springboot.ps1

$ErrorActionPreference = 'Stop'

function Assert-JavaInstalled {
  try {
    $v = & java -version 2>&1 | Select-Object -First 1
    if (-not $v) { throw 'java not found' }
    Write-Host "Java found: $v" -ForegroundColor Green
  } catch {
    Write-Host "Java is not installed or not on PATH." -ForegroundColor Yellow
    Write-Host "Install JDK 21 with winget:" -ForegroundColor Yellow
    Write-Host "winget install EclipseAdoptium.Temurin.21.JDK" -ForegroundColor Cyan
    throw "Install Java then re-run this script."
  }
}

function Start-App {
  $jar = Join-Path $PSScriptRoot 'target/springboot-app-0.0.1-SNAPSHOT.jar'
  if (-not (Test-Path $jar)) {
    throw "JAR not found at $jar. Build it first with: mvn -DskipTests package"
  }
  Write-Host "Starting Spring Boot (port 4000)..." -ForegroundColor Green
  & java -jar $jar
}

Assert-JavaInstalled
Start-App
