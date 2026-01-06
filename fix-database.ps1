# Fix corrupted SQLite database
Write-Host "Fixing corrupted database..."

# Stop any running Node processes
Write-Host "Stopping server processes..."
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*tsx*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Delete corrupted database files
Write-Host "Removing corrupted database files..."
if (Test-Path "DB\invoice_automation.db") {
    Remove-Item "DB\invoice_automation.db" -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Deleted DB\invoice_automation.db"
}

if (Test-Path "server\invoice_automation.db") {
    Remove-Item "server\invoice_automation.db" -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Deleted server\invoice_automation.db"
}

Write-Host "`nDatabase files removed. The database will be recreated when you start the server."
Write-Host "Run: npm run dev"

