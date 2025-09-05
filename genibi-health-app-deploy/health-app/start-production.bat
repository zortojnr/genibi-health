@echo off
echo 🚀 Starting GENIBI Health App Production Server...
echo.
echo 🔧 Environment: Production
echo 🌐 Port: 8080
echo 📱 Real-time features: Enabled
echo 🔒 Security: Active
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Start the server
echo ⚡ Starting server...
node server.js

pause
