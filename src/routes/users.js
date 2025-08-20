const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  updateUserValidation
} = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * Routes pour les utilisateurs
 * Toutes les routes nécessitent une authentification
 */

// GET /api/users - Récupérer tous les utilisateurs (admin seulement)
router.get('/', authenticateToken, requireRole('admin'), getAllUsers);

// GET /api/users/search - Rechercher des utilisateurs (admin seulement)
router.get('/search', authenticateToken, requireRole('admin'), searchUsers);

// GET /api/users/:id - Récupérer un utilisateur par ID
router.get('/:id', authenticateToken, getUserById);

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/:id', authenticateToken, updateUserValidation, updateUser);

// DELETE /api/users/:id - Supprimer un utilisateur (admin seulement)
router.delete('/:id', authenticateToken, requireRole('admin'), deleteUser);

module.exports = router;
