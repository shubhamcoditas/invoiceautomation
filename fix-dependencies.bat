@echo off
echo 🔧 Fixing dependency conflicts...

echo 📦 Updating @types/node to compatible version...
npm install @types/node@^20.19.0 --save-dev --legacy-peer-deps

echo 📦 Installing dependencies with legacy peer deps...
npm install --legacy-peer-deps

echo ✅ Dependencies fixed!
echo 🚀 You can now run: npm run dev
pause
