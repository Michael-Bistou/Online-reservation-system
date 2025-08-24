import paymentService from './paymentService.js'
import notificationService from './notificationService.js'

class CancellationService {
  constructor() {
    this.cancellationReasons = {
      change_of_plans: 'Changement de plans',
      unavailable: 'Indisponibilité',
      found_alternative: 'Autre restaurant trouvé',
      emergency: 'Urgence personnelle',
      weather: 'Conditions météo',
      other: 'Autre raison'
    }
  }

  // Vérifier si une réservation peut être annulée
  canCancelReservation(reservation) {
    if (!reservation) return false
    
    const reservationDate = new Date(reservation.date)
    const now = new Date()
    const hoursUntilReservation = (reservationDate - now) / (1000 * 60 * 60)
    
    // Peut annuler jusqu'à 2 heures avant la réservation
    return hoursUntilReservation > 2 && reservation.status !== 'cancelled' && reservation.status !== 'completed'
  }

  // Calculer le montant de remboursement
  calculateRefundAmount(reservation) {
    // Si pas de montant d'acompte défini, utiliser un montant par défaut
    const depositAmount = reservation.deposit_amount || this.getDefaultDepositAmount(reservation)
    
    if (!depositAmount) return 0
    
    const reservationDate = new Date(reservation.date)
    const now = new Date()
    const hoursUntilReservation = (reservationDate - now) / (1000 * 60 * 60)
    
    // Politique de remboursement :
    // - Plus de 24h : 100% remboursé
    // - 2-24h : 50% remboursé
    // - Moins de 2h : pas de remboursement
    
    if (hoursUntilReservation > 24) {
      return depositAmount // 100%
    } else if (hoursUntilReservation > 2) {
      return Math.floor(depositAmount * 0.5) // 50%
    } else {
      return 0 // Pas de remboursement
    }
  }

  // Obtenir le montant d'acompte par défaut basé sur le nombre de personnes
  getDefaultDepositAmount(reservation) {
    const partySize = reservation.party_size || 2
    const restaurantPriceRange = reservation.price_range || '€€'
    
    // Utiliser la même logique que le service de paiement
    const baseAmount = {
      '€': 5, // Restaurant économique
      '€€': 10, // Restaurant moyen
      '€€€': 20, // Restaurant haut de gamme
      '€€€€': 30 // Restaurant luxueux
    }
    
    const baseDeposit = baseAmount[restaurantPriceRange] || 10
    const depositPerPerson = Math.max(baseDeposit, partySize * 2) // Minimum 2€ par personne
    
    return depositPerPerson * 100 // Convertir en centimes
  }

