/**
 * Utilitaires de validation pour les données de réservation
 */

/**
 * Valider une date de réservation
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateReservationDate(date) {
  if (!date) {
    return { isValid: false, error: 'La date est requise' }
  }

  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    return { isValid: false, error: 'La date ne peut pas être dans le passé' }
  }

  // Limiter les réservations à 6 mois à l'avance
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 6)

  if (selectedDate > maxDate) {
    return { isValid: false, error: 'La réservation ne peut pas être faite plus de 6 mois à l\'avance' }
  }

  return { isValid: true, error: null }
}

/**
 * Valider une heure de réservation
 * @param {string} time - Heure au format HH:MM
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateReservationTime(time) {
  if (!time) {
    return { isValid: false, error: 'L\'heure est requise' }
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(time)) {
    return { isValid: false, error: 'Format d\'heure invalide' }
  }

  const [hours, minutes] = time.split(':').map(Number)
  
  // Heures d'ouverture typiques : 11h-23h
  if (hours < 11 || hours > 23) {
    return { isValid: false, error: 'L\'heure doit être entre 11h00 et 23h00' }
  }

  return { isValid: true, error: null }
}

/**
 * Valider le nombre de personnes
 * @param {number} partySize - Nombre de personnes
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validatePartySize(partySize) {
  if (!partySize) {
    return { isValid: false, error: 'Le nombre de personnes est requis' }
  }

  const size = parseInt(partySize)
  if (isNaN(size)) {
    return { isValid: false, error: 'Le nombre de personnes doit être un nombre' }
  }

  if (size < 1) {
    return { isValid: false, error: 'Le nombre de personnes doit être au moins 1' }
  }

  if (size > 20) {
    return { isValid: false, error: 'Le nombre de personnes ne peut pas dépasser 20' }
  }

  return { isValid: true, error: null }
}

/**
 * Valider les demandes spéciales
 * @param {string} specialRequests - Demandes spéciales
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateSpecialRequests(specialRequests) {
  if (!specialRequests) {
    return { isValid: true, error: null } // Optionnel
  }

  if (specialRequests.length > 500) {
    return { isValid: false, error: 'Les demandes spéciales ne peuvent pas dépasser 500 caractères' }
  }

  return { isValid: true, error: null }
}

/**
 * Valider une réservation complète
 * @param {object} reservation - Objet de réservation
 * @returns {object} - { isValid: boolean, errors: object }
 */
export function validateReservation(reservation) {
  const errors = {}

  // Valider la date
  const dateValidation = validateReservationDate(reservation.date)
  if (!dateValidation.isValid) {
    errors.date = dateValidation.error
  }

  // Valider l'heure
  const timeValidation = validateReservationTime(reservation.time)
  if (!timeValidation.isValid) {
    errors.time = timeValidation.error
  }

  // Valider le nombre de personnes
  const partySizeValidation = validatePartySize(reservation.party_size || reservation.partySize)
  if (!partySizeValidation.isValid) {
    errors.party_size = partySizeValidation.error
  }

  // Valider les demandes spéciales
  const specialRequestsValidation = validateSpecialRequests(reservation.special_requests || reservation.specialRequests)
  if (!specialRequestsValidation.isValid) {
    errors.special_requests = specialRequestsValidation.error
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
