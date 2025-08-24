# 📦 Guide d'Installation Détaillé

## 🎯 Vue d'ensemble

Ce guide vous accompagne étape par étape pour installer et configurer le système de réservation de restaurants sur votre machine.

## 📋 Prérequis Système

### Windows
- **Node.js** : Version 16.0.0 ou supérieure
- **Git** : Version 2.30.0 ou supérieure
- **npm** : Inclus avec Node.js

### macOS
- **Node.js** : Version 16.0.0 ou supérieure
- **Git** : Version 2.30.0 ou supérieure
- **npm** : Inclus avec Node.js

### Linux (Ubuntu/Debian)
- **Node.js** : Version 16.0.0 ou supérieure
- **Git** : Version 2.30.0 ou supérieure
- **npm** : Inclus avec Node.js

## 🔧 Vérification des Prérequis

### 1. Vérifier Node.js
```bash
node --version
# Doit afficher v16.0.0 ou supérieur
```

### 2. Vérifier npm
```bash
npm --version
# Doit afficher 8.0.0 ou supérieur
```

### 3. Vérifier Git
```bash
git --version
# Doit afficher 2.30.0 ou supérieur
```

## 📥 Installation du Projet

### Étape 1 : Cloner le Repository

```bash
# Cloner le projet
git clone https://github.com/votre-username/Online-reservation-system.git

# Accéder au dossier du projet
cd Online-reservation-system
```

### Étape 2 : Installation des Dépendances Frontend

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Vérifier l'installation
npm list --depth=0
```

### Étape 3 : Installation des Dépendances Backend

```bash
# Retourner à la racine et aller dans src
cd ../src

# Installer les dépendances
npm install

# Vérifier l'installation
npm list --depth=0
```

### Étape 4 : Configuration de la Base de Données

```bash
# Retourner à la racine du projet
cd ..

# Initialiser la base de données avec les données de test
node migrate-database.js
```

**Résultat attendu :**
```
✅ Connexion à la base de données SQLite établie
✅ Table users créée
✅ Table restaurants créée
✅ Table tables créée
✅ Table reservations créée
✅ Table payments créée
✅ Table audit_logs créée
✅ Utilisateur admin créé
✅ Utilisateurs de test créés
✅ Restaurants de test créés
✅ Tables de test créées
✅ Réservations de test créées
✅ Logs d'audit créés
🎉 Base de données initialisée avec succès !
```

## 🚀 Lancement de l'Application

### Option 1 : Lancement Manuel

#### Terminal 1 - Backend
```bash
# Aller dans le dossier backend
cd src

# Lancer le serveur backend
npm start
```

**Résultat attendu :**
```
🚀 Serveur démarré sur le port 5000
✅ API REST disponible sur http://localhost:5000
✅ Base de données SQLite connectée
```

#### Terminal 2 - Frontend
```bash
# Aller dans le dossier frontend
cd frontend

# Lancer le serveur de développement
npm run dev
```

**Résultat attendu :**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### Option 2 : Script de Lancement Automatique

#### Windows
```bash
# Créer un fichier start-all.bat
echo @echo off > start-all.bat
echo start "Backend" cmd /k "cd src && npm start" >> start-all.bat
echo timeout /t 3 >> start-all.bat
echo start "Frontend" cmd /k "cd frontend && npm run dev" >> start-all.bat

# Lancer le script
start-all.bat
```

#### Linux/macOS
```bash
# Créer un fichier start-all.sh
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Démarrage du système de réservation..."

# Démarrer le backend
echo "📡 Démarrage du backend..."
cd src && npm start &
BACKEND_PID=$!

# Attendre 3 secondes
sleep 3

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Système démarré !"
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter..."

# Attendre l'interruption
wait
EOF

# Rendre le script exécutable
chmod +x start-all.sh

