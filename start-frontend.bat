@echo off
REM filepath: c:\Users\pc\Desktop\GamaExpress\start-frontend.bat
echo ========================================
echo    GAMA EXPRESS FRONTEND STARTUP
echo ========================================
echo.

REM Check if we're in the right directory
echo [1/3] Checking project directory...
if not exist "package.json" (
    echo ❌ Error: package.json not found!
    echo Please make sure you're running this from the GamaExpress folder
    pause
    exit /b 1
)
echo ✅ Project directory confirmed!
echo.

REM Check Node.js installation
echo [2/3] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed!
echo.

REM Install dependencies if needed
echo [3/3] Checking dependencies...
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)
echo ✅ Dependencies ready!
echo.

echo 🚀 Starting Gama Express Frontend...
echo Frontend will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the development server
npm run dev

REM Keep window open if there's an error
if errorlevel 1 (
    echo.
    echo ❌ An error occurred starting the frontend
    echo.
    pause
)