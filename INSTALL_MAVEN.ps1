<#
Installs Apache Maven to the current user's profile (no admin required),
and updates PATH for both current session and User environment.
#>

$ErrorActionPreference = 'Stop'

# Use TLS 1.2 for downloads
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Version = '3.9.9'
$ZipName = "apache-maven-$Version-bin.zip"
$DownloadUrl = "https://archive.apache.org/dist/maven/maven-3/$Version/binaries/$ZipName"
$TempZip = Join-Path $env:TEMP $ZipName
$ToolsRoot = Join-Path $env:USERPROFILE 'tools'
$InstallDir = Join-Path $ToolsRoot "apache-maven-$Version"
$BinPath = Join-Path $InstallDir 'bin'

Write-Host "Installing Apache Maven $Version to $InstallDir" -ForegroundColor Cyan

if (!(Test-Path $ToolsRoot)) { New-Item -ItemType Directory -Force -Path $ToolsRoot | Out-Null }

if (!(Test-Path $InstallDir)) {
	Write-Host "Downloading $DownloadUrl ..." -ForegroundColor Yellow
	Invoke-WebRequest -Uri $DownloadUrl -OutFile $TempZip

	Write-Host "Extracting to $ToolsRoot ..." -ForegroundColor Yellow
	Expand-Archive -Path $TempZip -DestinationPath $ToolsRoot -Force
	Remove-Item $TempZip -Force
} else {
	Write-Host "Maven directory already exists, skipping download." -ForegroundColor Yellow
}

# Set User environment variables
[System.Environment]::SetEnvironmentVariable('MAVEN_HOME', $InstallDir, 'User')

$userPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
if ($userPath -notmatch [Regex]::Escape($BinPath)) {
	$newUserPath = if ([string]::IsNullOrWhiteSpace($userPath)) { $BinPath } else { "$userPath;$BinPath" }
	[System.Environment]::SetEnvironmentVariable('Path', $newUserPath, 'User')
}

# Update PATH for current session so mvn works immediately
if ($env:Path -notmatch [Regex]::Escape($BinPath)) {
	$env:Path = "$env:Path;$BinPath"
}

Write-Host "Maven installed to: $InstallDir" -ForegroundColor Green
Write-Host "MAVEN_HOME set for current user." -ForegroundColor Green
Write-Host "You may need to open a NEW terminal if mvn isn't recognized." -ForegroundColor Yellow
