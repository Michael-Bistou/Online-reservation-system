const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import i18next configuration
const { middleware } = require('./config/i18n');

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const restaurantRoutes = require('./routes/restaurants');
const reservationRoutes = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());

// Middleware CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware i18next pour la détection de langue
app.use(middleware);

// Middleware pour servir les fichiers statiques
app.use(express.static('.'));

// Routes API
app.get('/api', (req, res) => {
  res.json({
    message: req.t('common:welcome') + ' - API Backend',
    status: 'OK',
    timestamp: new Date().toISOString(),
    language: req.language || 'fr'
  });
});

// Route de test des traductions
app.get('/api/translations', (req, res) => {
  res.json({
    language: req.language || 'fr',
    translations: {
      welcome: req.t('common:welcome'),
      loading: req.t('common:loading'),
      error: req.t('common:error'),
      success: req.t('common:success'),
      login: req.t('auth:login'),
      register: req.t('auth:register'),
      users: req.t('users:users'),
      restaurants: req.t('restaurants:restaurants'),
      reservations: req.t('reservations:reservations')
    }
  });
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes utilisateurs
app.use('/api/users', userRoutes);

// Routes restaurants
app.use('/api/restaurants', restaurantRoutes);

// Routes réservations
app.use('/api/reservations', reservationRoutes);

// Route de test (redirige vers l'API)
app.get('/test', (req, res) => {
  res.json({
    message: 'Système de réservation en ligne - API Backend',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Route pour le site legacy (HTML original)
app.get('/legacy', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.get('/legacy/about', (req, res) => {
  res.sendFile('about.html', { root: '.' });
});

app.get('/legacy/services', (req, res) => {
  res.sendFile('services.html', { root: '.' });
});

app.get('/legacy/contact', (req, res) => {
  res.sendFile('contact.html', { root: '.' });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  // Si c'est une route API, retourner une erreur JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      error: 'Route API non trouvée',
      message: `La route API ${req.originalUrl} n'existe pas`
    });
  }
  
  // Pour les routes frontend, servir index.html (SPA fallback)
  res.sendFile('index.html', { root: '.' });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

module.exports = app;
