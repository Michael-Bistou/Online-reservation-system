const { query } = require('../config/database');
const { body, validationResult } = require('express-validator');

/**
 * Récupérer tous les restaurants
 * GET /api/restaurants
 */
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await query(
      `SELECT id, name, description, address, phone, email, cuisine_type, 
              price_range, opening_hours, is_active, created_at, updated_at 
       FROM restaurants 
       WHERE is_active = 1 
       ORDER BY name ASC`
    );

    res.json({
      message: 'Restaurants récupérés avec succès',
      count: restaurants.length,
      restaurants
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des restaurants',
      message: 'Une erreur est survenue lors de la récupération des restaurants'
    });
  }
};

/**
 * Récupérer un restaurant par ID
 * GET /api/restaurants/:id
 */
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const [restaurant] = await query(
      `SELECT id, name, description, address, phone, email, cuisine_type, 
              price_range, opening_hours, is_active, created_at, updated_at 
       FROM restaurants 
       WHERE id = ? AND is_active = 1`,
      [id]
    );

    if (!restaurant) {
      return res.status(404).json({
        error: 'Restaurant non trouvé',
        message: 'Le restaurant avec cet ID n\'existe pas ou n\'est pas actif'
      });
    }

    res.json({
      message: 'Restaurant récupéré avec succès',
      restaurant
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du restaurant:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du restaurant',
      message: 'Une erreur est survenue lors de la récupération du restaurant'
    });
  }
};

/**
 * Créer un nouveau restaurant
 * POST /api/restaurants
 */
const createRestaurant = async (req, res) => {
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
      name,
      description,
      address,
      phone,
      email,
      cuisine_type,
      price_range,
      opening_hours
    } = req.body;

    // Vérifier si un restaurant avec le même nom existe déjà
    const [existingRestaurant] = await query(
      'SELECT id FROM restaurants WHERE name = ?',
      [name]
    );

    if (existingRestaurant) {
      return res.status(409).json({
        error: 'Restaurant déjà existant',
        message: 'Un restaurant avec ce nom existe déjà'
      });
    }

    // Créer le restaurant
    const result = await query(
      `INSERT INTO restaurants (name, description, address, phone, email, 
                               cuisine_type, price_range, opening_hours, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [name, description, address, phone, email, cuisine_type, price_range, opening_hours]
    );

    // Récupérer le restaurant créé
    const [newRestaurant] = await query(
      `SELECT id, name, description, address, phone, email, cuisine_type, 
              price_range, opening_hours, is_active, created_at, updated_at 
       FROM restaurants 
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Restaurant créé avec succès',
      restaurant: newRestaurant
    });

  } catch (error) {
    console.error('Erreur lors de la création du restaurant:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du restaurant',
      message: 'Une erreur est survenue lors de la création du restaurant'
    });
  }
};

/**
 * Mettre à jour un restaurant
 * PUT /api/restaurants/:id
 */
