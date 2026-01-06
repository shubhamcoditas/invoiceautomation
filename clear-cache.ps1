# Clear Vite and Node caches
Write-Host "Clearing caches..." -ForegroundColor Yellow

# Remove node_modules/.vite cache
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✓ Cleared Vite cache" -ForegroundColor Green
}

# Remove dist folder
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✓ Cleared dist folder" -ForegroundColor Green
}

# Remove .next cache if exists
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✓ Cleared .next cache" -ForegroundColor Green
}

Write-Host "`nCache cleared! Please restart your dev server." -ForegroundColor Cyan
Write-Host "Run: npm run dev" -ForegroundColor Cyan

