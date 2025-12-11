@echo off
REM Starts backend and frontend in new windows (Windows CMD)
SETROOT=%~dp0

REM Start backend in new cmd window
start "QuickCloset Backend" cmd /k "cd /d "%ROOT%server" && npm.cmd start"

REM Start frontend in new cmd window
start "QuickCloset Frontend" cmd /k "cd /d "%ROOT%" && npx.cmd http-server -c-1 -p 8080 "%ROOT%""

exit /b 0
