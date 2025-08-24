# 🔧 Documentation Technique - Système de Réservation de Restaurants

## 🏗️ Architecture du Système

### Vue d'Ensemble
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   (Vue.js 3)    │◄──►│   (Node.js)     │◄──►│   Données       │
│   Port: 8080    │    │   Port: 5000    │    │   (SQLite)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technologies Utilisées

#### Frontend
- **Vue.js 3** : Framework JavaScript progressif
- **Vue Router** : Gestion des routes et navigation
- **Vue i18n** : Internationalisation (FR/EN)
- **Axios** : Client HTTP pour les appels API
- **Vite** : Build tool moderne et rapide
- **CSS3/SCSS** : Styling avec variables et mixins

#### Backend
- **Node.js** : Runtime JavaScript côté serveur
- **Express.js** : Framework web minimaliste
- **SQLite3** : Base de données légère et portable
- **JWT** : Authentification par tokens
- **bcryptjs** : Hachage sécurisé des mots de passe
- **CORS** : Gestion des requêtes cross-origin

## 📁 Structure du Projet

```
Online-reservation-system/
├── frontend/                    # Application Vue.js
│   ├── src/
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── Header.vue     # Header avec navigation
│   │   │   ├── Footer.vue     # Footer
│   │   │   └── ...
│   │   ├── views/             # Pages de l'application
│   │   │   ├── Home.vue       # Page d'accueil
│   │   │   ├── Login.vue      # Connexion
│   │   │   ├── Register.vue   # Inscription
│   │   │   ├── Profile.vue    # Profil utilisateur
│   │   │   ├── Restaurants.vue # Liste des restaurants
│   │   │   ├── RestaurantDetails.vue # Détails restaurant
│   │   │   ├── Reservations.vue # Gestion réservations
│   │   │   ├── PaymentHistory.vue # Historique paiements
│   │   │   ├── AdminDashboard.vue # Dashboard admin
│   │   │   └── ...
│   │   ├── services/          # Services métier
│   │   │   ├── authService.js # Service d'authentification
│   │   │   ├── apiService.js  # Service API
│   │   │   ├── paymentService.js # Service de paiement
│   │   │   └── notificationService.js # Service notifications
│   │   ├── router/            # Configuration des routes
│   │   │   └── index.js       # Routes principales
│   │   ├── locales/           # Fichiers de traduction
│   │   │   ├── fr.json        # Traductions françaises
│   │   │   └── en.json        # Traductions anglaises
│   │   ├── assets/            # Assets statiques
│   │   ├── App.vue            # Composant racine
│   │   └── main.js            # Point d'entrée
│   ├── public/                # Assets publics
│   │   ├── img/               # Images
│   │   │   └── restaurants/   # Images des restaurants
│   │   └── index.html         # Template HTML
│   ├── package.json           # Dépendances frontend
│   └── vite.config.js         # Configuration Vite
├── src/                       # Backend Node.js/Express
│   ├── controllers/           # Contrôleurs API
│   │   ├── authController.js  # Authentification
│   │   ├── restaurantController.js # Gestion restaurants
│   │   ├── reservationController.js # Gestion réservations
│   │   ├── paymentController.js # Gestion paiements
│   │   ├── adminController.js # Administration
│   │   └── ...
│   ├── routes/                # Routes API
│   │   ├── auth.js            # Routes d'authentification
│   │   ├── restaurants.js     # Routes restaurants
│   │   ├── reservations.js    # Routes réservations
│   │   ├── payments.js        # Routes paiements
│   │   ├── admin.js           # Routes administration
│   │   └── ...
│   ├── config/                # Configuration
│   │   ├── database.js        # Configuration base de données
│   │   └── ...
│   ├── middleware/            # Middlewares
│   │   ├── auth.js            # Middleware d'authentification
│   │   ├── validation.js      # Validation des données
│   │   └── ...
│   ├── server.js              # Point d'entrée du serveur
│   └── package.json           # Dépendances backend
├── database.sqlite            # Base de données SQLite
├── migrate-database.js        # Script d'initialisation
├── install.bat                # Script d'installation Windows
├── install.sh                 # Script d'installation Linux/macOS
├── README.md                  # Documentation principale
├── INSTALLATION.md            # Guide d'installation
├── GUIDE_UTILISATION.md       # Guide d'utilisation
└── DOCUMENTATION_TECHNIQUE.md # Cette documentation
```

## 🗄️ Base de Données

### Schéma de la Base de Données

#### Table `users`
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'restaurant', 'admin')),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `restaurants`
```sql
CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    opening_hours TEXT,
    cuisine_type TEXT,
    price_range TEXT,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    image TEXT,
    is_featured BOOLEAN DEFAULT 0,
    is_popular BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `tables`
```sql
CREATE TABLE tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

