/**
 * Utilitaires pour la gestion du localStorage avec gestion d'erreurs
 */

/**
 * Récupérer un élément du localStorage avec gestion d'erreurs
 * @param {string} key - Clé de l'élément
 * @param {any} defaultValue - Valeur par défaut si erreur ou élément non trouvé
 * @returns {any} - Valeur récupérée ou valeur par défaut
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    return JSON.parse(item)
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key} depuis localStorage:`, error)
    return defaultValue
  }
}

/**
 * Sauvegarder un élément dans localStorage avec gestion d'erreurs
 * @param {string} key - Clé de l'élément
 * @param {any} value - Valeur à sauvegarder
 * @returns {boolean} - true si succès, false si erreur
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key} dans localStorage:`, error)
    return false
  }
}

/**
 * Supprimer un élément du localStorage avec gestion d'erreurs
 * @param {string} key - Clé de l'élément
 * @returns {boolean} - true si succès, false si erreur
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key} depuis localStorage:`, error)
    return false
  }
}

/**
 * Vérifier si localStorage est disponible
 * @returns {boolean} - true si disponible, false sinon
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (error) {
    return false
  }
}
