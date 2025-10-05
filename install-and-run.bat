@echo off
echo Installing KalaMitra dependencies...
call npm install

echo.
echo Starting development server...
call npm run dev

pause
