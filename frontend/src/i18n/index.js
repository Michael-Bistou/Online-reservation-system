import { createI18n } from 'vue-i18n'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import des traductions
import fr from './locales/fr.json'
import en from './locales/en.json'

// Configuration i18next
i18next
  .use(LanguageDetector)
  .init({
    resources: {
      fr: {
        translation: fr
      },
      en: {
        translation: en
      }
    },
    fallbackLng: 'fr',
    debug: false,
    
    // Configuration du détecteur de langue
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    // Options d'interpolation
    interpolation: {
      escapeValue: false
    }
  })

// Configuration Vue I18n
const i18n = createI18n({
  legacy: false, // Utiliser la Composition API
  locale: i18next.language || 'fr',
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
  await i18next.changeLanguage(locale)
  i18n.global.locale.value = locale
  localStorage.setItem('i18nextLng', locale)
  document.documentElement.lang = locale
}

// Fonction pour obtenir la langue actuelle
export const getCurrentLanguage = () => {
  return i18next.language
}

// Fonction pour obtenir les langues supportées
export const getSupportedLanguages = () => {
  return [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ]
}

// Initialiser la langue au démarrage
const initLanguage = () => {
  const savedLanguage = localStorage.getItem('i18nextLng')
  const browserLanguage = navigator.language.split('-')[0]
  const defaultLanguage = savedLanguage || browserLanguage || 'fr'
  
  // Vérifier si la langue est supportée
  const supportedLanguages = ['fr', 'en']
  const language = supportedLanguages.includes(defaultLanguage) ? defaultLanguage : 'fr'
  
  changeLanguage(language)
}

// Initialiser la langue
initLanguage()

export default i18n
