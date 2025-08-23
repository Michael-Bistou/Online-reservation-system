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
  showPushNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/img/favicon.png',
        badge: '/img/favicon.png'
      })
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
  createReservationNotification(reservation, restaurantName) {
    return this.createNotification(
      'new_reservation',
      'Nouvelle réservation',
      `Nouvelle réservation pour ${reservation.partySize} personnes le ${new Date(reservation.date).toLocaleDateString('fr-FR')} à ${reservation.time}`,
      {
        reservationId: reservation.id,
        restaurantId: reservation.restaurant_id,
        restaurantName,
        userId: reservation.user_id,
        userName: reservation.user_name
      }
    )
  }

  createReservationStatusNotification(reservation, status, restaurantName) {
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
        restaurantId: reservation.restaurant_id,
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
}

// Instance singleton
const notificationService = new NotificationService()

export default notificationService
