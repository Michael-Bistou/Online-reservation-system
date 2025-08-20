const { query } = require('../config/database');
const { body, validationResult } = require('express-validator');

/**
 * Créer une nouvelle réservation
 * POST /api/reservations
 */
const createReservation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        message: 'Veuillez corriger les erreurs suivantes',
        details: errors.array()
      });
    }

    const {
      restaurant_id,
      table_id,
      reservation_date,
      reservation_time,
      number_of_guests,
      special_requests,
      contact_name,
      contact_phone,
      contact_email
    } = req.body;

    const user_id = req.user.id; // Récupéré du middleware d'authentification

    // Vérifier si le restaurant existe et est actif
    const [restaurant] = await query(
      'SELECT id FROM restaurants WHERE id = ? AND is_active = 1',
      [restaurant_id]
    );

    if (!restaurant) {
      return res.status(404).json({
        error: 'Restaurant non trouvé',
        message: 'Le restaurant spécifié n\'existe pas ou n\'est pas actif'
      });
    }

    // Vérifier si la table existe et est disponible
    const [table] = await query(
      'SELECT id, capacity FROM tables WHERE id = ? AND restaurant_id = ? AND is_active = 1',
      [table_id, restaurant_id]
    );

    if (!table) {
      return res.status(404).json({
        error: 'Table non trouvée',
        message: 'La table spécifiée n\'existe pas ou n\'est pas active'
      });
    }

    // Vérifier si la table peut accueillir le nombre de personnes
    if (table.capacity < number_of_guests) {
      return res.status(400).json({
        error: 'Capacité insuffisante',
        message: `Cette table ne peut accueillir que ${table.capacity} personnes maximum`
      });
    }

    // Vérifier si la table est disponible à cette date/heure
    const [existingReservation] = await query(
      `SELECT id FROM reservations 
       WHERE table_id = ? 
       AND reservation_date = ? 
       AND reservation_time = ? 
       AND status IN ('confirmed', 'pending')`,
      [table_id, reservation_date, reservation_time]
    );

    if (existingReservation) {
      return res.status(409).json({
        error: 'Table non disponible',
        message: 'Cette table n\'est pas disponible à la date et heure demandées'
      });
    }

    // Créer la réservation
    const result = await query(
      `INSERT INTO reservations (
        user_id, restaurant_id, table_id, reservation_date, reservation_time,
        number_of_guests, special_requests, contact_name, contact_phone,
        contact_email, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        user_id, restaurant_id, table_id, reservation_date, reservation_time,
        number_of_guests, special_requests || null, contact_name, contact_phone,
        contact_email
      ]
    );

    // Récupérer la réservation créée
    const [newReservation] = await query(
      `SELECT r.*, rest.name as restaurant_name, t.name as table_name
       FROM reservations r
       JOIN restaurants rest ON r.restaurant_id = rest.id
       JOIN tables t ON r.table_id = t.id
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Réservation créée avec succès',
      reservation: newReservation
    });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de la réservation',
      message: 'Une erreur est survenue lors de la création de la réservation'
    });
  }
};

/**
 * Récupérer toutes les réservations d'un utilisateur
 * GET /api/reservations
 */
const getUserReservations = async (req, res) => {
  try {
    const user_id = req.user.id;

    const reservations = await query(
      `SELECT r.*, rest.name as restaurant_name, t.name as table_name
       FROM reservations r
       JOIN restaurants rest ON r.restaurant_id = rest.id
       JOIN tables t ON r.table_id = t.id
       WHERE r.user_id = ?
       ORDER BY r.reservation_date DESC, r.reservation_time DESC`,
      [user_id]
    );

    res.json({
      message: 'Réservations récupérées avec succès',
      count: reservations.length,
      reservations
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des réservations',
      message: 'Une erreur est survenue lors de la récupération des réservations'
    });
  }
};

/**
 * Récupérer une réservation par ID
 * GET /api/reservations/:id
 */
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [reservation] = await query(
      `SELECT r.*, rest.name as restaurant_name, t.name as table_name
       FROM reservations r
       JOIN restaurants rest ON r.restaurant_id = rest.id
       JOIN tables t ON r.table_id = t.id
       WHERE r.id = ? AND r.user_id = ?`,
      [id, user_id]
    );

    if (!reservation) {
      return res.status(404).json({
        error: 'Réservation non trouvée',
        message: 'La réservation avec cet ID n\'existe pas ou ne vous appartient pas'
      });
    }

    res.json({
      message: 'Réservation récupérée avec succès',
      reservation
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de la réservation',
      message: 'Une erreur est survenue lors de la récupération de la réservation'
    });
  }
};

/**
 * Mettre à jour une réservation
 * PUT /api/reservations/:id
 */
