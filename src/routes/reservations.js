const express = require('express');
const router = express.Router();
const {
  createReservation,
  getUserReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
  getAvailableTables,
  createReservationValidation,
  updateReservationValidation
} = require('../controllers/reservationController');
const { authenticateToken } = require('../middleware/auth');

/**
 * Routes pour les réservations
 * Toutes les routes nécessitent une authentification
 */

// GET /api/reservations - Récupérer toutes les réservations de l'utilisateur
router.get('/', authenticateToken, getUserReservations);

// GET /api/reservations/available-tables/:restaurant_id - Récupérer les tables disponibles
router.get('/available-tables/:restaurant_id', authenticateToken, getAvailableTables);

// GET /api/reservations/:id - Récupérer une réservation par ID
router.get('/:id', authenticateToken, getReservationById);

// POST /api/reservations - Créer une nouvelle réservation
router.post('/', authenticateToken, createReservationValidation, createReservation);

// PUT /api/reservations/:id - Mettre à jour une réservation
router.put('/:id', authenticateToken, updateReservationValidation, updateReservation);

// DELETE /api/reservations/:id - Annuler une réservation
router.delete('/:id', authenticateToken, cancelReservation);

module.exports = router;
