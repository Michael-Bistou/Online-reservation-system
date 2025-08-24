@echo off
echo ========================================
echo   Installation du Systeme de Reservation
echo ========================================
echo.

echo [1/6] Verification des prerequis...
echo.

REM Verifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installe
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js detecte

REM Verifier npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installe
    pause
    exit /b 1
)
echo ✅ npm detecte

REM Verifier Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installe
    echo Veuillez installer Git depuis https://git-scm.com/
    pause
    exit /b 1
)
echo ✅ Git detecte

echo.
echo [2/6] Installation des dependances frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dependances frontend
    pause
    exit /b 1
)
echo ✅ Dependances frontend installees

echo.
echo [3/6] Installation des dependances backend...
cd ..\src
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dependances backend
    pause
    exit /b 1
)
echo ✅ Dependances backend installees

echo.
echo [4/6] Configuration de la base de donnees...
cd ..
if exist database.sqlite (
    echo ⚠️  Base de donnees existante detectee
    set /p choice="Voulez-vous la recreeer ? (o/n): "
    if /i "%choice%"=="o" (
        del database.sqlite
        echo ✅ Ancienne base supprimee
    )
)

if not exist database.sqlite (
    node migrate-database.js
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'initialisation de la base de donnees
        pause
        exit /b 1
    )
    echo ✅ Base de donnees initialisee
)

echo.
echo [5/6] Creation des scripts de lancement...
echo @echo off > start-all.bat
echo echo ======================================== >> start-all.bat
echo echo   Demarrage du Systeme de Reservation >> start-all.bat
echo echo ======================================== >> start-all.bat
echo echo. >> start-all.bat
echo echo [1/2] Demarrage du backend... >> start-all.bat
echo start "Backend" cmd /k "cd src ^&^& npm start" >> start-all.bat
echo timeout /t 3 >> start-all.bat
echo echo [2/2] Demarrage du frontend... >> start-all.bat
echo start "Frontend" cmd /k "cd frontend ^&^& npm run dev" >> start-all.bat
echo echo. >> start-all.bat
echo echo ✅ Systeme demarre ! >> start-all.bat
echo echo 🌐 Frontend: http://localhost:8080 >> start-all.bat
echo echo 🔧 Backend: http://localhost:5000 >> start-all.bat
echo echo. >> start-all.bat
echo pause >> start-all.bat

echo ✅ Scripts de lancement crees

echo.
echo [6/6] Installation terminee !
echo.
echo ========================================
echo   Installation reussie ! 🎉
echo ========================================
echo.
echo 📋 Prochaines etapes :
echo 1. Lancer start-all.bat pour demarrer le systeme
echo 2. Ouvrir http://localhost:8080 dans votre navigateur
echo 3. Se connecter avec admin@gastroreserve.com / admin123
echo.
echo 📚 Documentation :
echo - README.md : Vue d'ensemble du projet
echo - INSTALLATION.md : Guide d'installation detaille
echo.
echo ========================================
pause