# Lancer le script
./start-all.sh
```

## 🌐 Accès à l'Application

### URLs d'Accès

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:8080 | Interface utilisateur principale |
| **Backend API** | http://localhost:5000 | API REST du système |
| **Documentation API** | http://localhost:5000/api | Endpoints disponibles |

### Comptes de Test

#### 👤 Utilisateur Standard
- **Email** : `user@example.com`
- **Mot de passe** : `user123`
- **Rôle** : Utilisateur standard

#### 🏪 Restaurant
- **Email** : `restaurant@example.com`
- **Mot de passe** : `restaurant123`
- **Rôle** : Gestionnaire de restaurant

#### 🔧 Administrateur
- **Email** : `admin@gastroreserve.com`
- **Mot de passe** : `admin123`
- **Rôle** : Administrateur système

## 🧪 Tests de Fonctionnement

### Test 1 : Vérification du Backend
```bash
# Tester l'API
curl http://localhost:5000/api

# Résultat attendu
{
  "message": "API Backend - Système de réservation en ligne",
  "status": "API uniquement",
  "info": "Cette API sert le frontend Vue.js sur http://localhost:8080"
}
```

### Test 2 : Vérification du Frontend
1. Ouvrir http://localhost:8080
2. Vérifier que la page d'accueil se charge
3. Tester la navigation entre les pages
4. Vérifier que le sélecteur de langue fonctionne

### Test 3 : Test de Connexion
1. Aller sur http://localhost:8080/login
2. Se connecter avec `admin@gastroreserve.com` / `admin123`
3. Vérifier l'accès au dashboard admin

## 🔧 Configuration Avancée

### Variables d'Environnement

Créer un fichier `.env` à la racine du projet :

```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration de la base de données
DB_PATH=./database.sqlite

# Configuration JWT
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRES_IN=24h

# Configuration CORS
CORS_ORIGIN=http://localhost:8080

# Configuration des logs
LOG_LEVEL=info
```

### Configuration de la Base de Données

La base de données SQLite est automatiquement créée. Pour la personnaliser :

```bash
# Sauvegarder la base actuelle
cp database.sqlite database_backup.sqlite

# Modifier le script d'initialisation
# Éditer migrate-database.js pour ajouter vos données

# Recréer la base
rm database.sqlite
node migrate-database.js
```

## 🐛 Résolution des Problèmes

### Problème 1 : Port déjà utilisé

**Symptôme :** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution :**
```bash
# Trouver le processus qui utilise le port
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/macOS

# Tuer le processus
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Linux/macOS
```

### Problème 2 : Erreur de dépendances

**Symptôme :** `Cannot find module 'express'`

**Solution :**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème 3 : Base de données corrompue

**Symptôme :** Erreurs SQLite ou données manquantes

**Solution :**
```bash
# Supprimer et recréer la base
rm database.sqlite
node migrate-database.js
```

### Problème 4 : Frontend ne se charge pas

**Symptôme :** Page blanche ou erreurs JavaScript

**Solution :**
```bash
# Vérifier les dépendances frontend
cd frontend
npm install

# Nettoyer le cache
npm run clean
npm run dev
```

## 📊 Vérification de l'Installation

### Checklist de Vérification

- [ ] Node.js installé (v16+)
- [ ] npm installé
- [ ] Git installé
- [ ] Projet cloné
- [ ] Dépendances frontend installées
- [ ] Dépendances backend installées
- [ ] Base de données initialisée
- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré (port 8080)
- [ ] Page d'accueil accessible
- [ ] Connexion admin fonctionnelle
- [ ] Navigation entre les pages
- [ ] Changement de langue
- [ ] API backend répond

### Commandes de Vérification

```bash
# Vérifier les versions
node --version
npm --version
git --version

# Vérifier les processus
netstat -ano | findstr :5000  # Windows
netstat -ano | findstr :8080  # Windows

# Vérifier la base de données
ls -la database.sqlite

# Tester l'API
curl http://localhost:5000/api
```

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les prérequis** : Node.js, npm, Git
2. **Consultez les logs** : Terminaux backend et frontend
3. **Vérifiez les ports** : 5000 et 8080 disponibles
4. **Recréez la base** : `node migrate-database.js`
5. **Réinstallez les dépendances** : `npm install`

**Contact :** votre-email@example.com

---

**Installation réussie ! 🎉 Votre système de réservation est prêt à être utilisé.**
