const { query, run } = require('./src/config/database.js');
const bcrypt = require('bcryptjs');

async function migrateDatabase() {
  try {
    console.log('🔧 Migration de la base de données...\n');

    // 1. Vérifier la structure actuelle
    console.log('1. Vérification de la structure...');
    const tableInfo = await query("PRAGMA table_info(users)");
    const columns = tableInfo.map(col => col.name);
    console.log('Colonnes actuelles:', columns);

    // 2. Ajouter la colonne 'role' si elle n'existe pas
    if (!columns.includes('role')) {
      console.log('\n2. Ajout de la colonne "role"...');
      await run('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"');
      console.log('✅ Colonne "role" ajoutée');
    } else {
      console.log('\n2. Colonne "role" existe déjà');
    }

    // 3. Ajouter la colonne 'is_active' si elle n'existe pas
    if (!columns.includes('is_active')) {
      console.log('\n3. Ajout de la colonne "is_active"...');
      await run('ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1');
      console.log('✅ Colonne "is_active" ajoutée');
    } else {
      console.log('\n3. Colonne "is_active" existe déjà');
    }

    // 4. Mettre à jour les utilisateurs existants
    console.log('\n4. Mise à jour des utilisateurs existants...');
    const users = await query('SELECT * FROM users');
    console.log(`Utilisateurs trouvés: ${users.length}`);

    for (const user of users) {
      if (!user.role || user.role === null) {
        await run('UPDATE users SET role = "user" WHERE id = ?', [user.id]);
        console.log(`✅ Utilisateur ${user.email} -> rôle "user"`);
      }
      if (user.is_active === null || user.is_active === undefined) {
        await run('UPDATE users SET is_active = 1 WHERE id = ?', [user.id]);
        console.log(`✅ Utilisateur ${user.email} -> activé`);
      }
    }

    // 5. Créer le compte administrateur
    console.log('\n5. Création du compte administrateur...');
    const adminExists = await query('SELECT * FROM users WHERE email = ?', ['admin@gastroreserve.com']);
    
    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await run(`
        INSERT INTO users (email, password, first_name, last_name, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['admin@gastroreserve.com', hashedPassword, 'Admin', 'GastroReserve', 'admin', 1]);
      console.log('✅ Compte administrateur créé: admin@gastroreserve.com / admin123');
    } else {
      console.log('✅ Compte administrateur existe déjà');
    }

    // 6. Créer un utilisateur de test
    console.log('\n6. Création d\'un utilisateur de test...');
    const testExists = await query('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    
    if (testExists.length === 0) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      await run(`
        INSERT INTO users (email, password, first_name, last_name, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['test@example.com', hashedPassword, 'Test', 'User', 'user', 1]);
      console.log('✅ Utilisateur de test créé: test@example.com / test123');
    } else {
      console.log('✅ Utilisateur de test existe déjà');
    }

    // 7. Afficher le résultat final
    console.log('\n7. Résultat final:');
    const allUsers = await query('SELECT id, email, first_name, last_name, role, is_active FROM users');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.first_name} ${user.last_name}) - Rôle: ${user.role} - Actif: ${user.is_active ? 'Oui' : 'Non'}`);
    });

    console.log('\n🎉 Migration terminée avec succès !');
    console.log('\n📋 Comptes disponibles:');
    console.log('- Admin: admin@gastroreserve.com / admin123');
    console.log('- Test: test@example.com / test123');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

migrateDatabase();