  // Traiter l'annulation d'une réservation
  async processCancellation(reservation, reason) {
    try {
      // Vérifier si l'annulation est possible
      if (!this.canCancelReservation(reservation)) {
        throw new Error('Cette réservation ne peut plus être annulée')
      }

      // Calculer le montant de remboursement
      const refundAmount = this.calculateRefundAmount(reservation)
      
      // Traiter le remboursement si nécessaire
      let refundResult = null
      if (refundAmount > 0) {
        // Passer la raison au processus de remboursement
        refundResult = await this.processRefund(reservation, refundAmount, reason)
      }

      // Mettre à jour le statut de la réservation
      const updatedReservation = {
        ...reservation,
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        refund_amount: refundAmount,
        refund_id: refundResult?.refundId || null
      }

      // Envoyer les notifications
      await this.sendCancellationNotifications(updatedReservation, reason, refundAmount)

      return {
        success: true,
        reservation: updatedReservation,
        refund: refundResult,
        refundAmount
      }

    } catch (error) {
      console.error('Erreur lors du traitement de l\'annulation:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Traiter le remboursement automatique
  async processRefund(reservation, amount, reason) {
    try {
      // Créer une transaction de remboursement
      const refundTransaction = {
        id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId: reservation.payment_id || `res_${reservation.id}`, // ID de la transaction originale ou de la réservation
        type: 'refund',
        amount: amount,
        currency: 'EUR',
        status: 'succeeded',
        description: `Remboursement - Réservation annulée - ${reservation.restaurant_name}`,
        customerEmail: reservation.user_email || reservation.customer_email || 'customer@example.com',
        customerName: reservation.user_name || reservation.customer_name || 'Client',
        restaurantName: reservation.restaurant_name,
        createdAt: new Date().toISOString(),
        reason: this.getReasonText(reason) || reason, // Utiliser le texte de la raison
        metadata: {
          originalReservationId: reservation.id,
          originalReservationDate: reservation.date,
          originalReservationTime: reservation.time,
          partySize: reservation.party_size
        }
      }

      // Enregistrer la transaction de remboursement
      await this.saveRefundTransaction(refundTransaction)

      return {
        success: true,
        refundId: refundTransaction.id,
        amount: amount,
        status: 'succeeded'
      }
    } catch (error) {
      console.error('Erreur lors du remboursement:', error)
      throw error
    }
  }

  // Sauvegarder la transaction de remboursement
  async saveRefundTransaction(refundTransaction) {
    try {
      // Récupérer les transactions existantes
      const existingTransactions = JSON.parse(localStorage.getItem('paymentTransactions') || '[]')
      
      // Ajouter la nouvelle transaction de remboursement
      existingTransactions.unshift(refundTransaction)
      
      // Sauvegarder
      localStorage.setItem('paymentTransactions', JSON.stringify(existingTransactions))
      
      console.log('Transaction de remboursement enregistrée:', refundTransaction)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la transaction de remboursement:', error)
      throw error
    }
  }

  // Envoyer les notifications d'annulation
  async sendCancellationNotifications(reservation, reason, refundAmount) {
    try {
      // Notification email au client
      const emailData = {
        to: reservation.customer_email || 'customer@example.com',
        subject: 'Réservation annulée',
        content: this.generateCancellationEmailContent(reservation, reason, refundAmount)
      }

      // Envoyer l'email via le service de notification
      await notificationService.sendEmail(emailData)

      // Notification push
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Réservation annulée', {
          body: `Votre réservation chez ${reservation.restaurant_name} a été annulée avec succès.`,
          icon: '/favicon.ico'
        })
      }

      // Notification au restaurant
      await this.notifyRestaurant(reservation, reason)

    } catch (error) {
      console.error('Erreur lors de l\'envoi des notifications:', error)
    }
  }

  // Générer le contenu de l'email d'annulation
  generateCancellationEmailContent(reservation, reason, refundAmount) {
    const refundText = refundAmount > 0 
      ? `Un remboursement de ${this.formatAmount(refundAmount)} sera traité dans les 3-5 jours ouvrables.`
      : 'Aucun remboursement ne sera effectué selon notre politique d\'annulation.'

    return `
      Bonjour,

      Votre réservation a été annulée avec succès.

      Détails de la réservation :
      - Restaurant : ${reservation.restaurant_name}
      - Date : ${new Date(reservation.date).toLocaleDateString('fr-FR')}
      - Heure : ${reservation.time}
      - Nombre de personnes : ${reservation.party_size}
      - Raison de l'annulation : ${this.getReasonText(reason)}

      ${refundText}

      Si vous avez des questions, n'hésitez pas à nous contacter.

      Cordialement,
      L'équipe de réservation
    `
  }

  // Notifier le restaurant
  async notifyRestaurant(reservation, reason) {
    try {
      const restaurantEmail = reservation.restaurant_email || 'restaurant@example.com'
      
      const emailData = {
        to: restaurantEmail,
        subject: 'Réservation annulée',
        content: `
          Bonjour,

          Une réservation a été annulée :

          - Client : ${reservation.customer_name}
          - Date : ${new Date(reservation.date).toLocaleDateString('fr-FR')}
          - Heure : ${reservation.time}
          - Nombre de personnes : ${reservation.party_size}
          - Raison : ${this.getReasonText(reason)}

          Cordialement,
          Système de réservation
        `
      }

      await notificationService.sendEmail(emailData)
    } catch (error) {
      console.error('Erreur lors de la notification au restaurant:', error)
    }
  }

  // Formater un montant
  formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100)
  }

  // Obtenir les raisons d'annulation
  getCancellationReasons() {
    return this.cancellationReasons
  }

  // Obtenir le texte d'une raison
  getReasonText(reasonKey) {
    return this.cancellationReasons[reasonKey] || reasonKey
  }
}

// Instance singleton
const cancellationService = new CancellationService()

export default cancellationService
