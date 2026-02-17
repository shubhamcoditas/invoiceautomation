Write-Host "Stopping any existing Node.js processes on port 5000..." -ForegroundColor Yellow

# Find processes using port 5000
$processes = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess

if ($processes) {
    foreach ($pid in $processes) {
        try {
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Killing process $pid ($($process.ProcessName))" -ForegroundColor Red
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
        catch {
            Write-Host "Could not kill process $pid" -ForegroundColor Red
        }
    }
} else {
    Write-Host "No processes found using port 5000" -ForegroundColor Green
}

Write-Host "Waiting 3 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting server..." -ForegroundColor Green
npm run dev
