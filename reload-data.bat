@echo off
echo Reloading data for L1 Availability Tracker

echo 1. Clearing browser cache (will happen automatically)
echo 2. Ensuring roster.csv is the active file:

REM Ensure roster.csv is the active file
copy /Y "%~dp0\data\roster.csv" "%~dp0\data\roster.csv.backup"
echo Backup of roster.csv created.

echo 3. Opening reset-and-load.html tool

REM Open the reset-and-load tool in the default browser
start "" "%~dp0\reset-and-load.html"

echo.
echo Please use the reset-and-load.html page that opened to:
echo - Check that the roster.csv file is detected
echo - Clear your browser's localStorage
echo - Reload the application
echo.
echo This will ensure your custom roster data is properly loaded.

pause