const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

/**
 * Middleware pour vérifier le token JWT
 * Vérifie si l'utilisateur est authentifié
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token d\'accès requis',
        message: 'Veuillez fournir un token d\'authentification'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer les informations de l'utilisateur depuis la base de données
    const [user] = await query(
      'SELECT id, email, first_name, last_name FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Token invalide',
        message: 'Utilisateur non trouvé'
      });
    }

    // Ajouter les informations de l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token invalide',
        message: 'Le token d\'authentification est invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expiré',
        message: 'Le token d\'authentification a expiré'
      });
    }

    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({
      error: 'Erreur d\'authentification',
      message: 'Une erreur est survenue lors de la vérification du token'
    });
  }
};

/**
 * Middleware optionnel pour récupérer l'utilisateur si connecté
 * Ne bloque pas la requête si pas de token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [user] = await query(
        'SELECT id, email, first_name, last_name FROM users WHERE id = ?',
        [decoded.userId]
      );
      
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    next();
  }
};

/**
 * Middleware pour vérifier les rôles (admin, etc.)
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentification requise',
        message: 'Vous devez être connecté pour accéder à cette ressource'
      });
    }

    // Pour l'instant, on vérifie juste si c'est un admin
    // On peut étendre cette logique plus tard
    if (role === 'admin' && req.user.email !== 'admin@restaurant.com') {
      return res.status(403).json({
        error: 'Accès refusé',
        message: 'Vous n\'avez pas les permissions nécessaires'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole
};
