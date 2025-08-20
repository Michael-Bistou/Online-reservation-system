const express = require('express');
const router = express.Router();

// Import des contrôleurs
const {
  register,
  login,
  getProfile,
  updateProfile,
  registerValidation,
  loginValidation,
  updateProfileValidation
} = require('../controllers/authController');

// Import du middleware d'authentification
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post('/register', registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post('/login', loginValidation, login);

/**
 * @route   GET /api/auth/profile
 * @desc    Récupérer le profil de l'utilisateur connecté
 * @access  Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Mettre à jour le profil de l'utilisateur connecté
 * @access  Private
 */
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);

/**
 * @route   GET /api/auth/verify
 * @desc    Vérifier si le token est valide
 * @access  Private
 */
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token valide',
    user: req.user
  });
});

module.exports = router;
