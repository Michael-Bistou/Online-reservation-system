# 🍽️ Système de Réservation de Restaurants en Ligne

## 📋 Description du Projet

Système de réservation de restaurants en ligne développé dans le cadre du TFE (Travail de Fin d'Études). Cette application web permet aux utilisateurs de réserver des tables dans des restaurants, avec un système de paiement intégré et un back-office d'administration.

## ✨ Fonctionnalités Principales

### 👥 Interface Utilisateur
- **Inscription/Connexion** : Système d'authentification sécurisé
- **Recherche de restaurants** : Filtres par cuisine, prix, note
- **Réservation en ligne** : Système de réservation avec paiement
- **Gestion des réservations** : Consultation, modification, annulation
- **Profil utilisateur** : Historique des réservations et paiements
- **Interface multilingue** : Français et Anglais

### 🏪 Interface Restaurant
- **Dashboard restaurant** : Statistiques et gestion des réservations
- **Gestion des tables** : Configuration des disponibilités
- **Historique des emails** : Suivi des communications
- **Statistiques détaillées** : Graphiques et rapports

### 🔧 Interface Administration
- **Dashboard admin** : Vue d'ensemble du système
- **Gestion des utilisateurs** : Création, modification, désactivation
- **Gestion des restaurants** : Ajout, modification, suppression
- **Gestion des réservations** : Consultation et modification
- **Logs d'audit** : Suivi des activités
- **Sauvegarde de base de données** : Export des données

### 💳 Système de Paiement
- **Paiement sécurisé** : Intégration Stripe (simulation)
- **Gestion des acomptes** : Calcul automatique selon le restaurant
- **Historique des transactions** : Suivi des paiements
- **Remboursements** : Gestion des annulations

## 🛠️ Technologies Utilisées

### Frontend
- **Vue.js 3** : Framework JavaScript progressif
- **Vue Router** : Gestion des routes
- **Vue i18n** : Internationalisation
- **Axios** : Client HTTP
- **CSS3/SCSS** : Styling moderne et responsive

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **SQLite3** : Base de données légère
- **JWT** : Authentification sécurisée
- **bcryptjs** : Hachage des mots de passe

### Outils de Développement
- **Vite** : Build tool moderne
- **Git** : Contrôle de version
- **npm** : Gestionnaire de paquets

## 📦 Installation

### Prérequis
- **Node.js** (version 16 ou supérieure)
- **npm** (inclus avec Node.js)
- **Git**

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/Online-reservation-system.git
   cd Online-reservation-system
   ```

2. **Installer les dépendances**
   ```bash
   # Installer les dépendances du frontend
   cd frontend
   npm install
   
   # Installer les dépendances du backend
   cd ../src
   npm install
   ```

3. **Configuration de la base de données**
   ```bash
   # Retourner à la racine du projet
   cd ..
   
   # Initialiser la base de données avec les données de test
   node migrate-database.js
   ```

4. **Lancer l'application**
   ```bash
   # Lancer le serveur backend (port 5000)
   cd src
   npm start
   
   # Dans un nouveau terminal, lancer le frontend (port 8080)
   cd frontend
   npm run dev
   ```

5. **Accéder à l'application**
   - **Frontend** : http://localhost:8080
   - **Backend API** : http://localhost:5000

## 👤 Comptes de Test

### Utilisateur Standard
- **Email** : `user@example.com`
- **Mot de passe** : `user123`

### Restaurant
- **Email** : `restaurant@example.com`
- **Mot de passe** : `restaurant123`

### Administrateur
- **Email** : `admin@gastroreserve.com`
- **Mot de passe** : `admin123`

## 🏗️ Architecture du Projet

```
Online-reservation-system/
├── frontend/                 # Application Vue.js
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── views/           # Pages de l'application
│   │   ├── services/        # Services (auth, payment, etc.)
│   │   ├── router/          # Configuration des routes
│   │   └── locales/         # Fichiers de traduction
│   ├── public/              # Assets statiques
│   └── package.json
├── src/                     # Backend Node.js/Express
│   ├── controllers/         # Contrôleurs API
│   ├── routes/             # Routes API
│   ├── config/             # Configuration
│   ├── middleware/         # Middlewares
│   └── package.json
├── database.sqlite         # Base de données SQLite
├── migrate-database.js     # Script d'initialisation
└── README.md
```

## 🔐 Sécurité

- **Authentification JWT** : Tokens sécurisés
- **Hachage des mots de passe** : bcryptjs
- **Validation des données** : Sanitisation des entrées
- **CORS configuré** : Protection contre les attaques cross-origin
- **Logs d'audit** : Suivi des actions sensibles

## 📊 Base de Données

### Tables principales
- **users** : Utilisateurs et administrateurs
- **restaurants** : Informations des restaurants
- **tables** : Tables disponibles par restaurant
- **reservations** : Réservations des utilisateurs
- **payments** : Historique des transactions
- **audit_logs** : Logs d'activité

### Données de test incluses
- 10 restaurants avec images et informations complètes
- 20 réservations de test
- Utilisateurs de démonstration
- Logs d'audit d'exemple

## 🌐 API REST

### Endpoints principaux
- `GET /api/restaurants` : Liste des restaurants
- `POST /api/auth/login` : Connexion utilisateur
- `POST /api/reservations` : Créer une réservation
- `GET /api/admin/dashboard` : Dashboard administrateur
- `PUT /api/admin/users/:id` : Modifier un utilisateur

## 🎨 Interface Utilisateur

### Design Responsive
- **Mobile-first** : Optimisé pour tous les écrans
- **Design moderne** : Interface intuitive et élégante
- **Animations fluides** : Transitions CSS3
- **Accessibilité** : Respect des standards WCAG

### Fonctionnalités UX
- **Recherche en temps réel** : Filtrage instantané
- **Carrousel interactif** : Navigation fluide
- **Modales contextuelles** : Interactions intuitives
- **Feedback visuel** : Confirmations et erreurs claires

## 🚀 Déploiement

### Environnement de développement
```bash
# Frontend
npm run dev

# Backend
npm start
```

### Environnement de production
```bash
# Build du frontend
npm run build

# Serveur de production
npm run preview
```

## 📝 Contraintes Fonctionnelles Respectées

✅ **Versioning complet** : Git avec historique détaillé  
✅ **Back-office sécurisé** : Interface d'administration protégée  
✅ **Rapport d'audit** : Logs d'activité complets  
✅ **API RESTful** : Endpoints REST standardisés  
✅ **Système de paiement sécurisé** : Intégration Stripe  
✅ **Application multilingue** : Français et Anglais  

## 🐛 Dépannage

### Problèmes courants

**Port déjà utilisé**
```bash
# Changer le port du frontend
cd frontend
npm run dev -- --port 8081
```

**Base de données corrompue**
```bash
# Supprimer et recréer la base
rm database.sqlite
node migrate-database.js
```

**Erreur de dépendances**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

Pour toute question ou problème :
- **Email** : votre-email@example.com
- **GitHub Issues** : [Lien vers les issues]

## 📄 Licence

Ce projet est développé dans le cadre d'un TFE. Tous droits réservés.

---

**Développé avec ❤️ pour le TFE - Système de Réservation de Restaurants**
