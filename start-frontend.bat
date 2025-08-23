@echo off
echo ========================================
echo   DEMARRAGE DU FRONTEND
echo ========================================
echo.

echo 1. Arret de tous les processus Node...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo 2. Demarrage du frontend sur le port 8080...
cd /d "%~dp0\frontend"
npm run dev

echo.
echo Frontend demarre sur http://localhost:8080
echo Appuyez sur Ctrl+C pour arreter
pause
