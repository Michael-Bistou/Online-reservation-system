class NotificationService {
  constructor() {
    this.notifications = []
    this.listeners = []
    this.loadNotifications()
    this.requestPermission()
  }

  // Charger les notifications depuis localStorage
  loadNotifications() {
    try {
      const stored = localStorage.getItem('notifications')
      if (stored) {
        this.notifications = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error)
      this.notifications = []
    }
  }

  // Sauvegarder les notifications dans localStorage
  saveNotifications() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications:', error)
    }
  }

  // Demander la permission pour les notifications push
  async requestPermission() {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission()
      }
    }
  }

  // Créer une nouvelle notification
  createNotification(type, title, message, data = {}) {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      read: false
    }

    this.notifications.unshift(notification)
    this.saveNotifications()
    this.notifyListeners()

    // Notification push du navigateur
    this.showPushNotification(title, message)

    return notification
  }

  // Afficher une notification push
  showPushNotification(title, message, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: '/img/favicon.png',
        badge: '/img/favicon.png',
        tag: options.tag || 'reservation-notification',
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        ...options
      })

      // Gérer les clics sur la notification
      notification.onclick = () => {
        window.focus()
        notification.close()
        
        // Navigation basée sur le type de notification
        if (options.navigateTo) {
          window.location.href = options.navigateTo
        }
      }

      // Auto-fermeture après 5 secondes
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
  }

  // Marquer une notification comme lue
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveNotifications()
      this.notifyListeners()
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true)
    this.saveNotifications()
    this.notifyListeners()
  }

  // Supprimer une notification
  deleteNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId)
    this.saveNotifications()
    this.notifyListeners()
  }

  // Supprimer toutes les notifications
  clearAllNotifications() {
    this.notifications = []
    this.saveNotifications()
    this.notifyListeners()
  }

  // Obtenir toutes les notifications
  getNotifications() {
    return this.notifications
  }

  // Obtenir les notifications non lues
  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read)
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount() {
    return this.getUnreadNotifications().length
  }

  // Obtenir les notifications par type
  getNotificationsByType(type) {
    return this.notifications.filter(n => n.type === type)
  }

  // Obtenir les notifications par utilisateur/restaurant
  getNotificationsForUser(userId, userType = 'user') {
    return this.notifications.filter(n => {
      if (userType === 'restaurant') {
        return n.data.restaurantId === userId
      }
      return n.data.userId === userId
    })
  }

  // S'abonner aux changements
  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // Notifier les listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.notifications))
  }

  // Méthodes spécifiques pour différents types de notifications
  createReservationNotification(reservation, restaurantName, restaurantId = null) {
    return this.createNotification(
      'new_reservation',
      'Nouvelle réservation',
      `Nouvelle réservation pour ${reservation.party_size} personnes le ${new Date(reservation.date).toLocaleDateString('fr-FR')} à ${reservation.time}`,
      {
        reservationId: reservation.id,
        restaurantId: restaurantId || reservation.restaurant_id,
        restaurantName,
        userId: reservation.user_id,
        userName: reservation.user_name
      }
    )
  }

  createReservationStatusNotification(reservation, status, restaurantName, restaurantId = null) {
    const statusMessages = {
      confirmed: 'Votre réservation a été confirmée',
      cancelled: 'Votre réservation a été annulée',
      completed: 'Votre réservation a été marquée comme terminée'
    }

    return this.createNotification(
      'reservation_status',
      'Statut de réservation mis à jour',
      `${statusMessages[status]} - ${restaurantName}`,
      {
        reservationId: reservation.id,
        restaurantId: restaurantId || reservation.restaurant_id,
        restaurantName,
        userId: reservation.user_id,
        status
      }
    )
  }

  createReminderNotification(reservation, restaurantName) {
    return this.createNotification(
      'reminder',
      'Rappel de réservation',
      `Rappel : Votre réservation chez ${restaurantName} est prévue pour demain à ${reservation.time}`,
      {
        reservationId: reservation.id,
        restaurantId: reservation.restaurant_id,
        restaurantName,
        userId: reservation.user_id
      }
    )
  }

  // Simuler l'envoi d'un email
  sendEmailNotification(to, subject, content, type = 'reservation') {
    // Simulation d'envoi d'email
    console.log(`📧 Email envoyé à ${to}:`)
    console.log(`Sujet: ${subject}`)
    console.log(`Contenu: ${content}`)
    
    // Stocker l'historique des emails
    const emailHistory = JSON.parse(localStorage.getItem('emailHistory') || '[]')
    emailHistory.push({
      id: Date.now(),
      to,
      subject,
      content,
      type,
      timestamp: new Date().toISOString(),
      status: 'sent'
    })
    localStorage.setItem('emailHistory', JSON.stringify(emailHistory))
    
    return { success: true, messageId: Date.now() }
  }

  // Envoyer une confirmation de réservation par email
  sendReservationConfirmationEmail(reservation) {
    const subject = `Confirmation de réservation - ${reservation.restaurant_name}`
    const content = `
      Bonjour ${reservation.user_name},
      
      Votre réservation a été confirmée !
      
      Détails de la réservation :
      - Restaurant : ${reservation.restaurant_name}
      - Date : ${new Date(reservation.date).toLocaleDateString('fr-FR')}
      - Heure : ${reservation.time}
      - Nombre de personnes : ${reservation.party_size}
      - Statut : Confirmée
      
      Merci de votre confiance !
    `
    
    return this.sendEmailNotification(reservation.user_email, subject, content, 'confirmation')
  }

  // Envoyer une notification de nouvelle réservation au restaurant
  sendNewReservationEmailToRestaurant(reservation) {
    const subject = `Nouvelle réservation - ${reservation.user_name}`
    const content = `
      Nouvelle réservation reçue !
      
      Détails :
      - Client : ${reservation.user_name} (${reservation.user_email})
      - Date : ${new Date(reservation.date).toLocaleDateString('fr-FR')}
      - Heure : ${reservation.time}
      - Nombre de personnes : ${reservation.party_size}
      - Demandes spéciales : ${reservation.special_requests || 'Aucune'}
      
      Connectez-vous à votre dashboard pour confirmer ou rejeter cette réservation.
    `
    
    // Simuler l'email du restaurant (utiliser l'email du restaurant)
    const restaurantEmail = `${reservation.restaurant_name.toLowerCase().replace(/\s+/g, '')}@example.com`
    return this.sendEmailNotification(restaurantEmail, subject, content, 'new_reservation')
  }

  // Programmer un rappel automatique
  scheduleReminder(reservation) {
    const reservationDate = new Date(reservation.date)
    const reminderDate = new Date(reservationDate)
    reminderDate.setDate(reminderDate.getDate() - 1) // 1 jour avant
    
    const now = new Date()
    const timeUntilReminder = reminderDate.getTime() - now.getTime()
    
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        this.createReminderNotification(reservation, reservation.restaurant_name)
        this.sendEmailNotification(
          reservation.user_email,
          'Rappel de réservation',
          `Votre réservation chez ${reservation.restaurant_name} est prévue pour demain à ${reservation.time}`,
          'reminder'
        )
      }, timeUntilReminder)
    }
  }

  // Vérifier et programmer les rappels pour toutes les réservations
  scheduleAllReminders() {
    const reservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]')
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed')
    
    confirmedReservations.forEach(reservation => {
      this.scheduleReminder(reservation)
    })
  }
}

// Instance singleton
const notificationService = new NotificationService()

export default notificationService
