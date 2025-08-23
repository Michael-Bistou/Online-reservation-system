<template>
  <div class="notifications-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Notifications</h1>
        <p class="page-subtitle">Gérez vos notifications et restez informé</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- Actions principales -->
        <div class="actions-section">
          <div class="actions-row">
            <div class="filter-group">
              <select v-model="selectedType" class="filter-select">
                <option value="">Tous les types</option>
                <option value="new_reservation">Nouvelles réservations</option>
                <option value="reservation_status">Statuts de réservation</option>
                <option value="reminder">Rappels</option>
              </select>
            </div>
            <div class="filter-group">
              <select v-model="selectedStatus" class="filter-select">
                <option value="">Tous les statuts</option>
                <option value="unread">Non lues</option>
                <option value="read">Lues</option>
              </select>
            </div>
            <button v-if="unreadCount > 0" @click="markAllAsRead" class="btn btn-primary">
              Tout marquer comme lu
            </button>
            <button @click="clearAll" class="btn btn-outline">
              Tout effacer
            </button>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🔔</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalNotifications }}</div>
                <div class="stat-label">Total</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📬</div>
              <div class="stat-content">
                <div class="stat-number">{{ unreadCount }}</div>
                <div class="stat-label">Non lues</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-content">
                <div class="stat-number">{{ todayCount }}</div>
                <div class="stat-label">Aujourd'hui</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-number">{{ thisWeekCount }}</div>
                <div class="stat-label">Cette semaine</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Liste des notifications -->
        <div class="notifications-section">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Chargement des notifications...</p>
          </div>

          <div v-else-if="paginatedNotifications.length === 0" class="empty-state">
            <div class="empty-icon">🔔</div>
            <h3>Aucune notification</h3>
            <p>{{ getEmptyStateMessage() }}</p>
          </div>

          <div v-else class="notifications-list">
            <div
              v-for="notification in paginatedNotifications"
              :key="notification.id"
              class="notification-card"
              :class="{ unread: !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon">
                <span v-if="notification.type === 'new_reservation'">📅</span>
                <span v-else-if="notification.type === 'reservation_status'">✅</span>
                <span v-else-if="notification.type === 'reminder'">⏰</span>
                <span v-else>🔔</span>
              </div>

              <div class="notification-content">
                <div class="notification-header">
                  <h3 class="notification-title">{{ notification.title }}</h3>
                  <div class="notification-meta">
                    <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
                    <span class="notification-type">{{ getTypeLabel(notification.type) }}</span>
                  </div>
                </div>
                <p class="notification-message">{{ notification.message }}</p>
              </div>

              <div class="notification-actions">
                <button
                  v-if="!notification.read"
                  @click.stop="markAsRead(notification.id)"
                  class="action-btn read-btn"
                  title="Marquer comme lu"
                >
                  ✓
                </button>
                <button
                  @click.stop="deleteNotification(notification.id)"
                  class="action-btn delete-btn"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              ← Précédent
            </button>
            <span class="pagination-info">
              Page {{ currentPage }} sur {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import notificationService from '../services/notificationService.js'

export default {
  name: 'Notifications',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const notifications = ref([])
    const selectedType = ref('')
    const selectedStatus = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 20

    // Computed properties
    const currentUser = computed(() => {
      const userData = localStorage.getItem('userData')
      const restaurantData = localStorage.getItem('currentRestaurant')
      
      if (restaurantData) {
        const restaurant = JSON.parse(restaurantData)
        return { id: restaurant.restaurant_name, type: 'restaurant' }
      }
      
      if (userData) {
        const user = JSON.parse(userData)
        return { id: user.id, type: 'user' }
      }
      
      return null
    })

    const filteredNotifications = computed(() => {
      let filtered = notifications.value

      // Filtrer par type
      if (selectedType.value) {
        filtered = filtered.filter(n => n.type === selectedType.value)
      }

      // Filtrer par statut
      if (selectedStatus.value) {
        filtered = filtered.filter(n => {
          if (selectedStatus.value === 'unread') return !n.read
          if (selectedStatus.value === 'read') return n.read
          return true
        })
      }

      return filtered
    })

    const paginatedNotifications = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredNotifications.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredNotifications.value.length / itemsPerPage)
    })

    const totalNotifications = computed(() => notifications.value.length)
    const unreadCount = computed(() => {
      try {
        return notificationService.getUnreadCount()
      } catch (error) {
        console.error('Erreur lors du calcul des notifications non lues:', error)
        return 0
      }
    })
    
    const todayCount = computed(() => {
      const today = new Date().toDateString()
      return notifications.value.filter(n => 
        new Date(n.timestamp).toDateString() === today
      ).length
    })

    const thisWeekCount = computed(() => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return notifications.value.filter(n => 
        new Date(n.timestamp) >= weekAgo
      ).length
    })

    // Méthodes
    const loadNotifications = () => {
      try {
        if (currentUser.value) {
          notifications.value = notificationService.getNotificationsForUser(
            currentUser.value.id, 
            currentUser.value.type
          )
        } else {
          notifications.value = []
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error)
        notifications.value = []
      }
    }

    const markAsRead = (notificationId) => {
      try {
        notificationService.markAsRead(notificationId)
        loadNotifications()
      } catch (error) {
        console.error('Erreur lors du marquage comme lu:', error)
      }
    }

    const markAllAsRead = () => {
      try {
        notificationService.markAllAsRead()
        loadNotifications()
      } catch (error) {
        console.error('Erreur lors du marquage de toutes comme lues:', error)
      }
    }

    const deleteNotification = (notificationId) => {
      try {
        notificationService.deleteNotification(notificationId)
        loadNotifications()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }

    const clearAll = () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
        try {
          notificationService.clearAllNotifications()
          loadNotifications()
        } catch (error) {
          console.error('Erreur lors de la suppression de toutes les notifications:', error)
        }
      }
    }

    const handleNotificationClick = (notification) => {
      try {
        // Marquer comme lue si pas déjà lue
        if (!notification.read) {
          notificationService.markAsRead(notification.id)
          loadNotifications()
        }

        // Navigation selon le type
        if (notification.type === 'new_reservation' && currentUser.value?.type === 'restaurant') {
          router.push('/restaurant-reservations')
        } else if (notification.type === 'reservation_status' && currentUser.value?.type === 'user') {
          router.push('/reservations')
        } else if (notification.type === 'reminder' && currentUser.value?.type === 'user') {
          router.push('/reservations')
        }
      } catch (error) {
        console.error('Erreur lors du clic sur la notification:', error)
      }
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 1) return 'À l\'instant'
      if (minutes < 60) return `Il y a ${minutes} min`
      if (hours < 24) return `Il y a ${hours}h`
      if (days < 7) return `Il y a ${days}j`
      
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getTypeLabel = (type) => {
      const labels = {
        new_reservation: 'Nouvelle réservation',
        reservation_status: 'Statut réservation',
        reminder: 'Rappel'
      }
      return labels[type] || type
    }

    const getEmptyStateMessage = () => {
      if (selectedType.value || selectedStatus.value) {
        return 'Aucune notification ne correspond à vos filtres.'
      }
      return 'Vous n\'avez pas encore de notifications.'
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    // S'abonner aux changements de notifications
    let unsubscribe
    onMounted(() => {
      try {
        loadNotifications()
        unsubscribe = notificationService.subscribe(() => {
          loadNotifications()
        })
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des notifications:', error)
      }
    })

    onUnmounted(() => {
      try {
        if (unsubscribe) {
          unsubscribe()
        }
      } catch (error) {
        console.error('Erreur lors du nettoyage des notifications:', error)
      }
    })

    return {
      loading,
      filteredNotifications,
      paginatedNotifications,
      selectedType,
      selectedStatus,
      currentPage,
      totalPages,
      totalNotifications,
      unreadCount,
      todayCount,
      thisWeekCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      handleNotificationClick,
      formatTime,
      getTypeLabel,
      getEmptyStateMessage,
      previousPage,
      nextPage
    }
  }
}
</script>

<style scoped>
.notifications-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0 40px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.page-content {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.actions-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.actions-row {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  min-width: 150px;
}

.filter-select {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-outline {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.stats-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #5a6c7d;
}

.notifications-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #5a6c7d;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.notification-card.unread {
  background: #e3f2fd;
  border-left: 4px solid #667eea;
}

.notification-icon {
  font-size: 1.5rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

.notification-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.notification-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: #6c757d;
}

.notification-message {
  color: #5a6c7d;
  line-height: 1.5;
  margin: 0;
}

.notification-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.read-btn {
  background: #28a745;
  color: white;
}

.read-btn:hover {
  background: #218838;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.pagination-btn {
  padding: 8px 16px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: #5a6c7d;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .actions-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .notification-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .notification-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 40px 0 30px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .notification-card {
    flex-direction: column;
    gap: 10px;
  }
  
  .notification-actions {
    align-self: flex-end;
  }
}
</style>
