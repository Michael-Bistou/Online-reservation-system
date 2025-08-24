// Configuration centralisée pour la portabilité du projet
const config = {
  // Configuration des ports (peut être modifiée selon les besoins)
  ports: {
    backend: process.env.BACKEND_PORT || 5000,
    frontend: process.env.FRONTEND_PORT || 8080
  },

  // URLs de base
  urls: {
    backend: process.env.BACKEND_URL || `http://localhost:${process.env.BACKEND_PORT || 5000}`,
    frontend: process.env.FRONTEND_URL || `http://localhost:${process.env.FRONTEND_PORT || 8080}`,
    api: process.env.API_URL || `http://localhost:${process.env.BACKEND_PORT || 5000}/api`
  },

  // Configuration de la base de données
  database: {
    path: process.env.DB_PATH || './database.sqlite',
    type: 'sqlite'
  },

  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_key_for_development_only',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configuration de l'environnement
  environment: {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production'
  },

  // Configuration CORS
  cors: {
    origin: process.env.FRONTEND_URL || `http://localhost:${process.env.FRONTEND_PORT || 8080}`,
    credentials: true
  },

  // Configuration des logs
  logs: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

module.exports = config;
