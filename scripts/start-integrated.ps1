param(
    [int]$BackendPort = 4000,
    [int]$FrontendPort = 5173
)

function Wait-Port($port, $timeoutSec = 60) {
    $start = Get-Date
    while ((Get-Date) - $start -lt (New-TimeSpan -Seconds $timeoutSec)) {
        try { $tcp = New-Object System.Net.Sockets.TcpClient('127.0.0.1', $port); $tcp.Close(); return $true } catch { Start-Sleep -Milliseconds 500 }
    }
    return $false
}

Write-Output "Starting integrated app: backend -> http://localhost:$BackendPort , frontend -> http://localhost:$FrontendPort"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start backend (Maven spring-boot:run) in a new PowerShell process
$backendLog = Join-Path $scriptDir '..\SpringBootApp\backend.log' | Resolve-Path -ErrorAction SilentlyContinue
if (-not $backendLog) { $backendLog = Join-Path $scriptDir '..\SpringBootApp\backend.log' }
$backendProcess = Start-Process -FilePath 'powershell' -ArgumentList "-NoProfile -Command `"Set-Location -LiteralPath '$($scriptDir)\..\SpringBootApp'; $env:JAVA_HOME='$($scriptDir)\..\.jdk\jdk-21.0.8+9'; $env:Path = $env:JAVA_HOME + '\\bin;' + $env:Path; mvn -DskipTests spring-boot:run 2>&1 | Tee-Object -FilePath '$backendLog'`"" -WindowStyle Hidden -PassThru
Write-Output "Started backend process id: $($backendProcess.Id)"

Write-Output "Waiting for backend to accept connections on port $BackendPort..."
if (-not (Wait-Port $BackendPort 60)) { Write-Output "Backend did not start within timeout."; exit 1 }
Write-Output "Backend is up"

# Start frontend (Vite) in a new PowerShell process
$frontendLog = Join-Path $scriptDir '..\ExpenseFrontend\frontend.log'
$frontendProcess = Start-Process -FilePath 'powershell' -ArgumentList "-NoProfile -Command `"Set-Location -LiteralPath '$($scriptDir)\..\ExpenseFrontend'; npm run dev 2>&1 | Tee-Object -FilePath '$frontendLog'`"" -WindowStyle Hidden -PassThru
Write-Output "Started frontend process id: $($frontendProcess.Id)"

Write-Output "Waiting for frontend to accept connections on port $FrontendPort..."
if (-not (Wait-Port $FrontendPort 60)) { Write-Output "Frontend did not start within timeout."; exit 1 }
Write-Output "Frontend is up"

Write-Output "Tailing logs (press Ctrl+C to stop). Backend log: $backendLog , Frontend log: $frontendLog"
Write-Output "To stop: Stop-Process -Id $($backendProcess.Id) ; Stop-Process -Id $($frontendProcess.Id)"

# Tail logs until Ctrl+C
try {
    Get-Content -Path $backendLog -Wait -Tail 20 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "[BACKEND] $_" }
} catch {
    # user interrupted
}
