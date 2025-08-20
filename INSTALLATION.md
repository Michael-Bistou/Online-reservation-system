# Guide d'Installation - Système de Réservation en Ligne

## 🎯 **Objectif**
Ce guide permet de lancer le projet complet (Backend + Frontend) sur n'importe quel ordinateur.

## 📋 **Prérequis**

### **1. Logiciels requis**
- **Node.js** (version 16 ou supérieure)
  - Télécharger : https://nodejs.org/
  - Vérifier : `node --version`
- **MySQL** (version 8.0 ou supérieure)
  - Option A : XAMPP (recommandé) : https://www.apachefriends.org/
  - Option B : MySQL Community Server
- **Git** (pour cloner le projet)
  - Télécharger : https://git-scm.com/

### **2. Vérification des prérequis**
```bash
node --version    # Doit afficher v16.x.x ou supérieur
npm --version     # Doit afficher 8.x.x ou supérieur
mysql --version   # Doit afficher la version MySQL
git --version     # Doit afficher la version Git
```

## 🚀 **Installation étape par étape**

### **Étape 1 : Cloner le projet**
```bash
git clone <URL_DU_REPO>
cd Online-reservation-system
```

### **Étape 2 : Configuration de la base de données**

#### **Avec XAMPP :**
1. Lancer XAMPP Control Panel
2. Démarrer Apache et MySQL
3. Aller sur http://localhost/phpmyadmin
4. Créer une base de données nommée `reservation_system`

#### **Avec MySQL en ligne de commande :**
```bash
mysql -u root -p
CREATE DATABASE reservation_system;
USE reservation_system;
exit;
```

### **Étape 3 : Configuration de l'environnement**
```bash
# Copier le fichier d'environnement
cp env.dev .env

# Éditer le fichier .env avec vos paramètres
# Notamment : DB_PASSWORD, DB_PORT
```

### **Étape 4 : Installation des dépendances Backend**
```bash
# Dans le dossier racine
npm install
```

### **Étape 5 : Installation des dépendances Frontend**
```bash
# Aller dans le dossier frontend
cd frontend
npm install
cd ..
```

### **Étape 6 : Configuration de la base de données**
```bash
# Se connecter à MySQL
mysql -u root -p reservation_system

# Exécuter le schéma (dans MySQL)
source src/config/schema.sql;

# Insérer les données de test
source src/config/seed.sql;

# Quitter MySQL
exit;
```

### **Étape 7 : Lancer l'application**

#### **Terminal 1 - Backend :**
```bash
# Dans le dossier racine
npm run dev
```
Le serveur backend sera accessible sur : http://localhost:3000

#### **Terminal 2 - Frontend :**
```bash
# Dans le dossier frontend
cd frontend
npm run dev
```
Le frontend sera accessible sur : http://localhost:5173

## 🌐 **URLs d'accès**

### **Application Vue.js (Nouveau) :**
- **URL principale** : http://localhost:5173
- **Page d'accueil** : http://localhost:5173/
- **Connexion** : http://localhost:5173/login
- **Inscription** : http://localhost:5173/register

### **Site HTML original (Legacy) :**
- **URL** : http://localhost:3000/legacy/
- **Pages** : Accueil, À propos, Services, Contact

### **API Backend :**
- **URL de base** : http://localhost:3000/api
- **Documentation** : http://localhost:3000/api
- **Test des traductions** : http://localhost:3000/api/translations

## 🔧 **Configuration détaillée**

### **Variables d'environnement (.env)**
```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=reservation_system
DB_PORT=3306  # ou 3307 pour XAMPP

# JWT
JWT_SECRET=dev_jwt_secret_key_for_development_only
JWT_EXPIRES_IN=24h

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### **Ports utilisés**
- **Backend** : 3000
- **Frontend** : 5173
- **MySQL** : 3306 (ou 3307 pour XAMPP)

## 🧪 **Test de l'installation**

### **1. Test du Backend**
```bash
# Vérifier que le serveur démarre
curl http://localhost:3000/api
# Réponse attendue : {"message":"Bienvenue - API Backend",...}
```

### **2. Test du Frontend**
- Ouvrir http://localhost:5173
- Vérifier que la page d'accueil s'affiche
- Tester la navigation

### **3. Test de la base de données**
```bash
# Se connecter à MySQL
mysql -u root -p reservation_system

# Vérifier les tables
SHOW TABLES;
# Doit afficher : users, restaurants, tables, reservations, menu_items, payments

# Vérifier les données
SELECT COUNT(*) FROM users;
# Doit afficher un nombre > 0
```

## 🐛 **Résolution des problèmes courants**

### **Erreur : "Port 3000 déjà utilisé"**
```bash
# Trouver le processus
netstat -ano | findstr :3000
# Tuer le processus
taskkill /PID <PID> /F
```

### **Erreur : "MySQL connection failed"**
1. Vérifier que MySQL est démarré
2. Vérifier le port dans .env (3306 ou 3307)
3. Vérifier le mot de passe root

### **Erreur : "Module not found"**
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### **Erreur : "Vue.js not loading"**
```bash
# Dans le dossier frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📁 **Structure du projet**
```
Online-reservation-system/
├── src/                    # Backend (Node.js/Express)
│   ├── server.js          # Point d'entrée
│   ├── routes/            # Routes API
│   ├── controllers/       # Contrôleurs
│   ├── config/            # Configuration
│   └── locales/           # Traductions
├── frontend/              # Frontend (Vue.js)
│   ├── src/
│   │   ├── components/    # Composants
│   │   ├── views/         # Pages
│   │   └── router/        # Navigation
│   └── package.json
├── index.html             # Site original (legacy)
├── package.json           # Backend dependencies
└── .env                   # Variables d'environnement
```

## 📞 **Support**

En cas de problème :
1. Vérifier que tous les prérequis sont installés
2. Suivre les étapes dans l'ordre
3. Vérifier les logs d'erreur dans les terminaux
4. Consulter la section "Résolution des problèmes"

## ✅ **Vérification finale**

L'installation est réussie si :
- ✅ Backend accessible sur http://localhost:3000
- ✅ Frontend accessible sur http://localhost:5173
- ✅ Base de données connectée
- ✅ API répond correctement
- ✅ Interface Vue.js fonctionnelle
