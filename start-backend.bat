@echo off
echo 🚗 GamaExpress Backend Startup Script
echo =====================================
echo.

echo 📂 Current directory:
cd

echo.
echo 🔍 Checking if .env file exists:
if exist .env (
    echo ✅ .env file found
) else (
    echo ❌ .env file missing!
    echo Please create .env file with your Supabase credentials
    pause
    exit /b 1
)

echo.
echo 🔍 Checking if server.js exists:
if exist server.js (
    echo ✅ server.js found
) else (
    echo ❌ server.js missing!
    pause
    exit /b 1
)

echo.
echo 🚀 Starting backend API server...
echo.
echo Backend will be available at: http://localhost:3001
echo API Documentation: http://localhost:3001/api-docs
echo Health Check: http://localhost:3001/health
echo Press Ctrl+C to stop the server
echo.

npm run backend:dev

pause