const updateReservation = async (req, res) => {
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
    const user_id = req.user.id;
    const {
      reservation_date,
      reservation_time,
      number_of_guests,
      special_requests,
      contact_name,
      contact_phone,
      contact_email
    } = req.body;

    // Vérifier si la réservation existe et appartient à l'utilisateur
    const [existingReservation] = await query(
      'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (!existingReservation) {
      return res.status(404).json({
        error: 'Réservation non trouvée',
        message: 'La réservation avec cet ID n\'existe pas ou ne vous appartient pas'
      });
    }

    // Vérifier si la réservation peut être modifiée
    if (existingReservation.status === 'cancelled') {
      return res.status(400).json({
        error: 'Réservation annulée',
        message: 'Une réservation annulée ne peut pas être modifiée'
      });
    }

    // Vérifier si la table est disponible à la nouvelle date/heure
    if (reservation_date && reservation_time) {
      const [conflictReservation] = await query(
        `SELECT id FROM reservations 
         WHERE table_id = ? 
         AND reservation_date = ? 
         AND reservation_time = ? 
         AND status IN ('confirmed', 'pending')
         AND id != ?`,
        [existingReservation.table_id, reservation_date, reservation_time, id]
      );

      if (conflictReservation) {
        return res.status(409).json({
          error: 'Table non disponible',
          message: 'Cette table n\'est pas disponible à la date et heure demandées'
        });
      }
    }

    // Mettre à jour la réservation
    await query(
      `UPDATE reservations 
       SET reservation_date = COALESCE(?, reservation_date),
           reservation_time = COALESCE(?, reservation_time),
           number_of_guests = COALESCE(?, number_of_guests),
           special_requests = COALESCE(?, special_requests),
           contact_name = COALESCE(?, contact_name),
           contact_phone = COALESCE(?, contact_phone),
           contact_email = COALESCE(?, contact_email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        reservation_date, reservation_time, number_of_guests, special_requests,
        contact_name, contact_phone, contact_email, id
      ]
    );

    // Récupérer la réservation mise à jour
    const [updatedReservation] = await query(
      `SELECT r.*, rest.name as restaurant_name, t.name as table_name
       FROM reservations r
       JOIN restaurants rest ON r.restaurant_id = rest.id
       JOIN tables t ON r.table_id = t.id
       WHERE r.id = ?`,
      [id]
    );

    res.json({
      message: 'Réservation mise à jour avec succès',
      reservation: updatedReservation
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour de la réservation',
      message: 'Une erreur est survenue lors de la mise à jour de la réservation'
    });
  }
};

/**
 * Annuler une réservation
 * DELETE /api/reservations/:id
 */
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Vérifier si la réservation existe et appartient à l'utilisateur
    const [existingReservation] = await query(
      'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (!existingReservation) {
      return res.status(404).json({
        error: 'Réservation non trouvée',
        message: 'La réservation avec cet ID n\'existe pas ou ne vous appartient pas'
      });
    }

    // Vérifier si la réservation peut être annulée
    if (existingReservation.status === 'cancelled') {
      return res.status(400).json({
        error: 'Réservation déjà annulée',
        message: 'Cette réservation a déjà été annulée'
      });
    }

    // Annuler la réservation
    await query(
      'UPDATE reservations SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Réservation annulée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'annulation de la réservation',
      message: 'Une erreur est survenue lors de l\'annulation de la réservation'
    });
  }
};

/**
 * Récupérer les tables disponibles pour un restaurant
 * GET /api/reservations/available-tables/:restaurant_id
 */
const getAvailableTables = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const { date, time, guests } = req.query;

    if (!date || !time || !guests) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        message: 'Les paramètres date, time et guests sont requis'
      });
    }

    // Récupérer toutes les tables du restaurant
    const tables = await query(
      'SELECT id, name, capacity, description FROM tables WHERE restaurant_id = ? AND is_active = 1',
      [restaurant_id]
    );

    // Filtrer les tables disponibles
    const availableTables = [];
    for (const table of tables) {
      if (table.capacity >= parseInt(guests)) {
        // Vérifier si la table est réservée à cette date/heure
        const [reservation] = await query(
          `SELECT id FROM reservations 
           WHERE table_id = ? 
           AND reservation_date = ? 
           AND reservation_time = ? 
           AND status IN ('confirmed', 'pending')`,
          [table.id, date, time]
        );

        if (!reservation) {
          availableTables.push(table);
        }
      }
    }

    res.json({
      message: 'Tables disponibles récupérées avec succès',
      count: availableTables.length,
      tables: availableTables
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des tables disponibles:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des tables disponibles',
      message: 'Une erreur est survenue lors de la récupération des tables disponibles'
    });
  }
};

/**
 * Règles de validation pour la création de réservation
 */
const createReservationValidation = [
  body('restaurant_id')
    .isInt({ min: 1 })
    .withMessage('ID de restaurant invalide'),
  body('table_id')
    .isInt({ min: 1 })
    .withMessage('ID de table invalide'),
  body('reservation_date')
    .isDate()
    .withMessage('Date de réservation invalide'),
  body('reservation_time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de réservation invalide (format HH:MM)'),
  body('number_of_guests')
    .isInt({ min: 1, max: 20 })
    .withMessage('Le nombre de personnes doit être entre 1 et 20'),
  body('contact_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom de contact doit contenir entre 2 et 100 caractères'),
  body('contact_phone')
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide'),
  body('contact_email')
    .isEmail()
    .withMessage('Adresse email invalide'),
  body('special_requests')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Les demandes spéciales ne peuvent pas dépasser 500 caractères')
];

/**
 * Règles de validation pour la mise à jour de réservation
 */
const updateReservationValidation = [
  body('reservation_date')
    .optional()
    .isDate()
    .withMessage('Date de réservation invalide'),
  body('reservation_time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure de réservation invalide (format HH:MM)'),
  body('number_of_guests')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Le nombre de personnes doit être entre 1 et 20'),
  body('contact_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom de contact doit contenir entre 2 et 100 caractères'),
  body('contact_phone')
    .optional()
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide'),
  body('contact_email')
    .optional()
    .isEmail()
    .withMessage('Adresse email invalide'),
  body('special_requests')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Les demandes spéciales ne peuvent pas dépasser 500 caractères')
];

module.exports = {
  createReservation,
  getUserReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
  getAvailableTables,
  createReservationValidation,
  updateReservationValidation
};
