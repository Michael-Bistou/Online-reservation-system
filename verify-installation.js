#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

console.log('========================================');
console.log('  Vérification de l\'Installation');
console.log('========================================');
console.log();

let allChecksPassed = true;

// Fonction pour afficher le résultat d'un check
const checkResult = (name, passed, details = '') => {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }
  if (!passed) allChecksPassed = false;
  console.log();
};

// 1. Vérifier la structure des dossiers
console.log('📁 Vérification de la structure des dossiers...');
const requiredDirs = [
  'frontend',
  'frontend/src',
  'frontend/src/components',
  'frontend/src/views',
  'frontend/src/services',
  'frontend/src/router',
  'frontend/src/locales',
  'frontend/public',
  'frontend/public/img',
  'frontend/public/img/restaurants',
  'src',
  'src/controllers',
  'src/routes',
  'src/config',
  'src/middleware'
];

requiredDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  checkResult(`Dossier ${dir}`, exists, exists ? 'Présent' : 'Manquant');
});

// 2. Vérifier les fichiers de configuration
console.log('📄 Vérification des fichiers de configuration...');
const requiredFiles = [
  'frontend/package.json',
  'src/package.json',
  'frontend/vite.config.js',
  'src/server.js',
  'migrate-database.js',
  'README.md',
  'INSTALLATION.md',
  'GUIDE_UTILISATION.md',
  'DOCUMENTATION_TECHNIQUE.md',
  'install.bat',
  'install.sh'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  checkResult(`Fichier ${file}`, exists, exists ? 'Présent' : 'Manquant');
});

// 3. Vérifier la base de données
console.log('🗄️ Vérification de la base de données...');
const dbExists = fs.existsSync('database.sqlite');
checkResult('Base de données SQLite', dbExists, dbExists ? 'Présente' : 'Manquante');

