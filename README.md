# 🍽️ Système de Réservation en Ligne pour Restaurants

Un système complet de réservation en ligne développé avec **Node.js/Express** pour le backend et **Vue.js** pour le frontend.

## 🚀 **Installation Rapide**

### **Option 1 : Installation automatique (Recommandée)**
```bash
# Windows
install.bat

# Linux/Mac
chmod +x install.sh
./install.sh
```

### **Option 2 : Installation manuelle**
Suivez le guide complet : [INSTALLATION.md](INSTALLATION.md)

## 🎯 **Fonctionnalités**

### **✅ Backend (Node.js/Express)**
- **Authentification JWT** : Inscription/Connexion sécurisée
- **API RESTful** : Endpoints pour toutes les opérations
- **Base de données MySQL** : Schéma complet avec relations
- **Support multilingue** : i18next pour français/anglais
- **Validation des données** : express-validator
- **Sécurité** : Helmet, CORS, bcrypt

### **✅ Frontend (Vue.js 3)**
- **Interface moderne** : Design responsive et intuitif
- **Navigation fluide** : Vue Router avec protection des routes
- **Gestion d'état** : Composition API réactive
- **Communication API** : Axios pour les appels HTTP
- **Support multilingue** : Interface en français/anglais

### **✅ Base de données (MySQL)**
- **Tables principales** : users, restaurants, tables, reservations
- **Relations** : Clés étrangères et contraintes
- **Données de test** : Utilisateurs et restaurants d'exemple
- **Index optimisés** : Performance des requêtes

## 🌐 **URLs d'accès**

### **Application Vue.js (Nouveau)**
- **URL principale** : http://localhost:5173
- **Page d'accueil** : http://localhost:5173/
- **Connexion** : http://localhost:5173/login
- **Inscription** : http://localhost:5173/register

### **Site HTML original (Legacy)**
- **URL** : http://localhost:3000/legacy/
- **Pages** : Accueil, À propos, Services, Contact

### **API Backend**
- **URL de base** : http://localhost:3000/api
- **Documentation** : http://localhost:3000/api
- **Test des traductions** : http://localhost:3000/api/translations

## 🏗️ **Architecture du projet**

```
Online-reservation-system/
├── src/                    # Backend (Node.js/Express)
│   ├── server.js          # Point d'entrée du serveur
│   ├── config/            # Configuration (DB, i18n)
│   ├── routes/            # Routes API
│   ├── controllers/       # Contrôleurs
│   ├── middleware/        # Middleware (auth, validation)
│   └── locales/           # Traductions (fr/en)
├── frontend/              # Frontend (Vue.js)
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── views/         # Pages de l'application
│   │   └── router/        # Configuration des routes
│   └── package.json
├── index.html             # Site original (legacy)
├── package.json           # Dépendances backend
├── INSTALLATION.md        # Guide d'installation détaillé
└── README.md              # Ce fichier
```

## 🔧 **Technologies utilisées**

### **Backend**
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **MySQL** : Base de données relationnelle
- **JWT** : Authentification sécurisée
- **bcryptjs** : Hachage des mots de passe
- **i18next** : Support multilingue
- **express-validator** : Validation des données

### **Frontend**
- **Vue.js 3** : Framework JavaScript progressif
- **Vue Router** : Navigation entre les pages
- **Axios** : Client HTTP pour les appels API
- **i18next** : Traductions côté client
- **Vite** : Outil de build ultra-rapide

### **Outils de développement**
- **Nodemon** : Redémarrage automatique du serveur
- **Git** : Contrôle de version
- **npm** : Gestionnaire de paquets

## 🚀 **Démarrage rapide**

### **1. Prérequis**
- Node.js (v16+)
- MySQL (v8.0+)
- Git

### **2. Installation**
```bash
# Cloner le projet
git clone <URL_DU_REPO>
cd Online-reservation-system

# Installation automatique
install.bat  # Windows
./install.sh # Linux/Mac
```

### **3. Configuration**
```bash
# Éditer le fichier .env
cp env.dev .env
# Modifier DB_PASSWORD et DB_PORT selon votre configuration
```

### **4. Lancement**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📚 **API Endpoints**

### **Authentification**
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/profile` - Profil utilisateur

### **Restaurants**
- `GET /api/restaurants` - Liste des restaurants
- `GET /api/restaurants/:id` - Détails d'un restaurant
- `GET /api/restaurants/search` - Recherche de restaurants

### **Réservations**
- `GET /api/reservations` - Réservations de l'utilisateur
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/:id` - Modifier une réservation
- `DELETE /api/reservations/:id` - Annuler une réservation

## 🧪 **Tests**

### **Test du backend**
```bash
# Vérifier que l'API répond
curl http://localhost:3000/api
```

### **Test du frontend**
- Ouvrir http://localhost:5173
- Vérifier la navigation
- Tester l'inscription/connexion

### **Test de la base de données**
```bash
mysql -u root -p reservation_system
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

## 🐛 **Résolution des problèmes**

### **Erreurs courantes**
1. **Port déjà utilisé** : `netstat -ano | findstr :3000`
2. **MySQL non connecté** : Vérifier que MySQL est démarré
3. **Module not found** : `npm install` dans le bon dossier

### **Support**
- Consulter [INSTALLATION.md](INSTALLATION.md) pour plus de détails
- Vérifier les logs dans les terminaux
- S'assurer que tous les prérequis sont installés

## 📝 **Licence**

MIT

## 👥 **Auteur**

Développé dans le cadre d'un TFE (Travail de Fin d'Études)

---

## 🎓 **Pour les professeurs**

Ce projet démontre :
- **Architecture moderne** : Séparation frontend/backend
- **Technologies actuelles** : Vue.js 3, Node.js, MySQL
- **Bonnes pratiques** : Validation, sécurité, multilingue
- **Documentation complète** : Installation et utilisation
- **Code maintenable** : Structure modulaire et commentée

**Installation en 5 minutes** avec les scripts automatiques fournis !
