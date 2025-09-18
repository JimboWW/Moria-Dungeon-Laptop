<#
Start Server helper for Moria-Dungeon-Repository
Usage: .\scripts\start-server.ps1 [-Port 8000]

This script will:
 - change to the repository root (parent of the scripts folder)
 - try `python` then `py` then look for a local Python install
 - fall back to `npx http-server` if Node is available
 - open the default browser to the game's index page
 - run the server in the current console so you can see logs
#>

param(
    [int]
    $Port = 8000
)

try {
    $repoRoot = Split-Path -Parent $PSScriptRoot
} catch {
    # If $PSScriptRoot is not available (running interactively), use current dir
    $repoRoot = Get-Location
}
Set-Location $repoRoot
Write-Host "Repository root: $repoRoot"
Write-Host "Starting server on port $Port..."

function Test-Python($exe) {
    try {
        $out = & $exe --version 2>&1
        if ($LASTEXITCODE -eq 0 -and $out -match 'Python') { return $true }
    } catch {
        return $false
    }
    return $false
}

# Prefer a working python/py
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    if (Test-Python 'python') { $pythonCmd = 'python' }
}
if (-not $pythonCmd -and (Get-Command py -ErrorAction SilentlyContinue)) {
    if (Test-Python 'py') { $pythonCmd = 'py' }
}

# Try to locate a local Python installation under %LOCALAPPDATA%\Programs\Python
if (-not $pythonCmd) {
    $localPythonRoot = Join-Path $env:LOCALAPPDATA 'Programs\Python'
    if (Test-Path $localPythonRoot) {
        $candidate = Get-ChildItem -Path $localPythonRoot -Directory -ErrorAction SilentlyContinue | ForEach-Object {
            Join-Path $_.FullName 'python.exe'
        } | Where-Object { Test-Path $_ } | Select-Object -First 1
        if ($candidate) {
            if (Test-Python $candidate) { $pythonCmd = $candidate }
        }
    }
}

if ($pythonCmd) {
    Write-Host "Using Python: $pythonCmd"
    # Open browser after a short delay to give server time to start
    Start-Job -ScriptBlock { Start-Sleep -Seconds 1; Start-Process "http://localhost:$using:Port/index1-05.html" } | Out-Null
    & $pythonCmd -m http.server $Port
    exit $LASTEXITCODE
}

# Fallback to npx http-server if Node is present
if (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "Falling back to npx http-server"
    Start-Job -ScriptBlock { Start-Sleep -Seconds 1; Start-Process "http://localhost:$using:Port/index1-05.html" } | Out-Null
    & npx http-server -p $Port
    exit $LASTEXITCODE
}

Write-Error "No suitable server command found. Install Python (and add to PATH) or Node.js. You can also run python directly with the full path, for example:`n& 'C:\\Users\\jimwi\\AppData\\Local\\Programs\\Python\\Python313\\python.exe' -m http.server $Port`"