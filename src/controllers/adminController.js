const { query, run } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Tableau de bord administrateur
 */
const getDashboard = async (req, res) => {
  try {
    // Statistiques générales
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM restaurants WHERE is_active = 1) as total_restaurants,
        (SELECT COUNT(*) FROM reservations) as total_reservations,
        (SELECT COUNT(*) FROM reservations WHERE status = 'confirmed') as confirmed_reservations,
        (SELECT COUNT(*) FROM reservations WHERE status = 'cancelled') as cancelled_reservations
    `);

    // Activité récente
    const recentActivity = await query(`
      SELECT 
        al.action,
        al.target_type,
        al.target_id,
        al.details,
        al.created_at,
        u.first_name,
        u.last_name
      FROM admin_logs al
      JOIN users u ON al.admin_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `);

    // Réservations récentes
    const recentReservations = await query(`
      SELECT 
        r.id,
        r.reservation_date,
        r.reservation_time,
        r.number_of_guests,
        r.status,
        r.created_at,
        u.first_name,
        u.last_name,
        rest.name as restaurant_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN restaurants rest ON r.restaurant_id = rest.id
      ORDER BY r.created_at DESC
      LIMIT 5
    `);

    res.json({
      stats: stats[0],
      recentActivity,
      recentReservations
    });
  } catch (error) {
    console.error('Erreur dashboard admin:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les données du tableau de bord'
    });
  }
};

/**
 * Liste tous les utilisateurs
 */
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      whereClause += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const users = await query(`
      SELECT id, email, first_name, last_name, role, is_active, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const total = await query(`
      SELECT COUNT(*) as count
      FROM users
      ${whereClause}
    `, params);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer la liste des utilisateurs'
    });
  }
};

/**
 * Détails d'un utilisateur
 */
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await query(`
      SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
      FROM users
      WHERE id = ?
    `, [id]);

    if (user.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        message: 'L\'utilisateur demandé n\'existe pas'
      });
    }

    // Réservations de l'utilisateur
    const reservations = await query(`
      SELECT 
        r.id,
        r.reservation_date,
        r.reservation_time,
        r.number_of_guests,
        r.status,
        r.created_at,
        rest.name as restaurant_name
      FROM reservations r
      JOIN restaurants rest ON r.restaurant_id = rest.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [id]);

    res.json({
      user: user[0],
      reservations
    });
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les détails de l\'utilisateur'
    });
  }
};

/**
 * Modifier un utilisateur
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, role, is_active } = req.body;

    // Vérifier que l'utilisateur existe
    const existingUser = await query('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        message: 'L\'utilisateur demandé n\'existe pas'
      });
    }

    // Mettre à jour l'utilisateur
    await run(`
      UPDATE users 
      SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [first_name, last_name, email, phone, role, is_active, id]);

    res.json({
      message: 'Utilisateur mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour l\'utilisateur'
    });
  }
};

/**
 * Désactiver un utilisateur
 */
const disableUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe
    const existingUser = await query('SELECT id, role FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé',
        message: 'L\'utilisateur demandé n\'existe pas'
      });
    }

    // Empêcher la désactivation de l'admin principal
    if (existingUser[0].role === 'admin') {
      return res.status(403).json({
        error: 'Action interdite',
        message: 'Impossible de désactiver un administrateur'
      });
    }

    // Désactiver l'utilisateur
    await run(`
      UPDATE users 
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    res.json({
      message: 'Utilisateur désactivé avec succès'
    });
  } catch (error) {
    console.error('Erreur désactivation utilisateur:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de désactiver l\'utilisateur'
    });
  }
};

/**
 * Liste tous les restaurants
 */
const getRestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 20, cuisine_type, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (cuisine_type) {
      whereClause += ' AND cuisine_type = ?';
      params.push(cuisine_type);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR address LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    const restaurants = await query(`
      SELECT id, name, description, address, phone, email, cuisine_type, price_range, rating, is_active, created_at
      FROM restaurants
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const total = await query(`
      SELECT COUNT(*) as count
      FROM restaurants
      ${whereClause}
    `, params);

    res.json({
      restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération restaurants:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer la liste des restaurants'
    });
  }
};

