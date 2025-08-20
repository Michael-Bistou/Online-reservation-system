#!/bin/bash

echo "========================================"
echo "Installation du Systeme de Reservation"
echo "========================================"
echo

echo "[1/7] Verification des prerequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "ERREUR: Node.js n'est pas installe"
    echo "Téléchargez Node.js sur https://nodejs.org/"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "ERREUR: npm n'est pas installe"
    exit 1
fi

echo "✅ Node.js et npm sont installes"
echo

echo "[2/7] Installation des dependances backend..."
npm install
if [ $? -ne 0 ]; then
    echo "ERREUR: Echec de l'installation des dependances backend"
    exit 1
fi
echo "✅ Dependances backend installees"
echo

echo "[3/7] Installation des dependances frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERREUR: Echec de l'installation des dependances frontend"
    exit 1
fi
cd ..
echo "✅ Dependances frontend installees"
echo

echo "[4/7] Configuration de l'environnement..."
if [ ! -f .env ]; then
    cp env.dev .env
    echo "✅ Fichier .env cree"
else
    echo "✅ Fichier .env existe deja"
fi
echo

echo "[5/7] Verification de la base de donnees..."
echo "ATTENTION: Assurez-vous que MySQL est demarre"
echo "Si vous utilisez XAMPP, demarrez MySQL dans le Control Panel"
echo
read -p "Appuyez sur Entree pour continuer..."

echo "[6/7] Creation de la base de donnees..."
echo "Veuillez entrer le mot de passe MySQL root (laissez vide si aucun):"
read -s mysql_password

if [ -z "$mysql_password" ]; then
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS reservation_system;"
else
    mysql -u root -p"$mysql_password" -e "CREATE DATABASE IF NOT EXISTS reservation_system;"
fi

if [ $? -ne 0 ]; then
    echo "ERREUR: Impossible de se connecter a MySQL"
    echo "Verifiez que MySQL est demarre et que le mot de passe est correct"
    exit 1
fi
echo "✅ Base de donnees creee"
echo

echo "[7/7] Installation terminee !"
echo
echo "========================================"
echo "PROCHAINES ETAPES:"
echo "========================================"
echo
echo "1. Configurez le fichier .env avec vos parametres MySQL"
echo "2. Lancez le backend: npm run dev"
echo "3. Lancez le frontend: cd frontend && npm run dev"
echo
echo "URLs d'acces:"
echo "- Backend: http://localhost:3000"
echo "- Frontend: http://localhost:5173"
echo "- API: http://localhost:3000/api"
echo
echo "Consultez INSTALLATION.md pour plus de details"
echo