#### Table `reservations`
```sql
CREATE TABLE reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    table_id INTEGER NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_people INTEGER NOT NULL,
    special_requests TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    deposit_amount REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (table_id) REFERENCES tables(id)
);
```

#### Table `payments`
```sql
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);
```

#### Table `audit_logs`
```sql
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id INTEGER,
    old_values TEXT,
    new_values TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Relations entre les Tables

```
users (1) ──── (N) reservations (N) ──── (1) restaurants
                    │
                    └─── (1) payments
                    │
                    └─── (1) tables
```

## 🌐 API REST

### Authentification

#### POST `/api/auth/register`
**Inscription d'un nouvel utilisateur**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+33123456789"
}
```

#### POST `/api/auth/login`
**Connexion utilisateur**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
**Récupération du profil utilisateur**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user",
  "is_active": true
}
```

### Restaurants

#### GET `/api/restaurants`
**Liste des restaurants**
```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "Le Petit Bistrot",
      "description": "Un charmant bistrot français...",
      "address": "123 Rue de la Paix, 75001 Paris",
      "rating": 4.8,
      "price_range": "€€",
      "cuisine_type": "Française",
      "image": "/img/restaurants/french-bistrot.jpg"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

#### GET `/api/restaurants/:id`
**Détails d'un restaurant**
```json
{
  "id": 1,
  "name": "Le Petit Bistrot",
  "description": "Un charmant bistrot français...",
  "address": "123 Rue de la Paix, 75001 Paris",
  "phone": "01 42 86 17 18",
  "email": "contact@lepetitbistrot.fr",
  "opening_hours": "Lun-Sam: 12h-14h30, 19h-22h30",
  "cuisine_type": "Française",
  "price_range": "€€",
  "rating": 4.8,
  "review_count": 156,
  "amenities": ["WiFi", "Terrasse", "Parking"],
  "tables": [
    {
      "id": 1,
      "name": "Table 1",
      "capacity": 4
    }
  ]
}
```

### Réservations

#### POST `/api/reservations`
**Créer une réservation**
```json
{
  "restaurant_id": 1,
  "table_id": 1,
  "reservation_date": "2024-01-15",
  "reservation_time": "19:30",
  "number_of_people": 4,
  "special_requests": "Table près de la fenêtre"
}
```

#### GET `/api/reservations`
**Liste des réservations de l'utilisateur**
```json
{
  "reservations": [
    {
      "id": 1,
      "restaurant_name": "Le Petit Bistrot",
      "reservation_date": "2024-01-15",
      "reservation_time": "19:30",
      "number_of_people": 4,
      "status": "confirmed",
      "total_amount": 120.00
    }
  ]
}
```

#### PUT `/api/reservations/:id`
**Modifier une réservation**
```json
{
  "reservation_date": "2024-01-16",
  "reservation_time": "20:00",
  "number_of_people": 6
}
```

### Administration

#### GET `/api/admin/dashboard`
**Dashboard administrateur**
```json
{
  "stats": {
    "total_users": 150,
    "total_restaurants": 25,
    "total_reservations": 1200,
    "recent_activity": [
      {
        "id": 1,
        "action": "user_registered",
        "description": "Nouvel utilisateur inscrit",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### GET `/api/admin/users`
**Liste des utilisateurs**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10
}
```

## 🔐 Sécurité

### Authentification JWT

#### Structure du Token
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": 1,
    "email": "user@example.com",
    "role": "user",
    "iat": 1642234567,
    "exp": 1642320967
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
}
```

#### Middleware d'Authentification
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};
```

### Hachage des Mots de Passe

#### Utilisation de bcrypt
```javascript
const bcrypt = require('bcryptjs');

// Hachage du mot de passe
const hashedPassword = await bcrypt.hash(password, 12);

// Vérification du mot de passe
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Validation des Données

#### Middleware de Validation
```javascript
const { body, validationResult } = require('express-validator');

