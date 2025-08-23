@echo off
echo ========================================
echo   DEMARRAGE DU BACKEND
echo ========================================
echo.

echo 1. Arret de tous les processus Node...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo 2. Demarrage du backend sur le port 5000...
cd /d "%~dp0"
npm run dev

echo.
echo Backend demarre sur http://localhost:5000
echo Appuyez sur Ctrl+C pour arreter
pause