if (dbExists) {
  try {
    const db = new sqlite3.Database('database.sqlite');
    
    // Vérifier les tables
    const requiredTables = ['users', 'restaurants', 'tables', 'reservations', 'payments', 'audit_logs'];
    
    db.serialize(() => {
      requiredTables.forEach(table => {
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`, (err, row) => {
          const exists = !err && row;
          checkResult(`Table ${table}`, exists, exists ? 'Présente' : 'Manquante');
        });
      });
      
      // Vérifier les données de test
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (!err && row) {
          const userCount = row.count;
          checkResult('Utilisateurs de test', userCount > 0, `${userCount} utilisateurs trouvés`);
        }
      });
      
      db.get('SELECT COUNT(*) as count FROM restaurants', (err, row) => {
        if (!err && row) {
          const restaurantCount = row.count;
          checkResult('Restaurants de test', restaurantCount > 0, `${restaurantCount} restaurants trouvés`);
        }
      });
      
      db.get('SELECT COUNT(*) as count FROM reservations', (err, row) => {
        if (!err && row) {
          const reservationCount = row.count;
          checkResult('Réservations de test', reservationCount > 0, `${reservationCount} réservations trouvées`);
        }
      });
    });
    
    db.close();
  } catch (error) {
    checkResult('Accès à la base de données', false, `Erreur: ${error.message}`);
  }
}

// 4. Vérifier les dépendances
console.log('📦 Vérification des dépendances...');

// Vérifier package.json frontend
try {
  const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  const hasVue = frontendPackage.dependencies && frontendPackage.dependencies.vue;
  checkResult('Vue.js dans frontend', hasVue, hasVue ? 'Version ' + frontendPackage.dependencies.vue : 'Manquant');
  
  const hasVite = frontendPackage.devDependencies && frontendPackage.devDependencies.vite;
  checkResult('Vite dans frontend', hasVite, hasVue ? 'Version ' + frontendPackage.devDependencies.vite : 'Manquant');
} catch (error) {
  checkResult('Package.json frontend', false, 'Erreur de lecture');
}

// Vérifier package.json backend
try {
  const backendPackage = JSON.parse(fs.readFileSync('src/package.json', 'utf8'));
  const hasExpress = backendPackage.dependencies && backendPackage.dependencies.express;
  checkResult('Express.js dans backend', hasExpress, hasExpress ? 'Version ' + backendPackage.dependencies.express : 'Manquant');
  
  const hasSqlite3 = backendPackage.dependencies && backendPackage.dependencies.sqlite3;
  checkResult('SQLite3 dans backend', hasSqlite3, hasSqlite3 ? 'Version ' + backendPackage.dependencies.sqlite3 : 'Manquant');
} catch (error) {
  checkResult('Package.json backend', false, 'Erreur de lecture');
}

// 5. Vérifier les images des restaurants
console.log('🖼️ Vérification des images des restaurants...');
const restaurantImages = [
  'frontend/public/img/restaurants/french-bistrot.jpg',
  'frontend/public/img/restaurants/japanese-sushi.jpg',
  'frontend/public/img/restaurants/italian-trattoria.jpg',
  'frontend/public/img/restaurants/indian-spice.jpg',
  'frontend/public/img/restaurants/french-luxury.jpg',
  'frontend/public/img/restaurants/mexican-tacos.jpeg',
  'frontend/public/img/restaurants/chinese-bamboo.jpg',
  'frontend/public/img/restaurants/greek-ouzeri.jpg',
  'frontend/public/img/restaurants/spanish-tapas.jpg',
  'frontend/public/img/restaurants/thai-siam.jpg'
];

restaurantImages.forEach(image => {
  const exists = fs.existsSync(image);
  const filename = path.basename(image);
  checkResult(`Image ${filename}`, exists, exists ? 'Présente' : 'Manquante');
});

// 6. Vérifier les fichiers de traduction
console.log('🌍 Vérification des fichiers de traduction...');
const translationFiles = [
  'frontend/src/locales/fr.json',
  'frontend/src/locales/en.json'
];

translationFiles.forEach(file => {
  const exists = fs.existsSync(file);
  const lang = path.basename(file, '.json').toUpperCase();
  checkResult(`Traductions ${lang}`, exists, exists ? 'Présentes' : 'Manquantes');
  
  if (exists) {
    try {
      const translations = JSON.parse(fs.readFileSync(file, 'utf8'));
      const hasCommon = translations.common;
      const hasHome = translations.home;
      checkResult(`Structure ${lang}`, hasCommon && hasHome, hasCommon && hasHome ? 'Complète' : 'Incomplète');
    } catch (error) {
      checkResult(`Validité JSON ${lang}`, false, 'Erreur de syntaxe JSON');
    }
  }
});

// 7. Vérifier les scripts d'installation
console.log('🔧 Vérification des scripts d\'installation...');
const installScripts = [
  { name: 'Script Windows', file: 'install.bat' },
  { name: 'Script Linux/macOS', file: 'install.sh' }
];

installScripts.forEach(script => {
  const exists = fs.existsSync(script.file);
  checkResult(script.name, exists, exists ? 'Présent' : 'Manquant');
  
  if (exists) {
    const content = fs.readFileSync(script.file, 'utf8');
    const hasNodeCheck = content.includes('node --version');
    const hasNpmCheck = content.includes('npm --version');
    checkResult(`Vérifications dans ${script.name}`, hasNodeCheck && hasNpmCheck, 
      hasNodeCheck && hasNpmCheck ? 'Complètes' : 'Incomplètes');
  }
});

// 8. Vérifier la documentation
console.log('📚 Vérification de la documentation...');
const docs = [
  { name: 'README.md', file: 'README.md' },
  { name: 'Guide d\'installation', file: 'INSTALLATION.md' },
  { name: 'Guide d\'utilisation', file: 'GUIDE_UTILISATION.md' },
  { name: 'Documentation technique', file: 'DOCUMENTATION_TECHNIQUE.md' }
];

docs.forEach(doc => {
  const exists = fs.existsSync(doc.file);
  checkResult(doc.name, exists, exists ? 'Présent' : 'Manquant');
  
  if (exists) {
    const content = fs.readFileSync(doc.file, 'utf8');
    const hasContent = content.length > 1000; // Au moins 1000 caractères
    checkResult(`Contenu ${doc.name}`, hasContent, hasContent ? 'Détaillé' : 'Trop court');
  }
});

// Résultat final
console.log('========================================');
console.log('  RÉSULTAT DE LA VÉRIFICATION');
console.log('========================================');
console.log();

if (allChecksPassed) {
  console.log('🎉 Toutes les vérifications sont passées avec succès !');
  console.log();
  console.log('✅ Votre installation est complète et prête à être utilisée.');
  console.log();
  console.log('📋 Prochaines étapes :');
  console.log('1. Lancer le backend : cd src && npm start');
  console.log('2. Lancer le frontend : cd frontend && npm run dev');
  console.log('3. Ouvrir http://localhost:8080 dans votre navigateur');
  console.log('4. Se connecter avec admin@gastroreserve.com / admin123');
  console.log();
  console.log('📚 Documentation disponible :');
  console.log('- README.md : Vue d\'ensemble');
  console.log('- INSTALLATION.md : Guide d\'installation');
  console.log('- GUIDE_UTILISATION.md : Guide d\'utilisation');
  console.log('- DOCUMENTATION_TECHNIQUE.md : Documentation technique');
} else {
  console.log('⚠️  Certaines vérifications ont échoué.');
  console.log();
  console.log('🔧 Actions recommandées :');
  console.log('1. Relancer le script d\'installation : node install.bat (Windows) ou ./install.sh (Linux/macOS)');
  console.log('2. Vérifier que tous les prérequis sont installés (Node.js, npm, Git)');
  console.log('3. Vérifier les permissions d\'écriture dans le dossier du projet');
  console.log('4. Consulter la documentation d\'installation pour plus de détails');
}

console.log();
console.log('========================================');
