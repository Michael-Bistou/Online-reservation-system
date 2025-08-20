const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');

// Configuration i18next
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    // Configuration de base
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    
    // Configuration du backend (fichiers de traduction)
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    },
    
    // Configuration de détection de langue
    detection: {
      order: ['header', 'querystring', 'cookie'],
      lookupHeader: 'accept-language',
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      caches: ['cookie'],
      cookieExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
    },
    
    // Configuration des namespaces
    ns: ['common', 'auth', 'users', 'restaurants', 'reservations'],
    defaultNS: 'common',
    
    // Les ressources seront chargées automatiquement par le backend
    
    // Configuration des options
    interpolation: {
      escapeValue: false, // React fait déjà l'échappement
    },
    
    // Configuration des langues supportées
    supportedLngs: ['fr', 'en'],
    
    // Configuration de la langue par défaut
    lng: 'fr',
    
    // Configuration du chargement
    load: 'languageOnly',
    
    // Configuration des clés manquantes
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.warn(`Missing translation key: ${key} in namespace: ${ns} for language: ${lng}`);
    }
  });

// Middleware pour Express
const middleware = i18nextMiddleware.handle(i18next);

// Fonction utilitaire pour traduire
const t = (key, options = {}) => {
  return i18next.t(key, options);
};

// Fonction pour changer la langue
const changeLanguage = (lng) => {
  return i18next.changeLanguage(lng);
};

// Fonction pour obtenir la langue actuelle
const getLanguage = () => {
  return i18next.language;
};

// Fonction pour obtenir les langues supportées
const getSupportedLanguages = () => {
  return i18next.options.supportedLngs;
};

module.exports = {
  i18next,
  middleware,
  t,
  changeLanguage,
  getLanguage,
  getSupportedLanguages
};
