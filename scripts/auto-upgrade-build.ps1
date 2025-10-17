param(
    [string]$ProjectPath = "D:\D Drive\OneDrive - K L University\Desktop\ef1\SpringBootApp",
    [int]$MaxIterations = 5
)

function Write-Log { param($m) Write-Output "[auto-upgrade] $m" }

if (-not (Test-Path $ProjectPath)) {
    Write-Error "Project path '$ProjectPath' not found"
    exit 2
}

Set-Location -LiteralPath $ProjectPath

# If there is a bundled JDK in the workspace, prefer it
if (Test-Path "..\.jdk") {
    $jdkPath = Resolve-Path -LiteralPath "..\.jdk\*" | Select-Object -First 1
    if ($jdkPath) {
        $env:JAVA_HOME = "$($jdkPath)"
        $env:Path = "$env:JAVA_HOME\bin;" + $env:Path
        Write-Log "Using embedded JDK: $env:JAVA_HOME"
    }
}

function Run-Build {
    Write-Log "Running mvn clean package (skip tests)"
    & mvn -B -U -DskipTests clean package 2>&1 | Tee-Object -FilePath build-output.txt
    return $LASTEXITCODE
}

function Detect-JavaxIssues {
    if (-not (Test-Path build-output.txt)) { return $false }
    $text = Get-Content build-output.txt -Raw
    return ($text -match "\bjavax\." )
}

function Replace-Javax-With-Jakarta {
    Write-Log "Replacing common javax.* imports/usages with jakarta.*"
    $files = Get-ChildItem -Path src -Recurse -Include *.java -ErrorAction SilentlyContinue
    $changed = $false
    foreach ($f in $files) {
        $content = Get-Content -Raw -LiteralPath $f.FullName
        $new = $content -replace '\bjavax\.', 'jakarta.'
        if ($new -ne $content) {
            Set-Content -LiteralPath $f.FullName -Value $new -Encoding UTF8
            Write-Log "Patched: $($f.FullName)"
            $changed = $true
        }
    }
    return $changed
}

function Commit-If-Changes([string]$msg) {
    & git add -A
    $status = & git status --porcelain
    if ($status) {
        & git commit -m $msg
        Write-Log "Committed: $msg"
        $pushExit = & git push
        if ($LASTEXITCODE -ne 0) { Write-Log "Push failed or requires auth; commit present locally." }
    } else {
        Write-Log "No changes to commit"
    }
}

$iteration = 0
while ($iteration -lt $MaxIterations) {
    $iteration++
    Write-Log "Iteration $iteration/$MaxIterations"
    $exit = Run-Build
    if ($exit -eq 0) {
        Write-Log "Build succeeded"
        break
    }

    # Inspect for common migration issues
    if (Detect-JavaxIssues) {
        Write-Log "Detected javax.* usage in build log. Applying replacements..."
        $patched = Replace-Javax-With-Jakarta
        if ($patched) {
            Commit-If-Changes "chore(auto-upgrade): replace javax.* -> jakarta.*"
            Write-Log "Re-running build after applying jakarta replacements"
            continue
        } else {
            Write-Log "No files modified by replacement step"
            break
        }
    }

    Write-Log "No automatic fix rule matched. Examine 'build-output.txt' for details."
    break
}

Write-Log "Done. Final build log: build-output.txt"
if (Test-Path build-output.txt) { Get-Content build-output.txt -Tail 200 }
