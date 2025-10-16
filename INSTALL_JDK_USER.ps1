<#
Installs JDK 21 to the current user's profile (no admin), sets JAVA_HOME and PATH
#>
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$ToolsRoot = Join-Path $env:USERPROFILE 'tools'
$InstallDir = Join-Path $ToolsRoot 'jdk-21'
$ZipPath = Join-Path $env:TEMP 'jdk21.zip'
$BinPath = Join-Path $InstallDir 'bin'

if (!(Test-Path $ToolsRoot)) { New-Item -ItemType Directory -Force -Path $ToolsRoot | Out-Null }

# Use Adoptium API to get latest GA JDK 21 zip (archive)
$jdkUrl = 'https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse'
Write-Host "Downloading JDK 21 from $jdkUrl ..." -ForegroundColor Yellow
Invoke-WebRequest -UseBasicParsing -Uri $jdkUrl -OutFile $ZipPath

Write-Host "Extracting to $InstallDir ..." -ForegroundColor Yellow
if (Test-Path $InstallDir) { Remove-Item -Recurse -Force $InstallDir }
Expand-Archive -Path $ZipPath -DestinationPath $ToolsRoot -Force
Remove-Item $ZipPath -Force

# Move extracted folder (versioned) to $InstallDir
$extracted = Get-ChildItem -Path $ToolsRoot -Directory | Where-Object { $_.Name -match 'jdk-21' } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($null -eq $extracted) { throw 'JDK extraction failed - folder not found.' }
if (Test-Path $InstallDir) { Remove-Item -Recurse -Force $InstallDir }
Move-Item -Force $extracted.FullName $InstallDir

# Set JAVA_HOME for User and current session; add bin to PATH
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $InstallDir, 'User')
$env:JAVA_HOME = $InstallDir

$userPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
if ($userPath -notmatch [Regex]::Escape($BinPath)) {
  $newUserPath = if ([string]::IsNullOrWhiteSpace($userPath)) { $BinPath } else { "$userPath;$BinPath" }
  [System.Environment]::SetEnvironmentVariable('Path', $newUserPath, 'User')
}
if ($env:Path -notmatch [Regex]::Escape($BinPath)) { $env:Path = "$env:Path;$BinPath" }

Write-Host "JDK installed to: $InstallDir" -ForegroundColor Green
Write-Host "JAVA_HOME set and PATH updated for this session and user." -ForegroundColor Green