const updateRestaurant = async (req, res) => {
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
    const {
      name,
      description,
      address,
      phone,
      email,
      cuisine_type,
      price_range,
      opening_hours,
      is_active
    } = req.body;

    // Vérifier si le restaurant existe
    const [existingRestaurant] = await query(
      'SELECT id FROM restaurants WHERE id = ?',
      [id]
    );

    if (!existingRestaurant) {
      return res.status(404).json({
        error: 'Restaurant non trouvé',
        message: 'Le restaurant avec cet ID n\'existe pas'
      });
    }

    // Vérifier si le nom est déjà utilisé par un autre restaurant
    if (name) {
      const [nameConflict] = await query(
        'SELECT id FROM restaurants WHERE name = ? AND id != ?',
        [name, id]
      );

      if (nameConflict) {
        return res.status(409).json({
          error: 'Nom déjà utilisé',
          message: 'Un autre restaurant utilise déjà ce nom'
        });
      }
    }

    // Mettre à jour le restaurant
    await query(
      `UPDATE restaurants 
       SET name = COALESCE(?, name), 
           description = COALESCE(?, description), 
           address = COALESCE(?, address), 
           phone = COALESCE(?, phone), 
           email = COALESCE(?, email), 
           cuisine_type = COALESCE(?, cuisine_type), 
           price_range = COALESCE(?, price_range), 
           opening_hours = COALESCE(?, opening_hours), 
           is_active = COALESCE(?, is_active), 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, description, address, phone, email, cuisine_type, price_range, opening_hours, is_active, id]
    );

    // Récupérer le restaurant mis à jour
    const [updatedRestaurant] = await query(
      `SELECT id, name, description, address, phone, email, cuisine_type, 
              price_range, opening_hours, is_active, created_at, updated_at 
       FROM restaurants 
       WHERE id = ?`,
      [id]
    );

    res.json({
      message: 'Restaurant mis à jour avec succès',
      restaurant: updatedRestaurant
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du restaurant:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du restaurant',
      message: 'Une erreur est survenue lors de la mise à jour du restaurant'
    });
  }
};

/**
 * Supprimer un restaurant (désactiver)
 * DELETE /api/restaurants/:id
 */
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le restaurant existe
    const [existingRestaurant] = await query(
      'SELECT id FROM restaurants WHERE id = ?',
      [id]
    );

    if (!existingRestaurant) {
      return res.status(404).json({
        error: 'Restaurant non trouvé',
        message: 'Le restaurant avec cet ID n\'existe pas'
      });
    }

    // Désactiver le restaurant au lieu de le supprimer
    await query(
      'UPDATE restaurants SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Restaurant supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du restaurant:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du restaurant',
      message: 'Une erreur est survenue lors de la suppression du restaurant'
    });
  }
};

/**
 * Rechercher des restaurants
 * GET /api/restaurants/search?q=term&cuisine=type&price=range
 */
const searchRestaurants = async (req, res) => {
  try {
    const { q, cuisine, price } = req.query;

    let sql = `SELECT id, name, description, address, phone, email, cuisine_type, 
                      price_range, opening_hours, is_active, created_at, updated_at 
               FROM restaurants 
               WHERE is_active = 1`;
    let params = [];

    // Ajouter les conditions de recherche
    if (q) {
      sql += ` AND (name LIKE ? OR description LIKE ? OR address LIKE ?)`;
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (cuisine) {
      sql += ` AND cuisine_type = ?`;
      params.push(cuisine);
    }

    if (price) {
      sql += ` AND price_range = ?`;
      params.push(price);
    }

    sql += ` ORDER BY name ASC`;

    const restaurants = await query(sql, params);

    res.json({
      message: 'Recherche terminée',
      count: restaurants.length,
      restaurants
    });

  } catch (error) {
    console.error('Erreur lors de la recherche de restaurants:', error);
    res.status(500).json({
      error: 'Erreur lors de la recherche de restaurants',
      message: 'Une erreur est survenue lors de la recherche'
    });
  }
};

/**
 * Récupérer les types de cuisine disponibles
 * GET /api/restaurants/cuisine-types
 */
const getCuisineTypes = async (req, res) => {
  try {
    const cuisineTypes = await query(
      'SELECT DISTINCT cuisine_type FROM restaurants WHERE is_active = 1 AND cuisine_type IS NOT NULL ORDER BY cuisine_type'
    );

    const types = cuisineTypes.map(row => row.cuisine_type);

    res.json({
      message: 'Types de cuisine récupérés avec succès',
      cuisine_types: types
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des types de cuisine:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des types de cuisine',
      message: 'Une erreur est survenue lors de la récupération des types de cuisine'
    });
  }
};

/**
 * Règles de validation pour la création de restaurant
 */
const createRestaurantValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La description ne peut pas dépasser 1000 caractères'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('L\'adresse doit contenir entre 5 et 200 caractères'),
  body('phone')
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide'),
  body('email')
    .isEmail()
    .withMessage('Adresse email invalide'),
  body('cuisine_type')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le type de cuisine doit contenir entre 2 et 50 caractères'),
  body('price_range')
    .optional()
    .isIn(['€', '€€', '€€€', '€€€€'])
    .withMessage('Gamme de prix invalide'),
  body('opening_hours')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Les horaires d\'ouverture ne peuvent pas dépasser 200 caractères')
];

/**
 * Règles de validation pour la mise à jour de restaurant
 */
const updateRestaurantValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La description ne peut pas dépasser 1000 caractères'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('L\'adresse doit contenir entre 5 et 200 caractères'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Adresse email invalide'),
  body('cuisine_type')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le type de cuisine doit contenir entre 2 et 50 caractères'),
  body('price_range')
    .optional()
    .isIn(['€', '€€', '€€€', '€€€€'])
    .withMessage('Gamme de prix invalide'),
  body('opening_hours')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Les horaires d\'ouverture ne peuvent pas dépasser 200 caractères'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Le statut actif doit être un booléen')
];

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getCuisineTypes,
  createRestaurantValidation,
  updateRestaurantValidation
};
