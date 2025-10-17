param(
    [int]$Port = 4000
)

function Test-PortOpen {
    param($port)
    try {
        $listener = New-Object System.Net.Sockets.TcpClient
        $listener.Connect('127.0.0.1',$port)
        $listener.Close()
        return $true
    } catch {
        return $false
    }
}

# If port already open, just open the browser
if (Test-PortOpen -port $Port) {
    Write-Host "Port $Port is already listening. Opening browser..."
    Start-Process "http://localhost:$Port/"
    exit 0
}

# Start Spring Boot via Maven in background
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$appDir = Join-Path $scriptDir "..\SpringBootApp"
Set-Location -LiteralPath $appDir

Write-Host "Starting Spring Boot (this runs mvn -DskipTests spring-boot:run)..."
$env:JAVA_HOME = Join-Path (Split-Path $scriptDir -Parent) ".jdk\jdk-21.0.8+9"
$env:Path = $env:JAVA_HOME + '\bin;' + $env:Path

$startInfo = New-Object System.Diagnostics.ProcessStartInfo
$startInfo.FileName = 'mvn'
$startInfo.Arguments = '-DskipTests spring-boot:run'
$startInfo.WorkingDirectory = $appDir
$startInfo.RedirectStandardOutput = $true
$startInfo.RedirectStandardError = $true
$startInfo.UseShellExecute = $false
$startInfo.CreateNoWindow = $true

$proc = New-Object System.Diagnostics.Process
$proc.StartInfo = $startInfo
$proc.Start() | Out-Null

# Tail output asynchronously
$stdout = $proc.StandardOutput
$stderr = $proc.StandardError

Start-Job -ScriptBlock {
    param($out)
    while (-not $out.EndOfStream) {
        $line = $out.ReadLine()
        Write-Host $line
    }
} -ArgumentList $stdout | Out-Null

Start-Job -ScriptBlock {
    param($err)
    while (-not $err.EndOfStream) {
        $line = $err.ReadLine()
        Write-Host $line
    }
} -ArgumentList $stderr | Out-Null

# Wait for port
for ($i=0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 1
    if (Test-PortOpen -port $Port) {
        Write-Host "Spring Boot is listening on port $Port. Opening browser..."
        Start-Process "http://localhost:$Port/"
        exit 0
    }
}

Write-Host "Timed out waiting for Spring Boot to listen on port $Port. Check logs." 
exit 1
