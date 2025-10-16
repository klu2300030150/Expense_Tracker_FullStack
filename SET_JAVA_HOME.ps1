# Sets JAVA_HOME and updates PATH by auto-detecting a JDK in common locations (User scope)
$ErrorActionPreference = 'Stop'

function Add-ToUserPath($pathToAdd) {
  $userPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
  if ([string]::IsNullOrWhiteSpace($userPath)) {
    [System.Environment]::SetEnvironmentVariable('Path', $pathToAdd, 'User')
  } elseif ($userPath -notmatch [Regex]::Escape($pathToAdd)) {
    [System.Environment]::SetEnvironmentVariable('Path', "$userPath;$pathToAdd", 'User')
  }
  # Also add to current session
  if ($env:Path -notmatch [Regex]::Escape($pathToAdd)) {
    $env:Path = "$env:Path;$pathToAdd"
  }
}

# Candidate roots to search
$candidateRoots = @(
  "$Env:ProgramFiles\Java",
  "$Env:ProgramFiles\Eclipse Adoptium",
  "$Env:ProgramFiles\Microsoft",
  "$Env:ProgramFiles\Zulu",
  "$Env:ProgramFiles\Java\jdk-21",
  "$Env:ProgramFiles\Java\jdk-17"
)

# Collect JDK directories that contain bin\java.exe
$jdkDirs = @()
foreach ($root in $candidateRoots) {
  if (!(Test-Path $root)) { continue }
  try {
    # search up to 2 levels deep for performance
    Get-ChildItem -Path $root -Directory -Recurse -Depth 2 -ErrorAction SilentlyContinue | ForEach-Object {
      $javaExe = Join-Path $_.FullName 'bin\java.exe'
      if (Test-Path $javaExe) {
        $jdkDirs += $_.FullName
      }
    }
  } catch { }
}

if ($jdkDirs.Count -eq 0) {
  Write-Host "No JDK installation found in common locations. Please install JDK 21 and re-run." -ForegroundColor Yellow
  exit 1
}

# Prefer JDK 21, then 17, otherwise first match
$selected = $null
$pref21 = $jdkDirs | Where-Object { $_ -match '21' }
$pref17 = $jdkDirs | Where-Object { $_ -match '17' }
if ($pref21.Count -gt 0) { $selected = $pref21[0] }
elseif ($pref17.Count -gt 0) { $selected = $pref17[0] }
else { $selected = $jdkDirs[0] }

[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $selected, 'User')
$env:JAVA_HOME = $selected
Add-ToUserPath (Join-Path $selected 'bin')

Write-Host "JAVA_HOME set to: $selected" -ForegroundColor Green
Write-Host "PATH updated for current session and user profile." -ForegroundColor Green
