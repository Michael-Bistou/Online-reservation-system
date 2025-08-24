# 🍽️ Système de Réservation de Restaurants en Ligne

> **TFE - Travail de Fin d'Études**  
> Système de réservation de restaurants en ligne avec back-office d'administration

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-TFE-000000?style=for-the-badge)](LICENSE)

## 📋 Description du Projet

Système de réservation de restaurants en ligne développé dans le cadre du **TFE (Travail de Fin d'Études)**. Cette application web moderne permet aux utilisateurs de réserver des tables dans des restaurants, avec un système de paiement intégré, un back-office d'administration complet et une interface multilingue.

### 🎯 Objectifs du TFE

Ce projet démontre la maîtrise des technologies web modernes et respecte toutes les **contraintes fonctionnelles** imposées :

- ✅ **Versioning complet et valide** (GitHub)
- ✅ **Back-office de gestion sécurisé**
- ✅ **Rapport d'audit d'activité** (logs files)
- ✅ **Production d'une API RESTful**
- ✅ **Intégration d'un système de paiement sécurisé**
- ✅ **Application multilingue** (FR/EN)

## ✨ Fonctionnalités Principales

### 👥 Interface Utilisateur
- **🔐 Authentification sécurisée** : Inscription/Connexion avec JWT
- **🔍 Recherche avancée** : Filtres par cuisine, prix, note, disponibilité
- **📅 Réservation en ligne** : Système de réservation avec paiement intégré
- **📋 Gestion des réservations** : Consultation, modification, annulation
- **👤 Profil utilisateur** : Historique complet des réservations et paiements
- **🌐 Interface multilingue** : Français et Anglais avec switch dynamique
- **📱 Design responsive** : Optimisé pour tous les appareils

### 🏪 Interface Restaurant
- **📊 Dashboard restaurant** : Statistiques en temps réel et gestion des réservations
- **🪑 Gestion des tables** : Configuration des disponibilités et capacités
- **📧 Historique des emails** : Suivi des communications clients
- **📈 Statistiques détaillées** : Graphiques et rapports de performance
- **⚙️ Gestion du profil** : Modification des informations du restaurant

### 🔧 Interface Administration
- **📊 Dashboard admin** : Vue d'ensemble complète du système
- **👥 Gestion des utilisateurs** : Création, modification, désactivation
- **🏪 Gestion des restaurants** : Ajout, modification, suppression
- **📅 Gestion des réservations** : Consultation et modification en temps réel
- **📝 Logs d'audit** : Suivi détaillé des activités et actions
- **💾 Sauvegarde de base de données** : Export et gestion des données

### 💳 Système de Paiement
- **🔒 Paiement sécurisé** : Intégration Stripe (simulation)
- **💰 Gestion des acomptes** : Calcul automatique selon le restaurant
- **📊 Historique des transactions** : Suivi complet des paiements
- **🔄 Remboursements** : Gestion automatisée des annulations

## 🛠️ Technologies Utilisées

### Frontend
- **Vue.js 3** : Framework JavaScript progressif avec Composition API
- **Vue Router** : Gestion des routes et navigation
- **Vue i18n** : Internationalisation complète
- **Axios** : Client HTTP pour les requêtes API
- **CSS3/SCSS** : Styling moderne avec animations fluides

### Backend
- **Node.js** : Runtime JavaScript côté serveur
- **Express.js** : Framework web pour l'API REST
- **SQLite3** : Base de données légère et portable
- **JWT** : Authentification sécurisée avec tokens
- **bcryptjs** : Hachage sécurisé des mots de passe

### Outils de Développement
- **Vite** : Build tool moderne et rapide
- **Git** : Contrôle de version avec historique complet
- **npm** : Gestionnaire de paquets

## 📦 Installation Rapide

### Prérequis
- **Node.js** (version 16 ou supérieure)
- **npm** (inclus avec Node.js)
- **Git**

### Installation Automatique

**Windows :**
```bash
git clone https://github.com/votre-username/Online-reservation-system.git
cd Online-reservation-system
install.bat
```

**Linux/macOS :**
```bash
git clone https://github.com/votre-username/Online-reservation-system.git
cd Online-reservation-system
chmod +x install.sh
./install.sh
```

### Installation Manuelle

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/Online-reservation-system.git
   cd Online-reservation-system
   ```

2. **Installer les dépendances**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../src
   npm install
   ```

3. **Initialiser la base de données**
   ```bash
   cd ..
   node migrate-database.js
   ```

4. **Lancer l'application**
   ```bash
   # Script automatique
   start-all.bat  # Windows
   ./start-all.sh # Linux/macOS
   
   # Ou manuellement
   cd src && npm start & cd ../frontend && npm run dev
   ```

5. **Accéder à l'application**
   - **Frontend** : http://localhost:8080
   - **Backend API** : http://localhost:5000

## 👤 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **👤 Utilisateur Standard** | `user@example.com` | `user123` |
| **🏪 Restaurant** | `restaurant@example.com` | `restaurant123` |
| **🔧 Administrateur** | `admin@gastroreserve.com` | `admin123` |

## 🏗️ Architecture du Projet

```
Online-reservation-system/
├── 📁 frontend/                 # Application Vue.js
│   ├── 📁 src/
│   │   ├── 📁 components/       # Composants réutilisables
│   │   ├── 📁 views/           # Pages de l'application
│   │   ├── 📁 services/        # Services (auth, payment, etc.)
│   │   ├── 📁 router/          # Configuration des routes
│   │   └── 📁 locales/         # Fichiers de traduction (FR/EN)
│   ├── 📁 public/              # Assets statiques (images, etc.)
│   └── 📄 package.json
├── 📁 src/                     # Backend Node.js/Express
│   ├── 📁 controllers/         # Contrôleurs API
│   ├── 📁 routes/             # Routes API RESTful
│   ├── 📁 config/             # Configuration
│   ├── 📁 middleware/         # Middlewares (auth, validation)
│   └── 📄 package.json
├── 📄 database.sqlite         # Base de données SQLite
├── 📄 migrate-database.js     # Script d'initialisation
├── 📄 install.bat             # Script d'installation Windows
├── 📄 install.sh              # Script d'installation Linux/macOS
└── 📄 README.md
```

## 🔐 Sécurité

- **🔑 Authentification JWT** : Tokens sécurisés avec expiration
- **🔒 Hachage des mots de passe** : bcryptjs avec salt
- **🛡️ Validation des données** : Sanitisation complète des entrées
- **🌐 CORS configuré** : Protection contre les attaques cross-origin
- **📝 Logs d'audit** : Suivi détaillé des actions sensibles
- **🔍 Middleware de sécurité** : Helmet.js pour les headers HTTP

## 📊 Base de Données

### Tables principales
- **users** : Utilisateurs, restaurants et administrateurs
- **restaurants** : Informations complètes des restaurants
- **tables** : Tables disponibles par restaurant
- **reservations** : Réservations des utilisateurs
- **payments** : Historique des transactions
- **audit_logs** : Logs d'activité et audit

### Données de test incluses
- **10 restaurants** avec images et informations complètes
- **20 réservations** de test avec différents statuts
- **Utilisateurs de démonstration** (admin, user, restaurant)
- **Logs d'audit** d'exemple pour la démonstration

## 🌐 API REST

### Endpoints principaux
```
GET    /api/restaurants          # Liste des restaurants
POST   /api/auth/login           # Connexion utilisateur
POST   /api/auth/register        # Inscription utilisateur
GET    /api/reservations         # Réservations de l'utilisateur
POST   /api/reservations         # Créer une réservation
GET    /api/admin/dashboard      # Dashboard administrateur
PUT    /api/admin/users/:id      # Modifier un utilisateur
GET    /api/admin/logs           # Logs d'audit
```

## 🎨 Interface Utilisateur

### Design Responsive
- **📱 Mobile-first** : Optimisé pour tous les écrans
- **🎨 Design moderne** : Interface intuitive et élégante
- **✨ Animations fluides** : Transitions CSS3 et micro-interactions
- **♿ Accessibilité** : Respect des standards WCAG

### Fonctionnalités UX
- **🔍 Recherche en temps réel** : Filtrage instantané des restaurants
- **🎠 Carrousel interactif** : Navigation fluide entre les restaurants
- **💬 Modales contextuelles** : Interactions intuitives
- **✅ Feedback visuel** : Confirmations et erreurs claires
- **🌐 Switch de langue** : Changement dynamique FR/EN

## 🚀 Déploiement

### Environnement de développement
```bash
# Frontend (port 8080)
npm run dev

# Backend (port 5000)
npm start
```

### Environnement de production
```bash
# Build du frontend
npm run build

# Serveur de production
npm run preview
```

## 📝 Contraintes Fonctionnelles TFE

| Contrainte | Statut | Description |
|------------|--------|-------------|
| ✅ **Versioning complet** | **RESPECTÉ** | Git avec historique détaillé et commits réguliers |
| ✅ **Back-office sécurisé** | **RESPECTÉ** | Interface d'administration protégée avec authentification |
| ✅ **Rapport d'audit** | **RESPECTÉ** | Logs d'activité complets avec horodatage |
| ✅ **API RESTful** | **RESPECTÉ** | Endpoints REST standardisés avec documentation |
| ✅ **Système de paiement** | **RESPECTÉ** | Intégration Stripe avec gestion des transactions |
| ✅ **Application multilingue** | **RESPECTÉ** | Interface complète en Français et Anglais |

## 🐛 Dépannage

### Problèmes courants

**🚫 Port déjà utilisé**
```bash
# Changer le port du frontend
cd frontend
npm run dev -- --port 8081
```

**💾 Base de données corrompue**
```bash
# Supprimer et recréer la base
rm database.sqlite
node migrate-database.js
```

**📦 Erreur de dépendances**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

**🔍 Vérification de l'installation**
```bash
# Script de vérification automatique
node verify-installation.js
```

## 📚 Documentation

- **[📖 Guide d'utilisation](GUIDE_UTILISATION.md)** : Guide complet pour les utilisateurs
- **[🔧 Documentation technique](DOCUMENTATION_TECHNIQUE.md)** : Architecture et API
- **[⚙️ Guide d'installation](INSTALLATION.md)** : Installation détaillée

## 📞 Support

Pour toute question ou problème :
- **📧 Email** : votre-email@example.com
- **🐛 GitHub Issues** : [Lien vers les issues]
- **📖 Documentation** : Consultez les guides fournis

## 📄 Licence

Ce projet est développé dans le cadre d'un **TFE (Travail de Fin d'Études)**.  
Tous droits réservés.

---

**🍽️ Développé avec ❤️ pour le TFE - Système de Réservation de Restaurants**

*Un projet complet démontrant la maîtrise des technologies web modernes et le respect des contraintes fonctionnelles imposées.*
