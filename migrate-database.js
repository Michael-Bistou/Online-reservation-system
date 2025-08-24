const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

async function migrateDatabase() {
  const db = new sqlite3.Database('database.sqlite');

  try {
    console.log('🔧 Initialisation de la base de données...\n');

    // 1. Créer les tables
    console.log('1. Création des tables...');

    // Table users
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT,
          role TEXT DEFAULT 'user' CHECK (role IN ('user', 'restaurant', 'admin')),
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Table users créée');
          resolve();
        }
      });
    });

    // Table restaurants
    await new Promise((resolve, reject) => {
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
          rating REAL DEFAULT 0,
          review_count INTEGER DEFAULT 0,
          image TEXT,
          is_featured BOOLEAN DEFAULT 0,
          is_popular BOOLEAN DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Table restaurants créée');
          resolve();
        }
      });
    });

    // Table tables
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS tables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          restaurant_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          capacity INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Table tables créée');
          resolve();
        }
      });
    });

    // Table reservations
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          restaurant_id INTEGER NOT NULL,
          table_id INTEGER NOT NULL,
          reservation_date DATE NOT NULL,
          reservation_time TIME NOT NULL,
          number_of_people INTEGER NOT NULL,
          special_requests TEXT,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
          deposit_amount REAL DEFAULT 0,
          total_amount REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
          FOREIGN KEY (table_id) REFERENCES tables(id)
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Table reservations créée');
          resolve();
        }
      });
    });

    // Table payments
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          reservation_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          payment_method TEXT NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
          transaction_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (reservation_id) REFERENCES reservations(id)
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Table payments créée');
          resolve();
        }
      });
    });

    // Table audit_logs
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          action TEXT NOT NULL,
          table_name TEXT,
          record_id INTEGER,
          old_values TEXT,
          new_values TEXT,
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Table audit_logs créée');
          resolve();
        }
      });
    });

    // 2. Créer les utilisateurs de test
    console.log('\n2. Création des utilisateurs de test...');

    // Admin
    const adminExists = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', ['admin@gastroreserve.com'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO users (email, password, first_name, last_name, role, is_active)
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['admin@gastroreserve.com', hashedPassword, 'Admin', 'GastroReserve', 'admin', 1], (err) => {
          if (err) reject(err);
          else {
            console.log('✅ Utilisateur admin créé');
            resolve();
          }
        });
      });
    } else {
      console.log('✅ Utilisateur admin existe déjà');
    }

    // Utilisateur standard
    const userExists = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', ['user@example.com'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO users (email, password, first_name, last_name, role, is_active)
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['user@example.com', hashedPassword, 'John', 'Doe', 'user', 1], (err) => {
          if (err) reject(err);
          else {
            console.log('✅ Utilisateur standard créé');
            resolve();
          }
        });
      });
    } else {
      console.log('✅ Utilisateur standard existe déjà');
    }

    // Restaurant
    const restaurantExists = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', ['restaurant@example.com'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!restaurantExists) {
      const hashedPassword = await bcrypt.hash('restaurant123', 10);
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO users (email, password, first_name, last_name, role, is_active)
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['restaurant@example.com', hashedPassword, 'Restaurant', 'Manager', 'restaurant', 1], (err) => {
          if (err) reject(err);
          else {
            console.log('✅ Utilisateur restaurant créé');
            resolve();
          }
        });
      });
    } else {
      console.log('✅ Utilisateur restaurant existe déjà');
    }

    // 3. Créer les restaurants de test
    console.log('\n3. Création des restaurants de test...');

    const restaurants = [
      {
        name: "Le Petit Bistrot",
        description: "Un charmant bistrot français au cœur de Paris, proposant une cuisine traditionnelle dans une ambiance chaleureuse.",
        address: "123 Rue de la Paix, 75001 Paris",
        phone: "01 42 86 17 18",
        email: "contact@lepetitbistrot.fr",
        opening_hours: "Lun-Sam: 12h-14h30, 19h-22h30 | Dim: 19h-22h",
        cuisine_type: "Française",
        price_range: "€€",
        rating: 4.8,
        review_count: 156,
        image: "/img/restaurants/french-bistrot.jpg",
        is_featured: 1,
        is_popular: 1
      },
      {
        name: "Sakura Sushi",
        description: "Restaurant japonais spécialisé dans les sushis et sashimis, avec des ingrédients frais et une présentation soignée.",
        address: "456 Avenue des Champs, 75008 Paris",
        phone: "01 45 62 33 44",
        email: "reservations@sakurasushi.fr",
        opening_hours: "Lun-Sam: 11h30-14h, 18h-22h | Dim: 18h-21h",
        cuisine_type: "Japonaise",
        price_range: "€€€",
        rating: 4.9,
        review_count: 203,
        image: "/img/restaurants/japanese-sushi.jpg",
        is_featured: 1,
        is_popular: 1
      },
      {
        name: "Trattoria Bella",
        description: "Une trattoria italienne authentique où vous pourrez déguster des pâtes fraîches et des pizzas traditionnelles.",
        address: "789 Boulevard Saint-Germain, 75006 Paris",
        phone: "01 43 25 67 89",
        email: "info@trattoriabella.fr",
        opening_hours: "Mar-Dim: 12h-15h, 19h-23h | Lun: Fermé",
        cuisine_type: "Italienne",
        price_range: "€€",
        rating: 4.7,
        review_count: 189,
        image: "/img/restaurants/italian-trattoria.jpg",
        is_featured: 1,
        is_popular: 1
      }
    ];

    for (const restaurant of restaurants) {
      const exists = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM restaurants WHERE name = ?', [restaurant.name], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!exists) {
        await new Promise((resolve, reject) => {
          db.run(`
            INSERT INTO restaurants (name, description, address, phone, email, opening_hours, cuisine_type, price_range, rating, review_count, image, is_featured, is_popular)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            restaurant.name, restaurant.description, restaurant.address, restaurant.phone,
            restaurant.email, restaurant.opening_hours, restaurant.cuisine_type, restaurant.price_range,
            restaurant.rating, restaurant.review_count, restaurant.image, restaurant.is_featured, restaurant.is_popular
          ], (err) => {
            if (err) reject(err);
            else {
              console.log(`✅ Restaurant ${restaurant.name} créé`);
              resolve();
            }
          });
        });
      } else {
        console.log(`✅ Restaurant ${restaurant.name} existe déjà`);
      }
    }

    // 4. Créer des tables pour les restaurants
    console.log('\n4. Création des tables pour les restaurants...');

    const restaurantIds = await new Promise((resolve, reject) => {
      db.all('SELECT id FROM restaurants', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    for (const restaurant of restaurantIds) {
      // Créer 3 tables par restaurant
      for (let i = 1; i <= 3; i++) {
        const tableExists = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM tables WHERE restaurant_id = ? AND name = ?', [restaurant.id, `Table ${i}`], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (!tableExists) {
          await new Promise((resolve, reject) => {
            db.run(`
              INSERT INTO tables (restaurant_id, name, capacity)
              VALUES (?, ?, ?)
            `, [restaurant.id, `Table ${i}`, 4 + i], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      }
      console.log(`✅ Tables créées pour le restaurant ${restaurant.id}`);
    }

    // 5. Créer des réservations de test
    console.log('\n5. Création des réservations de test...');

    const users = await new Promise((resolve, reject) => {
      db.all('SELECT id FROM users WHERE role = "user"', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const tables = await new Promise((resolve, reject) => {
      db.all('SELECT id, restaurant_id FROM tables', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Créer 5 réservations de test
    for (let i = 0; i < 5; i++) {
      const user = users[i % users.length];
      const table = tables[i % tables.length];
      
      if (user && table) {
        const reservationExists = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM reservations WHERE user_id = ? AND restaurant_id = ? AND reservation_date = ?', 
            [user.id, table.restaurant_id, '2024-01-15'], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (!reservationExists) {
          await new Promise((resolve, reject) => {
            db.run(`
              INSERT INTO reservations (user_id, restaurant_id, table_id, reservation_date, reservation_time, number_of_people, status, total_amount)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [user.id, table.restaurant_id, table.id, '2024-01-15', '19:30', 4, 'confirmed', 120.00], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      }
    }
    console.log('✅ Réservations de test créées');

    // 6. Créer des logs d'audit de test
    console.log('\n6. Création des logs d\'audit de test...');

    const auditLogs = [
      {
        user_id: 1,
        action: 'user_registered',
        table_name: 'users',
        record_id: 1,
        description: 'Nouvel utilisateur inscrit'
      },
      {
        user_id: 1,
        action: 'reservation_created',
        table_name: 'reservations',
        record_id: 1,
        description: 'Nouvelle réservation créée'
      },
      {
        user_id: 1,
        action: 'payment_processed',
        table_name: 'payments',
        record_id: 1,
        description: 'Paiement traité'
      }
    ];

    for (const log of auditLogs) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
          VALUES (?, ?, ?, ?, ?)
        `, [log.user_id, log.action, log.table_name, log.record_id, JSON.stringify(log)], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    console.log('✅ Logs d\'audit de test créés');

    console.log('\n🎉 Base de données initialisée avec succès !');
    console.log('\n📋 Comptes disponibles:');
    console.log('- Admin: admin@gastroreserve.com / admin123');
    console.log('- Utilisateur: user@example.com / user123');
    console.log('- Restaurant: restaurant@example.com / restaurant123');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    db.close();
  }
}

migrateDatabase();
