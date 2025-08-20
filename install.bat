@echo off
echo ========================================
echo Installation du Systeme de Reservation
echo ========================================
echo.

echo [1/7] Verification des prerequis...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe
    echo Téléchargez Node.js sur https://nodejs.org/
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: npm n'est pas installe
    pause
    exit /b 1
)

echo ✅ Node.js et npm sont installes
echo.

echo [2/7] Installation des dependances backend...
call npm install
if errorlevel 1 (
    echo ERREUR: Echec de l'installation des dependances backend
    pause
    exit /b 1
)
echo ✅ Dependances backend installees
echo.

echo [3/7] Installation des dependances frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo ERREUR: Echec de l'installation des dependances frontend
    pause
    exit /b 1
)
cd ..
echo ✅ Dependances frontend installees
echo.

echo [4/7] Configuration de l'environnement...
if not exist .env (
    copy env.dev .env
    echo ✅ Fichier .env cree
) else (
    echo ✅ Fichier .env existe deja
)
echo.

echo [5/7] Verification de la base de donnees...
echo ATTENTION: Assurez-vous que MySQL est demarre
echo Si vous utilisez XAMPP, demarrez MySQL dans le Control Panel
echo.
pause

echo [6/7] Creation de la base de donnees...
echo Veuillez entrer le mot de passe MySQL root (laissez vide si aucun):
set /p mysql_password=

if "%mysql_password%"=="" (
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS reservation_system;"
) else (
    mysql -u root -p%mysql_password% -e "CREATE DATABASE IF NOT EXISTS reservation_system;"
)

if errorlevel 1 (
    echo ERREUR: Impossible de se connecter a MySQL
    echo Verifiez que MySQL est demarre et que le mot de passe est correct
    pause
    exit /b 1
)
echo ✅ Base de donnees creee
echo.

echo [7/7] Installation terminee !
echo.
echo ========================================
echo PROCHAINES ETAPES:
echo ========================================
echo.
echo 1. Configurez le fichier .env avec vos parametres MySQL
echo 2. Lancez le backend: npm run dev
echo 3. Lancez le frontend: cd frontend && npm run dev
echo.
echo URLs d'acces:
echo - Backend: http://localhost:3000
echo - Frontend: http://localhost:5173
echo - API: http://localhost:3000/api
echo.
echo Consultez INSTALLATION.md pour plus de details
echo.
pause
