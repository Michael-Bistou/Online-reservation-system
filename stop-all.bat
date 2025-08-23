@echo off
echo ========================================
echo   ARRET DE TOUS LES SERVEURS
echo ========================================
echo.

echo Arret de tous les processus Node...
taskkill /f /im node.exe >nul 2>&1

echo.
echo Tous les serveurs ont ete arretes.
echo.
pause
