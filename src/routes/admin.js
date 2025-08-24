const express = require('express');
const router = express.Router();

// Import des contrôleurs
const adminController = require('../controllers/adminController');

// Import du middleware d'authentification
const { authenticateToken, requireRole, logAdminAction } = require('../middleware/auth');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Tableau de bord administrateur
 * @access  Admin only
 */
router.get('/dashboard', authenticateToken, requireRole('admin'), adminController.getDashboard);

/**
 * @route   GET /api/admin/users
 * @desc    Liste tous les utilisateurs
 * @access  Admin only
 */
router.get('/users', authenticateToken, requireRole('admin'), logAdminAction('view_users'), adminController.getUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Détails d'un utilisateur
 * @access  Admin only
 */
router.get('/users/:id', authenticateToken, requireRole('admin'), logAdminAction('view_user'), adminController.getUser);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Modifier un utilisateur
 * @access  Admin only
 */
router.put('/users/:id', authenticateToken, requireRole('admin'), logAdminAction('update_user'), adminController.updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Désactiver un utilisateur
 * @access  Admin only
 */
router.delete('/users/:id', authenticateToken, requireRole('admin'), logAdminAction('disable_user'), adminController.disableUser);

/**
 * @route   GET /api/admin/restaurants
 * @desc    Liste tous les restaurants
 * @access  Admin only
 */
router.get('/restaurants', authenticateToken, requireRole('admin'), logAdminAction('view_restaurants'), adminController.getRestaurants);

/**
 * @route   GET /api/admin/restaurants/:id
 * @desc    Détails d'un restaurant
 * @access  Admin only
 */
router.get('/restaurants/:id', authenticateToken, requireRole('admin'), logAdminAction('view_restaurant'), adminController.getRestaurant);

/**
 * @route   PUT /api/admin/restaurants/:id
 * @desc    Modifier un restaurant
 * @access  Admin only
 */
router.put('/restaurants/:id', authenticateToken, requireRole('admin'), logAdminAction('update_restaurant'), adminController.updateRestaurant);

/**
 * @route   DELETE /api/admin/restaurants/:id
 * @desc    Désactiver un restaurant
 * @access  Admin only
 */
router.delete('/restaurants/:id', authenticateToken, requireRole('admin'), logAdminAction('disable_restaurant'), adminController.disableRestaurant);

/**
 * @route   GET /api/admin/reservations
 * @desc    Liste toutes les réservations
 * @access  Admin only
 */
router.get('/reservations', authenticateToken, requireRole('admin'), logAdminAction('view_reservations'), adminController.getReservations);

/**
 * @route   GET /api/admin/reservations/:id
 * @desc    Détails d'une réservation
 * @access  Admin only
 */
router.get('/reservations/:id', authenticateToken, requireRole('admin'), logAdminAction('view_reservation'), adminController.getReservation);

/**
 * @route   PUT /api/admin/reservations/:id
 * @desc    Modifier une réservation
 * @access  Admin only
 */
router.put('/reservations/:id', authenticateToken, requireRole('admin'), logAdminAction('update_reservation'), adminController.updateReservation);

/**
 * @route   GET /api/admin/logs
 * @desc    Logs d'audit d'activité
 * @access  Admin only
 */
router.get('/logs', authenticateToken, requireRole('admin'), logAdminAction('view_logs'), adminController.getLogs);

/**
 * @route   GET /api/admin/stats
 * @desc    Statistiques du système
 * @access  Admin only
 */
router.get('/stats', authenticateToken, requireRole('admin'), logAdminAction('view_stats'), adminController.getStats);

/**
 * @route   POST /api/admin/backup
 * @desc    Créer une sauvegarde de la base de données
 * @access  Admin only
 */
router.post('/backup', authenticateToken, requireRole('admin'), logAdminAction('create_backup'), adminController.createBackup);

module.exports = router;
