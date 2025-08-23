@echo off
echo ========================================
echo   DEMARRAGE COMPLET DU PROJET
echo ========================================
echo.

echo 1. Arret de tous les processus Node...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo 2. Demarrage du backend...
start "Backend" cmd /k "cd /d "%~dp0" && npm run dev"

echo 3. Attente du demarrage du backend...
timeout /t 5 >nul

echo 4. Demarrage du frontend...
start "Frontend" cmd /k "cd /d "%~dp0\frontend" && npm run dev"

echo 5. Attente du demarrage du frontend...
timeout /t 5 >nul

echo 6. Ouverture des navigateurs...
start http://localhost:5000
timeout /t 2 >nul
start http://localhost:8080

echo.
echo ========================================
echo   PROJET DEMARRE AVEC SUCCES !
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Les deux serveurs sont maintenant actifs.
echo Fermez les fenetres de commande pour arreter.
echo.
pause
