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
      'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Token invalide',
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.is_active) {
      return res.status(401).json({
        error: 'Compte désactivé',
        message: 'Votre compte a été désactivé'
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

    // Vérifier le rôle de l'utilisateur
    if (role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Accès refusé',
        message: 'Vous n\'avez pas les permissions d\'administrateur'
      });
    }

    if (role === 'restaurant' && req.user.role !== 'restaurant') {
      return res.status(403).json({
        error: 'Accès refusé',
        message: 'Vous n\'avez pas les permissions de restaurant'
      });
    }

    next();
  };
};

/**
 * Middleware pour logger les actions d'administration
 */
const logAdminAction = (action, targetType = null, targetId = null) => {
  return async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      try {
        const { query } = require('../config/database');
        await query(`
          INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          req.user.id,
          action,
          targetType,
          targetId,
          JSON.stringify(req.body),
          req.ip,
          req.get('User-Agent')
        ]);
      } catch (error) {
        console.error('Erreur lors du logging admin:', error);
      }
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  logAdminAction
};