/**
 * Détails d'un restaurant
 */
const getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await query(`
      SELECT id, name, description, address, phone, email, opening_hours, cuisine_type, price_range, rating, is_active, created_at, updated_at
      FROM restaurants
      WHERE id = ?
    `, [id]);

    if (restaurant.length === 0) {
      return res.status(404).json({
        error: 'Restaurant non trouvé',
        message: 'Le restaurant demandé n\'existe pas'
      });
    }

    // Réservations du restaurant
    const reservations = await query(`
      SELECT 
        r.id,
        r.reservation_date,
        r.reservation_time,
        r.number_of_guests,
        r.status,
        r.created_at,
        u.first_name,
        u.last_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      WHERE r.restaurant_id = ?
      ORDER BY r.created_at DESC
    `, [id]);

    res.json({
      restaurant: restaurant[0],
      reservations
    });
  } catch (error) {
    console.error('Erreur récupération restaurant:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les détails du restaurant'
    });
  }
};

/**
 * Modifier un restaurant
 */
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address, phone, email, opening_hours, cuisine_type, price_range, is_active } = req.body;

    // Vérifier que le restaurant existe
    const existingRestaurant = await query('SELECT id FROM restaurants WHERE id = ?', [id]);
    if (existingRestaurant.length === 0) {
      return res.status(404).json({
        error: 'Restaurant non trouvé',
        message: 'Le restaurant demandé n\'existe pas'
      });
    }

    // Mettre à jour le restaurant
    await run(`
      UPDATE restaurants 
      SET name = ?, description = ?, address = ?, phone = ?, email = ?, opening_hours = ?, cuisine_type = ?, price_range = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, address, phone, email, opening_hours, cuisine_type, price_range, is_active, id]);

    res.json({
      message: 'Restaurant mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur mise à jour restaurant:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour le restaurant'
    });
  }
};

/**
 * Désactiver un restaurant
 */
const disableRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le restaurant existe
    const existingRestaurant = await query('SELECT id FROM restaurants WHERE id = ?', [id]);
    if (existingRestaurant.length === 0) {
      return res.status(404).json({
        error: 'Restaurant non trouvé',
        message: 'Le restaurant demandé n\'existe pas'
      });
    }

    // Désactiver le restaurant
    await run(`
      UPDATE restaurants 
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    res.json({
      message: 'Restaurant désactivé avec succès'
    });
  } catch (error) {
    console.error('Erreur désactivation restaurant:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de désactiver le restaurant'
    });
  }
};

/**
 * Liste toutes les réservations
 */
const getReservations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, restaurant_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (status) {
      whereClause += ' AND r.status = ?';
      params.push(status);
    }

    if (restaurant_id) {
      whereClause += ' AND r.restaurant_id = ?';
      params.push(restaurant_id);
    }

    const reservations = await query(`
      SELECT 
        r.id,
        r.reservation_date,
        r.reservation_time,
        r.number_of_guests,
        r.status,
        r.special_requests,
        r.created_at,
        u.first_name,
        u.last_name,
        u.email,
        rest.name as restaurant_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN restaurants rest ON r.restaurant_id = rest.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const total = await query(`
      SELECT COUNT(*) as count
      FROM reservations r
      ${whereClause}
    `, params);

    res.json({
      reservations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération réservations:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer la liste des réservations'
    });
  }
};

/**
 * Détails d'une réservation
 */
const getReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await query(`
      SELECT 
        r.id,
        r.reservation_date,
        r.reservation_time,
        r.number_of_guests,
        r.status,
        r.special_requests,
        r.created_at,
        r.updated_at,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        rest.name as restaurant_name,
        rest.address as restaurant_address,
        rest.phone as restaurant_phone
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN restaurants rest ON r.restaurant_id = rest.id
      WHERE r.id = ?
    `, [id]);

    if (reservation.length === 0) {
      return res.status(404).json({
        error: 'Réservation non trouvée',
        message: 'La réservation demandée n\'existe pas'
      });
    }

    res.json({
      reservation: reservation[0]
    });
  } catch (error) {
    console.error('Erreur récupération réservation:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les détails de la réservation'
    });
  }
};

/**
 * Modifier une réservation
 */
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, special_requests } = req.body;

    // Vérifier que la réservation existe
    const existingReservation = await query('SELECT id FROM reservations WHERE id = ?', [id]);
    if (existingReservation.length === 0) {
      return res.status(404).json({
        error: 'Réservation non trouvée',
        message: 'La réservation demandée n\'existe pas'
      });
    }

    // Mettre à jour la réservation
    await run(`
      UPDATE reservations 
      SET status = ?, special_requests = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, special_requests, id]);

    res.json({
      message: 'Réservation mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur mise à jour réservation:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour la réservation'
    });
  }
};

