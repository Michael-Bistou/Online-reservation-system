const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const restaurantRoutes = require('./routes/restaurants');

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

// Middleware pour servir les fichiers statiques
app.use(express.static('.'));

// Routes API
app.get('/api', (req, res) => {
  res.json({
    message: 'Système de réservation en ligne - API Backend',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes utilisateurs
app.use('/api/users', userRoutes);

// Routes restaurants
app.use('/api/restaurants', restaurantRoutes);

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
