@echo off
title Granthālaya - Heritage Classical Indian Library System
echo ======================================================================
echo    GRANTHĀLAYA (ग्रन्थालय) - Classical Indian Library System
echo ======================================================================
echo.
echo Launching Granthālaya Library System in your default browser...
echo.

:: Check if Python is available to launch a local server, otherwise open index.html directly
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting local web server on http://localhost:8000 ...
    start "" http://localhost:8000
    python -m http.server 8000
) else (
    echo Opening application directly in default browser...
    start "" "%~dp0index.html"
)
pause