const validateReservation = [
  body('restaurant_id').isInt().withMessage('ID restaurant invalide'),
  body('reservation_date').isDate().withMessage('Date invalide'),
  body('reservation_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Heure invalide'),
  body('number_of_people').isInt({ min: 1, max: 20 }).withMessage('Nombre de personnes invalide'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

## 🌍 Internationalisation

### Structure des Fichiers de Traduction

#### `frontend/src/locales/fr.json`
```json
{
  "common": {
    "welcome": "Bienvenue",
    "login": "Connexion",
    "register": "Inscription",
    "logout": "Déconnexion"
  },
  "home": {
    "title": "Système de Réservation de Restaurants",
    "subtitle": "Réservez votre table en quelques clics",
    "features": {
      "title": "Fonctionnalités",
      "easy_booking": "Réservation facile",
      "secure_payment": "Paiement sécurisé",
      "instant_confirmation": "Confirmation instantanée"
    }
  }
}
```

#### `frontend/src/locales/en.json`
```json
{
  "common": {
    "welcome": "Welcome",
    "login": "Login",
    "register": "Register",
    "logout": "Logout"
  },
  "home": {
    "title": "Restaurant Reservation System",
    "subtitle": "Book your table in a few clicks",
    "features": {
      "title": "Features",
      "easy_booking": "Easy booking",
      "secure_payment": "Secure payment",
      "instant_confirmation": "Instant confirmation"
    }
  }
}
```

### Configuration Vue i18n
```javascript
import { createI18n } from 'vue-i18n';
import fr from './locales/fr.json';
import en from './locales/en.json';

const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr,
    en
  }
});
```

## 💳 Système de Paiement

### Intégration Stripe (Simulation)

#### Configuration
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency = 'eur') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency: currency,
      metadata: {
        reservation_id: reservationId
      }
    });
    return paymentIntent;
  } catch (error) {
    throw new Error('Erreur lors de la création du paiement');
  }
};
```

#### Processus de Paiement
1. **Création de l'intention de paiement**
2. **Validation côté client**
3. **Confirmation côté serveur**
4. **Mise à jour de la réservation**

## 📊 Logs et Audit

### Structure des Logs d'Audit

#### Types d'Actions
- `user_registered` : Inscription d'un utilisateur
- `user_logged_in` : Connexion d'un utilisateur
- `reservation_created` : Création d'une réservation
- `reservation_modified` : Modification d'une réservation
- `reservation_cancelled` : Annulation d'une réservation
- `payment_processed` : Traitement d'un paiement
- `admin_action` : Action administrative

#### Middleware de Logging
```javascript
const logAction = (action, tableName = null, recordId = null, oldValues = null, newValues = null) => {
  const log = {
    user_id: req.user ? req.user.id : null,
    action: action,
    table_name: tableName,
    record_id: recordId,
    old_values: oldValues ? JSON.stringify(oldValues) : null,
    new_values: newValues ? JSON.stringify(newValues) : null,
    ip_address: req.ip,
    user_agent: req.get('User-Agent')
  };

  db.run(`
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [log.user_id, log.action, log.table_name, log.record_id, log.old_values, log.new_values, log.ip_address, log.user_agent]);
};
```

## 🚀 Déploiement

### Variables d'Environnement

#### `.env`
```env
# Serveur
PORT=5000
NODE_ENV=production

# Base de données
DB_PATH=./database.sqlite

# JWT
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://votre-domaine.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Logs
LOG_LEVEL=info
```

### Scripts de Build

#### Frontend (Vite)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### Backend
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 🧪 Tests

### Tests Unitaires

#### Frontend (Jest + Vue Test Utils)
```javascript
import { mount } from '@vue/test-utils';
import Login from '@/views/Login.vue';

describe('Login.vue', () => {
  it('affiche le formulaire de connexion', () => {
    const wrapper = mount(Login);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });
});
```

#### Backend (Jest)
```javascript
const request = require('supertest');
const app = require('../server');

describe('API Auth', () => {
  it('devrait permettre l\'inscription d\'un utilisateur', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
```

## 📈 Performance

### Optimisations Frontend

#### Lazy Loading
```javascript
const routes = [
  {
    path: '/admin',
    component: () => import('@/views/AdminDashboard.vue')
  }
];
```

#### Code Splitting
```javascript
// Vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          admin: ['@/views/AdminDashboard.vue']
        }
      }
    }
  }
};
```

### Optimisations Backend

#### Cache Redis (Optionnel)
```javascript
const redis = require('redis');
const client = redis.createClient();

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    next();
  };
};
```

## 🔧 Maintenance

### Sauvegarde de Base de Données

#### Script de Sauvegarde
```javascript
const fs = require('fs');
const path = require('path');

const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(__dirname, `../backups/database-${timestamp}.sqlite`);
  
  fs.copyFileSync('./database.sqlite', backupPath);
  console.log(`Sauvegarde créée: ${backupPath}`);
};
```

### Nettoyage des Logs

#### Script de Nettoyage
```javascript
const cleanupLogs = (daysToKeep = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  db.run(`
    DELETE FROM audit_logs 
    WHERE created_at < ?
  `, [cutoffDate.toISOString()]);
  
  console.log(`Logs supprimés antérieurs à ${cutoffDate.toISOString()}`);
};
```

---

**Cette documentation technique couvre tous les aspects du système. Pour plus d'informations, consultez les commentaires dans le code source.**
