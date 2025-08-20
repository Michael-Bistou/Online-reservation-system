const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getCuisineTypes,
  createRestaurantValidation,
  updateRestaurantValidation
} = require('../controllers/restaurantController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * Routes pour les restaurants
 * Certaines routes sont publiques, d'autres nécessitent une authentification
 */

// Routes publiques (pas d'authentification requise)
// GET /api/restaurants - Récupérer tous les restaurants actifs
router.get('/', getAllRestaurants);

// GET /api/restaurants/cuisine-types - Récupérer les types de cuisine
router.get('/cuisine-types', getCuisineTypes);

// GET /api/restaurants/search - Rechercher des restaurants
router.get('/search', searchRestaurants);

// GET /api/restaurants/:id - Récupérer un restaurant par ID
router.get('/:id', getRestaurantById);

// Routes protégées (authentification requise)
// POST /api/restaurants - Créer un nouveau restaurant (admin seulement)
router.post('/', authenticateToken, requireRole('admin'), createRestaurantValidation, createRestaurant);

// PUT /api/restaurants/:id - Mettre à jour un restaurant (admin seulement)
router.put('/:id', authenticateToken, requireRole('admin'), updateRestaurantValidation, updateRestaurant);

// DELETE /api/restaurants/:id - Supprimer un restaurant (admin seulement)
router.delete('/:id', authenticateToken, requireRole('admin'), deleteRestaurant);

module.exports = router;
