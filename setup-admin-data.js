const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const bcrypt = require('bcryptjs')

console.log('🔧 Configuration des données pour le dashboard admin...\n')

// Chemin vers la base de données du serveur
const dbPath = path.join(__dirname, 'src', 'database.sqlite')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion:', err.message)
    return
  }
  console.log('✅ Connexion à la base de données établie')
})

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve({ insertId: this.lastID, changes: this.changes })
    })
  })
}

async function setupAdminData() {
  try {
    console.log('📊 Vérification des données existantes...')
    
    // Vérifier les utilisateurs
    const users = await query('SELECT COUNT(*) as count FROM users')
    console.log(`👥 Utilisateurs: ${users[0].count}`)
    
    // Vérifier les restaurants
    const restaurants = await query('SELECT COUNT(*) as count FROM restaurants')
    console.log(`🍽️ Restaurants: ${restaurants[0].count}`)
    
    // Vérifier les logs admin
    const logs = await query('SELECT COUNT(*) as count FROM admin_logs')
    console.log(`📋 Logs admin: ${logs[0].count}`)
    
    // Si pas assez de données, en générer
    if (users[0].count < 5 || restaurants[0].count < 5 || logs[0].count < 10) {
      console.log('\n🔄 Génération de données de test...')
      await generateTestData()
    } else {
      console.log('\n✅ Données suffisantes déjà présentes !')
    }
    
    // Afficher un résumé final
    console.log('\n📋 RÉSUMÉ FINAL:')
    const finalUsers = await query('SELECT COUNT(*) as count FROM users')
    const finalRestaurants = await query('SELECT COUNT(*) as count FROM restaurants')
    const finalLogs = await query('SELECT COUNT(*) as count FROM admin_logs')
    
    console.log(`👥 Utilisateurs: ${finalUsers[0].count}`)
    console.log(`🍽️ Restaurants: ${finalRestaurants[0].count}`)
    console.log(`📋 Logs admin: ${finalLogs[0].count}`)
    
    console.log('\n🎉 Configuration terminée !')
    console.log('\n💡 Vous pouvez maintenant tester le dashboard admin !')
    console.log('🔑 Compte admin: admin@gastroreserve.com / admin123')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    db.close()
  }
}

async function generateTestData() {
  // Générer des utilisateurs de test
  const testUsers = [
    { email: 'john.doe@example.com', first_name: 'John', last_name: 'Doe', phone: '0123456789' },
    { email: 'jane.smith@example.com', first_name: 'Jane', last_name: 'Smith', phone: '0123456790' },
    { email: 'mike.wilson@example.com', first_name: 'Mike', last_name: 'Wilson', phone: '0123456791' },
    { email: 'sarah.jones@example.com', first_name: 'Sarah', last_name: 'Jones', phone: '0123456792' },
    { email: 'david.brown@example.com', first_name: 'David', last_name: 'Brown', phone: '0123456793' }
  ]
  
  const hashedPassword = await bcrypt.hash('test123', 12)
  
  for (const user of testUsers) {
    try {
      await run(
        'INSERT OR IGNORE INTO users (email, password, first_name, last_name, phone, role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user.email, hashedPassword, user.first_name, user.last_name, user.phone, 'user', 1]
      )
      console.log(`✅ Utilisateur créé: ${user.first_name} ${user.last_name}`)
    } catch (error) {
      console.log(`⚠️ Utilisateur déjà existant: ${user.first_name} ${user.last_name}`)
    }
  }
  
  // Générer des restaurants de test
  const testRestaurants = [
    { name: 'Le Petit Bistrot', cuisine_type: 'Française', address: '123 Rue de la Paix, Paris', phone: '0123456789', email: 'contact@petitbistrot.fr', description: 'Authentique cuisine française' },
    { name: 'Sakura Sushi', cuisine_type: 'Japonaise', address: '456 Avenue des Champs, Paris', phone: '0123456790', email: 'info@sakurasushi.fr', description: 'Sushi frais et authentique' },
    { name: 'Trattoria Bella', cuisine_type: 'Italienne', address: '789 Boulevard Saint-Germain, Paris', phone: '0123456791', email: 'reservation@trattoriabella.fr', description: 'Cuisine italienne traditionnelle' },
    { name: 'Golden Dragon', cuisine_type: 'Chinoise', address: '321 Rue de Rivoli, Paris', phone: '0123456792', email: 'contact@goldendragon.fr', description: 'Spécialités chinoises' },
    { name: 'El Toro Loco', cuisine_type: 'Espagnole', address: '654 Rue du Commerce, Paris', phone: '0123456793', email: 'info@eltoroloco.fr', description: 'Tapas et paella authentiques' }
  ]
  
  for (const restaurant of testRestaurants) {
    try {
      await run(
        'INSERT OR IGNORE INTO restaurants (name, cuisine_type, address, phone, email, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [restaurant.name, restaurant.cuisine_type, restaurant.address, restaurant.phone, restaurant.email, restaurant.description, 1]
      )
      console.log(`✅ Restaurant créé: ${restaurant.name}`)
    } catch (error) {
      console.log(`⚠️ Restaurant déjà existant: ${restaurant.name}`)
    }
  }
  
  // Générer des logs admin de test
  const adminActions = [
    'user_disabled', 'user_enabled', 'restaurant_disabled', 'restaurant_enabled',
    'reservation_updated', 'backup_created', 'stats_viewed', 'user_created',
    'restaurant_created', 'system_backup'
  ]
  
  // Récupérer l'ID de l'admin
  const adminUser = await query('SELECT id FROM users WHERE email = ?', ['admin@gastroreserve.com'])
  const adminId = adminUser[0]?.id || 1
  
  for (let i = 0; i < 15; i++) {
    const action = adminActions[Math.floor(Math.random() * adminActions.length)]
    const targetType = action.includes('user') ? 'user' : action.includes('restaurant') ? 'restaurant' : 'system'
    const targetId = action.includes('user') ? Math.floor(Math.random() * 5) + 1 : 
                    action.includes('restaurant') ? Math.floor(Math.random() * 5) + 1 : null
    
    try {
      await run(
        'INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [adminId, action, targetType, targetId, JSON.stringify({ action, timestamp: new Date().toISOString() }), '127.0.0.1', 'Test User Agent']
      )
      console.log(`✅ Log créé: ${action}`)
    } catch (error) {
      console.log(`⚠️ Erreur création log: ${error.message}`)
    }
  }
}

setupAdminData()
