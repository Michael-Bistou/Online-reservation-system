const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Créer une base de données SQLite temporaire
const dbPath = path.join(__dirname, '../../database.sqlite');

// Créer la connexion à la base de données SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données SQLite:', err);
  } else {
    console.log('✅ Connexion à la base de données SQLite établie');
    initializeDatabase();
  }
});

// Initialiser la base de données avec les tables
function initializeDatabase() {
  // Table users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table users:', err);
    } else {
      console.log('✅ Table users créée');
    }
  });

  // Table restaurants
  db.run(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      address TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      opening_hours TEXT,
      cuisine_type TEXT,
      price_range TEXT,
      rating REAL DEFAULT 0.00,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table restaurants:', err);
    } else {
      console.log('✅ Table restaurants créée');
    }
  });

  // Table tables
  db.run(`
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      table_number TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      is_available INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
      UNIQUE(restaurant_id, table_number)
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table tables:', err);
    } else {
      console.log('✅ Table tables créée');
    }
  });

  // Table reservations
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      restaurant_id INTEGER NOT NULL,
      table_id INTEGER NOT NULL,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      number_of_guests INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      special_requests TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
      FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table reservations:', err);
    } else {
      console.log('✅ Table reservations créée');
    }
  });
}

// Fonction pour exécuter des requêtes
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Fonction pour exécuter des requêtes d'insertion/mise à jour
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ insertId: this.lastID, changes: this.changes });
      }
    });
  });
}

// Fonction pour obtenir une seule ligne
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

module.exports = {
  query,
  run,
  get,
  db
};
