# PowerShell script to fix dependency issues
Write-Host "🔧 Fixing dependency conflicts..." -ForegroundColor Yellow

# Update @types/node to compatible version
Write-Host "📦 Updating @types/node to compatible version..." -ForegroundColor Blue
npm install @types/node@^20.19.0 --save-dev --legacy-peer-deps

# Install dependencies with legacy peer deps
Write-Host "📦 Installing dependencies with legacy peer deps..." -ForegroundColor Blue
npm install --legacy-peer-deps

Write-Host "✅ Dependencies fixed!" -ForegroundColor Green
Write-Host "🚀 You can now run: npm run dev" -ForegroundColor Cyan
