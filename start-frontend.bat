@echo off
echo 🚀 GamaExpress Development Startup Script
echo ========================================
echo.

echo 📂 Current directory:
cd

echo.
echo 📋 Checking Node.js and npm versions:
node --version
npm --version

echo.
echo 🔍 Checking if package.json exists:
if exist package.json (
    echo ✅ package.json found
) else (
    echo ❌ package.json not found!
    pause
    exit /b 1
)

echo.
echo 🔍 Checking if node_modules exists:
if exist node_modules (
    echo ✅ node_modules found
) else (
    echo ❌ node_modules not found - running npm install...
    npm install
)

echo.
echo 🔍 Checking critical files:
if exist src\main.jsx (
    echo ✅ src\main.jsx found
) else (
    echo ❌ src\main.jsx missing!
)

if exist src\App.jsx (
    echo ✅ src\App.jsx found
) else (
    echo ❌ src\App.jsx missing!
)

if exist index.html (
    echo ✅ index.html found
) else (
    echo ❌ index.html missing!
)

echo.
echo 🚀 Starting frontend development server...
echo.
echo Frontend will be available at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
