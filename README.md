# Système de Réservation en Ligne pour Restaurants

Un système complet de réservation en ligne développé avec Node.js/Express pour le backend et Html, CSS et Vue.js pour le frontend.

## 🚀 Fonctionnalités

- **Authentification** : Inscription/Connexion utilisateurs avec JWT
- **Réservations** : Création et gestion des réservations
- **Paiements** : Intégration Stripe pour les paiements
- **Notifications** : Emails automatiques de confirmation
- **Multilingue** : Support i18next pour plusieurs langues
- **Interface moderne** : Design responsive avec Vue.js

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd online-reservation-system
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos configurations
   ```

4. **Configuration de la base de données**
   ```bash
   # Créer la base de données MySQL
   mysql -u root -p
   CREATE DATABASE reservation_system;
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## 📁 Structure du Projet

```
online-reservation-system/
├── src/                    # Backend source code
│   ├── server.js          # Point d'entrée du serveur
│   ├── config/            # Configuration (DB, etc.)
│   ├── routes/            # Routes API
│   ├── controllers/       # Contrôleurs
│   ├── models/            # Modèles de données
│   ├── middleware/        # Middleware personnalisé
│   └── utils/             # Utilitaires
├── frontend/              # Frontend Vue.js
│   ├── src/
│   ├── public/
│   └── package.json
├── tests/                 # Tests unitaires
├── docs/                  # Documentation
└── package.json
```

## 🔧 Scripts Disponibles

- `npm start` : Lancer le serveur en production
- `npm run dev` : Lancer le serveur en mode développement
- `npm test` : Exécuter les tests
- `npm run build` : Build du frontend

## 🌐 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/logout` - Déconnexion

### Réservations
- `GET /api/reservations` - Liste des réservations
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/:id` - Modifier une réservation
- `DELETE /api/reservations/:id` - Supprimer une réservation

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Modifier le profil

## 🔐 Variables d'Environnement

Créer un fichier `.env` avec les variables suivantes :

```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=reservation_system

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

## 🧪 Tests

```bash
npm test
```

## 📝 Licence

MIT

## 👥 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request
