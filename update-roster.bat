@echo off
echo L1 Availability Tracker - Roster Update Utility
echo =============================================
echo.

if not exist "data" mkdir data

:prompt
echo This utility will copy your roster file to the data folder.
echo.
set /p "rosterfile=Enter the full path to your roster CSV file (or drag and drop it here): "

if "%rosterfile%"=="" goto prompt
if not exist "%rosterfile%" (
    echo.
    echo Error: File does not exist. Please enter a valid file path.
    echo.
    goto prompt
)

echo.
echo Copying %rosterfile% to data\roster.csv...

copy "%rosterfile%" "data\roster.csv" /Y

if %errorlevel% equ 0 (
    echo.
    echo Success! Your roster file has been copied.
    echo.
    echo Please refresh the L1 Availability Tracker in your browser to load the new data.
) else (
    echo.
    echo Error copying the file. Please try again or copy the file manually.
)

echo.
pause