/**
 * Logs d'audit d'activité
 */
const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, admin_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (action) {
      whereClause += ' AND al.action = ?';
      params.push(action);
    }

    if (admin_id) {
      whereClause += ' AND al.admin_id = ?';
      params.push(admin_id);
    }

    const logs = await query(`
      SELECT 
        al.id,
        al.action,
        al.target_type,
        al.target_id,
        al.details,
        al.ip_address,
        al.user_agent,
        al.created_at,
        u.first_name,
        u.last_name,
        u.email
      FROM admin_logs al
      JOIN users u ON al.admin_id = u.id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const total = await query(`
      SELECT COUNT(*) as count
      FROM admin_logs al
      ${whereClause}
    `, params);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].count,
        pages: Math.ceil(total[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération logs:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les logs d\'audit'
    });
  }
};

/**
 * Statistiques du système
 */
const getStats = async (req, res) => {
  try {
    // Statistiques générales
    const generalStats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'restaurant') as total_restaurant_owners,
        (SELECT COUNT(*) FROM restaurants WHERE is_active = 1) as active_restaurants,
        (SELECT COUNT(*) FROM reservations) as total_reservations,
        (SELECT COUNT(*) FROM reservations WHERE status = 'confirmed') as confirmed_reservations,
        (SELECT COUNT(*) FROM reservations WHERE status = 'cancelled') as cancelled_reservations,
        (SELECT COUNT(*) FROM admin_logs) as total_admin_actions
    `);

    // Statistiques par mois (derniers 6 mois)
    const monthlyStats = await query(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count
      FROM reservations
      WHERE created_at >= date('now', '-6 months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
    `);

    // Top restaurants par réservations
    const topRestaurants = await query(`
      SELECT 
        rest.name,
        COUNT(r.id) as reservation_count,
        AVG(r.number_of_guests) as avg_guests
      FROM restaurants rest
      LEFT JOIN reservations r ON rest.id = r.restaurant_id
      WHERE rest.is_active = 1
      GROUP BY rest.id
      ORDER BY reservation_count DESC
      LIMIT 10
    `);

    res.json({
      general: generalStats[0],
      monthly: monthlyStats,
      topRestaurants
    });
  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les statistiques'
    });
  }
};

/**
 * Créer une sauvegarde de la base de données
 */
const createBackup = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Créer le dossier de sauvegarde s'il n'existe pas
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Nom du fichier de sauvegarde
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.sqlite`);

    // Copier la base de données
    const { db } = require('../config/database');
    const sourcePath = path.join(__dirname, '../../database.sqlite');
    
    fs.copyFileSync(sourcePath, backupPath);

    res.json({
      message: 'Sauvegarde créée avec succès',
      backupPath: backupPath,
      timestamp: timestamp
    });
  } catch (error) {
    console.error('Erreur création sauvegarde:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de créer la sauvegarde'
    });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getUser,
  updateUser,
  disableUser,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  disableRestaurant,
  getReservations,
  getReservation,
  updateReservation,
  getLogs,
  getStats,
  createBackup
};
