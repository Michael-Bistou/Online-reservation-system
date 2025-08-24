import { createI18n } from 'vue-i18n'

// Import des traductions
import fr from './locales/fr.json'
import en from './locales/en.json'

// Obtenir la langue par défaut
const getDefaultLanguage = () => {
  const savedLanguage = localStorage.getItem('i18nextLng')
  const browserLanguage = navigator.language.split('-')[0]
  const defaultLanguage = savedLanguage || browserLanguage || 'fr'
  
  // Vérifier si la langue est supportée
  const supportedLanguages = ['fr', 'en']
  return supportedLanguages.includes(defaultLanguage) ? defaultLanguage : 'fr'
}

// Configuration Vue I18n
const i18n = createI18n({
  legacy: false, // Utiliser la Composition API
  locale: getDefaultLanguage(),
  fallbackLocale: 'fr',
  messages: {
    fr,
    en
  },
  
  // Options globales
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true
})

// Fonction pour changer la langue
export const changeLanguage = async (locale) => {
  try {
    i18n.global.locale.value = locale
    localStorage.setItem('i18nextLng', locale)
    document.documentElement.lang = locale
    
    // Forcer la mise à jour de tous les composants
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { locale } }))
    
    console.log('🌍 Langue changée avec succès:', locale)
  } catch (error) {
    console.error('❌ Erreur lors du changement de langue:', error)
  }
}

// Fonction pour obtenir la langue actuelle
export const getCurrentLanguage = () => {
  return i18n.global.locale.value
}

// Fonction pour obtenir les langues supportées
export const getSupportedLanguages = () => {
  return [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ]
}

export default i18n
