const { query } = require('../config/database');
const { body, validationResult } = require('express-validator');

/**
 * Récupérer tous les utilisateurs (admin seulement)
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await query(
      'SELECT id, email, first_name, last_name, phone, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      message: 'Utilisateurs récupérés avec succès',
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des utilisateurs',
      message: 'Une erreur est survenue lors de la récupération des utilisateurs'
    });
  }
};

/**
 * Récupérer un utilisateur par ID
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await query(
      'SELECT id, email, first_name, last_name, phone, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        message: 'L\'utilisateur avec cet ID n\'existe pas'
      });
    }

    res.json({
      message: 'Utilisateur récupéré avec succès',
      user
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de l\'utilisateur',
      message: 'Une erreur est survenue lors de la récupération de l\'utilisateur'
    });
  }
};

/**
 * Mettre à jour un utilisateur
 * PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        message: 'Veuillez corriger les erreurs suivantes',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { first_name, last_name, phone } = req.body;

    // Vérifier si l'utilisateur existe
    const [existingUser] = await query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (!existingUser) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        message: 'L\'utilisateur avec cet ID n\'existe pas'
      });
    }

    // Mettre à jour l'utilisateur
    await query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [first_name, last_name, phone, id]
    );

    // Récupérer l'utilisateur mis à jour
    const [updatedUser] = await query(
      'SELECT id, email, first_name, last_name, phone, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour de l\'utilisateur',
      message: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur'
    });
  }
};

/**
 * Supprimer un utilisateur
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const [existingUser] = await query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (!existingUser) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        message: 'L\'utilisateur avec cet ID n\'existe pas'
      });
    }

    // Supprimer l'utilisateur
    await query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression de l\'utilisateur',
      message: 'Une erreur est survenue lors de la suppression de l\'utilisateur'
    });
  }
};

/**
 * Rechercher des utilisateurs
 * GET /api/users/search?q=term
 */
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Terme de recherche requis',
        message: 'Veuillez fournir un terme de recherche'
      });
    }

    const searchTerm = `%${q}%`;
    const users = await query(
      `SELECT id, email, first_name, last_name, phone, created_at, updated_at 
       FROM users 
       WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?
       ORDER BY created_at DESC`,
      [searchTerm, searchTerm, searchTerm]
    );

    res.json({
      message: 'Recherche terminée',
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    res.status(500).json({
      error: 'Erreur lors de la recherche d\'utilisateurs',
      message: 'Une erreur est survenue lors de la recherche'
    });
  }
};

/**
 * Règles de validation pour la mise à jour d'utilisateur
 */
const updateUserValidation = [
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide')
];

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  updateUserValidation
};
