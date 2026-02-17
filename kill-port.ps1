# Kill processes using port 5000
$port = 5000
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess

if ($processes) {
    Write-Host "Found processes using port $port. Killing them..."
    $processes | ForEach-Object {
        $proc = Get-Process -Id $_ -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "Killing process: $($proc.ProcessName) (PID: $_)"
            Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "Port $port is now free."
} else {
    Write-Host "No processes found using port $port."
}




