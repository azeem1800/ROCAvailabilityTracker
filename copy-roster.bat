@echo off
echo ------------------------------------------------
echo ROC Availability Tracker - Roster File Manager
echo ------------------------------------------------
echo.

REM Check if roster.csv exists in the current directory
if exist "%~dp0\roster.csv" (
  echo Found roster.csv in current directory.
  echo Copying to data directory...
  
  REM Create a backup of any existing roster.csv in data directory
  if exist "%~dp0\data\roster.csv" (
    echo Creating backup of existing roster.csv...
    copy /Y "%~dp0\data\roster.csv" "%~dp0\data\roster.csv.backup"
  )
  
  REM Copy the roster.csv to the data directory
  copy /Y "%~dp0\roster.csv" "%~dp0\data\roster.csv"
  echo Roster file successfully copied to data directory!
) else (
  echo No roster.csv found in the current directory.
  echo.
  echo Please place your roster.csv file in:
  echo %~dp0
  echo and run this script again.
)

echo.
echo ------------------------------------------------
echo Next steps:
echo 1. Open reset-and-load.html in your browser
echo 2. Click "Clear LocalStorage Data" button
echo 3. Click "Reload Application Now" button
echo.
echo This will ensure your roster data is displayed correctly.
echo ------------------------------------------------
echo.

pause