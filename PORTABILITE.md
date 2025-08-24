# 🚀 Guide de Portabilité - Utilisation sur N'importe Quel PC

## 🎯 Vue d'Ensemble

Ce guide vous explique comment utiliser votre projet de réservation de restaurants sur n'importe quel PC (portable, tour, autre machine) sans aucun problème.

## ✅ Votre Projet Est Déjà Très Portable !

### 🎉 Points Forts
- **Base de données SQLite** : Pas besoin d'installer MySQL
- **Node.js** : Fonctionne sur Windows, macOS, Linux
- **Scripts automatisés** : Installation et démarrage en 1 clic
- **Dépendances fixées** : Mêmes versions partout

## 🚀 Installation sur un Nouveau PC

### Étape 1 : Prérequis
```bash
# Vérifier Node.js (version 16+)
node --version

# Vérifier npm
npm --version

# Vérifier Git
git --version
```

### Étape 2 : Installation Automatique
```bash
# Windows
install.bat

# Linux/macOS
chmod +x install.sh
./install.sh
```

### Étape 3 : Démarrage
```bash
# Windows
start-all.bat

# Linux/macOS
./start-all.sh
```

## 🔧 Configuration des Ports (Si Nécessaire)

### Problème : Ports Occupés
Si les ports 5000 ou 8080 sont déjà utilisés :

#### Solution 1 : Variables d'Environnement
```bash
# Windows
set BACKEND_PORT=5001
set FRONTEND_PORT=8081
start-all.bat

# Linux/macOS
BACKEND_PORT=5001 FRONTEND_PORT=8081 ./start-all.sh
```

#### Solution 2 : Fichier .env
Créer un fichier `.env` à la racine :
```env
BACKEND_PORT=5001
FRONTEND_PORT=8081
FRONTEND_URL=http://localhost:8081
```

#### Solution 3 : Script de Ports Alternatifs
```bash
# Windows - Script automatique
echo @echo off > start-alternative.bat
echo set BACKEND_PORT=5001 >> start-alternative.bat
echo set FRONTEND_PORT=8081 >> start-alternative.bat
echo call start-all.bat >> start-alternative.bat

# Linux/macOS - Script automatique
cat > start-alternative.sh << 'EOF'
#!/bin/bash
export BACKEND_PORT=5001
export FRONTEND_PORT=8081
./start-all.sh
EOF
chmod +x start-alternative.sh
```

## 📁 Structure Portable

```
Online-reservation-system/
├── 📄 config.js              # Configuration centralisée
├── 📄 database.sqlite        # Base de données portable
├── 📄 migrate-database.js    # Initialisation automatique
├── 📄 install.bat            # Installation Windows
├── 📄 install.sh             # Installation Linux/macOS
├── 📄 start-all.bat          # Démarrage Windows
├── 📄 start-all.sh           # Démarrage Linux/macOS
├── 📄 stop-all.bat           # Arrêt Windows
├── 📁 frontend/              # Application Vue.js
└── 📁 src/                   # Backend Node.js
```

## 🌐 URLs d'Accès

### URLs Par Défaut
- **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:5000

### URLs avec Ports Alternatifs
- **Frontend** : http://localhost:8081
- **Backend API** : http://localhost:5001

## 🔍 Vérification de la Portabilité

### Test 1 : Vérifier les Ports
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :8080

# Linux/macOS
lsof -i :5000
lsof -i :8080
```

### Test 2 : Vérifier la Base de Données
```bash
# Vérifier que le fichier existe
ls -la database.sqlite

# Vérifier la taille (doit être > 0)
du -h database.sqlite
```

### Test 3 : Tester l'API
```bash
# Test de l'API backend
curl http://localhost:5000/api

# Test du frontend
curl http://localhost:8080
```

## 🐛 Résolution des Problèmes Courants

### Problème 1 : Port Déjà Utilisé
```bash
# Trouver le processus
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/macOS

# Tuer le processus
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Linux/macOS

# Ou utiliser des ports alternatifs
BACKEND_PORT=5001 FRONTEND_PORT=8081 ./start-all.sh
```

### Problème 2 : Base de Données Corrompue
```bash
# Supprimer et recréer
rm database.sqlite
node migrate-database.js
```

### Problème 3 : Dépendances Manquantes
```bash
# Réinstaller les dépendances
cd frontend && npm install
cd ../src && npm install
```

### Problème 4 : Permissions (Linux/macOS)
```bash
# Rendre les scripts exécutables
chmod +x install.sh
chmod +x start-all.sh
chmod +x stop-all.sh
```

## 📋 Checklist de Portabilité

- [ ] **Node.js** installé (v16+)
- [ ] **npm** installé
- [ ] **Git** installé
- [ ] **Ports libres** (5000, 8080)
- [ ] **Scripts exécutables** (Linux/macOS)
- [ ] **Base de données** créée
- [ ] **Dépendances** installées
- [ ] **Frontend** accessible
- [ ] **Backend** accessible
- [ ] **Connexion** fonctionnelle

## 🎯 Utilisation sur Différents PC

### PC Portable
```bash
# Installation rapide
install.bat  # ou ./install.sh
start-all.bat  # ou ./start-all.sh
```

### PC Tour
```bash
# Même procédure
install.bat
start-all.bat
```

### Autre Machine
```bash
# Copier le projet
git clone <repository>
cd Online-reservation-system

# Installation
install.bat  # ou ./install.sh
start-all.bat  # ou ./start-all.sh
```

## 🔄 Synchronisation Entre PC

### Option 1 : Git (Recommandé)
```bash
# Sur le PC source
git add .
git commit -m "Sauvegarde avant transfert"
git push

# Sur le PC de destination
git pull
```

### Option 2 : Copie de Fichiers
```bash
# Copier le dossier complet
cp -r Online-reservation-system/ /chemin/destination/

# Ou créer une archive
tar -czf reservation-system.tar.gz Online-reservation-system/
```

## 📞 Support

Si vous rencontrez des problèmes de portabilité :

1. **Vérifiez les prérequis** : Node.js, npm, Git
2. **Vérifiez les ports** : 5000 et 8080 libres
3. **Recréez la base** : `node migrate-database.js`
4. **Réinstallez** : `install.bat` ou `./install.sh`

---

**✅ Votre projet est conçu pour être 100% portable ! Aucun problème pour l'utiliser sur n'importe quel PC.**
