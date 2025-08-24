#!/bin/bash

echo "========================================"
echo "  Installation du Systeme de Reservation"
echo "========================================"
echo

echo "[1/6] Verification des prerequis..."
echo

# Verifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installe"
    echo "Veuillez installer Node.js depuis https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js detecte"

# Verifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installe"
    exit 1
fi
echo "✅ npm detecte"

# Verifier Git
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installe"
    echo "Veuillez installer Git depuis https://git-scm.com/"
    exit 1
fi
echo "✅ Git detecte"

echo
echo "[2/6] Installation des dependances frontend..."
cd frontend
if ! npm install; then
    echo "❌ Erreur lors de l'installation des dependances frontend"
    exit 1
fi
echo "✅ Dependances frontend installees"

echo
echo "[3/6] Installation des dependances backend..."
cd ../src
if ! npm install; then
    echo "❌ Erreur lors de l'installation des dependances backend"
    exit 1
fi
echo "✅ Dependances backend installees"

echo
echo "[4/6] Configuration de la base de donnees..."
cd ..
if [ -f "database.sqlite" ]; then
    echo "⚠️  Base de donnees existante detectee"
    read -p "Voulez-vous la recreeer ? (o/n): " choice
    if [[ $choice == "o" || $choice == "O" ]]; then
        rm database.sqlite
        echo "✅ Ancienne base supprimee"
    fi
fi

if [ ! -f "database.sqlite" ]; then
    if ! node migrate-database.js; then
        echo "❌ Erreur lors de l'initialisation de la base de donnees"
        exit 1
    fi
    echo "✅ Base de donnees initialisee"
fi

echo
echo "[5/6] Creation des scripts de lancement..."

# Creer le script de lancement
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "========================================"
echo "  Demarrage du Systeme de Reservation"
echo "========================================"
echo

echo "[1/2] Demarrage du backend..."
cd src && npm start &
BACKEND_PID=$!

echo "Attente du demarrage du backend..."
sleep 3

echo "[2/2] Demarrage du frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo
echo "✅ Systeme demarre !"
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend: http://localhost:5000"
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
EOF

# Rendre le script executable
chmod +x start-all.sh
echo "✅ Scripts de lancement crees"

echo
echo "[6/6] Installation terminee !"
echo
echo "========================================"
echo "  Installation reussie ! 🎉"
echo "========================================"
echo
echo "📋 Prochaines etapes :"
echo "1. Lancer ./start-all.sh pour demarrer le systeme"
echo "2. Ouvrir http://localhost:8080 dans votre navigateur"
echo "3. Se connecter avec admin@gastroreserve.com / admin123"
echo
echo "📚 Documentation :"
echo "- README.md : Vue d'ensemble du projet"
echo "- INSTALLATION.md : Guide d'installation detaille"
echo
echo "========================================"
