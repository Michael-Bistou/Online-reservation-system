@echo off
echo ========================================
echo   Demarrage Portable - Systeme de Reservation
echo ========================================
echo.

echo [1/4] Verification des ports...
echo.

REM Verifier si le port 5000 est libre
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 occupe, utilisation du port 5001
    set BACKEND_PORT=5001
) else (
    echo ✅ Port 5000 libre
    set BACKEND_PORT=5000
)

REM Verifier si le port 8080 est libre
netstat -ano | findstr :8080 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 8080 occupe, utilisation du port 8081
    set FRONTEND_PORT=8081
) else (
    echo ✅ Port 8080 libre
    set FRONTEND_PORT=8080
)

echo.
echo [2/4] Configuration des URLs...
echo Backend: http://localhost:%BACKEND_PORT%
echo Frontend: http://localhost:%FRONTEND_PORT%
echo.

echo [3/4] Demarrage du backend...
start "Backend" cmd /k "cd src && set PORT=%BACKEND_PORT% && npm start"

echo Attente du demarrage du backend...
timeout /t 3 >nul

echo [4/4] Demarrage du frontend...
start "Frontend" cmd /k "cd frontend && set VITE_PORT=%FRONTEND_PORT% && npm run dev"

echo.
echo ========================================
echo   Systeme demarre avec succes ! 🎉
echo ========================================
echo.
echo 🌐 URLs d'acces :
echo Frontend: http://localhost:%FRONTEND_PORT%
echo Backend: http://localhost:%BACKEND_PORT%
echo.
echo 📋 Comptes de test :
echo Admin: admin@gastroreserve.com / admin123
echo User: user@example.com / user123
echo Restaurant: restaurant@example.com / restaurant123
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul
