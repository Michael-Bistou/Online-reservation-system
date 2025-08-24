#!/bin/bash

echo "========================================"
echo "  Demarrage Portable - Systeme de Reservation"
echo "========================================"
echo

echo "[1/4] Verification des ports..."
echo

# Verifier si le port 5000 est libre
if lsof -i :5000 >/dev/null 2>&1; then
    echo "⚠️  Port 5000 occupe, utilisation du port 5001"
    export BACKEND_PORT=5001
else
    echo "✅ Port 5000 libre"
    export BACKEND_PORT=5000
fi

# Verifier si le port 8080 est libre
if lsof -i :8080 >/dev/null 2>&1; then
    echo "⚠️  Port 8080 occupe, utilisation du port 8081"
    export FRONTEND_PORT=8081
else
    echo "✅ Port 8080 libre"
    export FRONTEND_PORT=8080
fi

echo
echo "[2/4] Configuration des URLs..."
echo "Backend: http://localhost:$BACKEND_PORT"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo

echo "[3/4] Demarrage du backend..."
cd src && PORT=$BACKEND_PORT npm start &
BACKEND_PID=$!

echo "Attente du demarrage du backend..."
sleep 3

echo "[4/4] Demarrage du frontend..."
cd frontend && VITE_PORT=$FRONTEND_PORT npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "  Systeme demarre avec succes ! 🎉"
echo "========================================"
echo
echo "🌐 URLs d'acces :"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend: http://localhost:$BACKEND_PORT"
echo
echo "📋 Comptes de test :"
echo "Admin: admin@gastroreserve.com / admin123"
echo "User: user@example.com / user123"
echo "Restaurant: restaurant@example.com / restaurant123"
echo
echo "Appuyez sur Ctrl+C pour arrêter..."

# Fonction pour nettoyer les processus
cleanup() {
    echo
    echo "Arrêt du système..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre que les processus se terminent
wait
