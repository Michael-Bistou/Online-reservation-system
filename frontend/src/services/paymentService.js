class PaymentService {
  constructor() {
    this.transactions = []
    this.loadTransactions()
  }

  // Charger les transactions depuis localStorage
  loadTransactions() {
    try {
      const stored = localStorage.getItem('paymentTransactions')
      if (stored) {
        this.transactions = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error)
      this.transactions = []
    }
  }

  // Sauvegarder les transactions dans localStorage
  saveTransactions() {
    try {
      localStorage.setItem('paymentTransactions', JSON.stringify(this.transactions))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des transactions:', error)
    }
  }

  // Calculer l'acompte basé sur le nombre de personnes
  calculateDeposit(partySize, restaurantPriceRange = '€€') {
    const baseAmount = {
      '€': 5, // Restaurant économique
      '€€': 10, // Restaurant moyen
      '€€€': 20, // Restaurant haut de gamme
      '€€€€': 30 // Restaurant luxueux
    }
    
    const baseDeposit = baseAmount[restaurantPriceRange] || 10
    return Math.max(baseDeposit, partySize * 2) // Minimum 2€ par personne
  }

  // Simuler un paiement avec Stripe
  async processPayment(paymentData) {
    try {
      // Simulation d'un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Validation des données de paiement
      if (!this.validatePaymentData(paymentData)) {
        throw new Error('Données de paiement invalides')
      }

      // Simuler un échec de paiement (5% de chance)
      if (Math.random() < 0.05) {
        throw new Error('Paiement refusé par la banque')
      }

      // Créer la transaction
      const transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        reservationId: paymentData.reservationId,
        amount: paymentData.amount,
        currency: 'EUR',
        status: 'succeeded',
        paymentMethod: 'card',
        cardLast4: paymentData.cardNumber.slice(-4),
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
        restaurantName: paymentData.restaurantName,
        description: `Acompte réservation - ${paymentData.restaurantName}`,
        createdAt: new Date().toISOString(),
        metadata: {
          partySize: paymentData.partySize,
          reservationDate: paymentData.reservationDate,
          reservationTime: paymentData.reservationTime
        }
      }

      // Ajouter la transaction
      this.transactions.unshift(transaction)
      this.saveTransactions()

      console.log('💳 Paiement traité avec succès:', transaction)

      return {
        success: true,
        transactionId: transaction.id,
        amount: transaction.amount,
        status: transaction.status
      }

    } catch (error) {
      console.error('❌ Erreur lors du traitement du paiement:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Valider les données de paiement
  validatePaymentData(paymentData) {
    const required = ['amount', 'cardNumber', 'expiryMonth', 'expiryYear', 'cvc', 'customerEmail', 'customerName']
    
    for (const field of required) {
      if (!paymentData[field]) {
        return false
      }
    }

    // Validation basique de la carte
    if (paymentData.cardNumber.length < 13 || paymentData.cardNumber.length > 19) {
      return false
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(paymentData.customerEmail)) {
      return false
    }

    // Validation de l'expiration
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    
    if (paymentData.expiryYear < currentYear || 
        (paymentData.expiryYear === currentYear && paymentData.expiryMonth < currentMonth)) {
      return false
    }

    return true
  }

  // Traiter un remboursement
  async processRefund(transactionId, amount = null) {
    try {
      const transaction = this.transactions.find(t => t.id === transactionId)
      if (!transaction) {
        throw new Error('Transaction non trouvée')
      }

      if (transaction.status !== 'succeeded') {
        throw new Error('Transaction non éligible au remboursement')
      }

      // Simulation d'un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500))

      const refundAmount = amount || transaction.amount
      
      const refund = {
        id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId: transactionId,
        amount: refundAmount,
        currency: 'EUR',
        status: 'succeeded',
        reason: 'Annulation de réservation',
        createdAt: new Date().toISOString()
      }

      // Mettre à jour la transaction originale
      transaction.refunds = transaction.refunds || []
      transaction.refunds.push(refund)

      // Ajouter le remboursement à la liste
      this.transactions.unshift(refund)
      this.saveTransactions()

      console.log('💰 Remboursement traité avec succès:', refund)

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status
      }

    } catch (error) {
      console.error('❌ Erreur lors du remboursement:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Obtenir toutes les transactions
  getTransactions() {
    return this.transactions
  }

  // Obtenir les transactions par utilisateur
  getTransactionsByUser(userEmail) {
    return this.transactions.filter(t => t.customerEmail === userEmail)
  }

  // Obtenir les transactions par restaurant
  getTransactionsByRestaurant(restaurantName) {
    return this.transactions.filter(t => t.restaurantName === restaurantName)
  }

  // Obtenir une transaction par ID
  getTransactionById(transactionId) {
    return this.transactions.find(t => t.id === transactionId)
  }

  // Obtenir les statistiques de paiement
  getPaymentStats() {
    const totalTransactions = this.transactions.filter(t => t.status === 'succeeded' && !t.transactionId)
    const totalRefunds = this.transactions.filter(t => t.transactionId) // Les remboursements ont un transactionId
    
    const totalAmount = totalTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalRefunded = totalRefunds.reduce((sum, r) => sum + r.amount, 0)
    
    return {
      totalTransactions: totalTransactions.length,
      totalRefunds: totalRefunds.length,
      totalAmount,
      totalRefunded,
      netAmount: totalAmount - totalRefunded
    }
  }

  // Formater un montant en euros
  formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100) // Montant en centimes
  }

  // Masquer un numéro de carte
  maskCardNumber(cardNumber) {
    if (!cardNumber) return ''
    return `**** **** **** ${cardNumber.slice(-4)}`
  }

  // Valider un numéro de carte (algorithme de Luhn)
  validateCardNumber(cardNumber) {
    if (!cardNumber) return false
    
    const digits = cardNumber.replace(/\D/g, '')
    if (digits.length < 13 || digits.length > 19) return false
    
    let sum = 0
    let isEven = false
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }
}

// Instance singleton
const paymentService = new PaymentService()

export default paymentService
