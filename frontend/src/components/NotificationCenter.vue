<template>
  <div class="notification-center">
    <!-- Bouton de notification avec badge -->
    <div class="notification-trigger" @click="toggleDropdown">
      <div class="notification-icon">
        🔔
        <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
      </div>
    </div>

    <!-- Dropdown des notifications -->
    <div v-if="showDropdown" class="notification-dropdown">
      <div class="dropdown-header">
        <h3>Notifications</h3>
        <div class="header-actions">
          <button v-if="unreadCount > 0" @click="markAllAsRead" class="action-btn">
            Tout marquer comme lu
          </button>
          <button @click="clearAll" class="action-btn clear-btn">
            Tout effacer
          </button>
        </div>
      </div>

      <div class="notifications-list">
        <div v-if="notifications.length === 0" class="empty-state">
          <div class="empty-icon">🔔</div>
          <p>Aucune notification</p>
        </div>

        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-icon-small">
            <span v-if="notification.type === 'new_reservation'">📅</span>
            <span v-else-if="notification.type === 'reservation_status'">✅</span>
            <span v-else-if="notification.type === 'reminder'">⏰</span>
            <span v-else>🔔</span>
          </div>
          
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
          </div>

          <div class="notification-actions">
            <button 
              @click.stop="deleteNotification(notification.id)" 
              class="delete-btn"
              title="Supprimer"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div class="dropdown-footer">
        <router-link to="/notifications" class="view-all-btn">
          Voir toutes les notifications
        </router-link>
      </div>
    </div>

    <!-- Overlay pour fermer le dropdown -->
    <div v-if="showDropdown" class="dropdown-overlay" @click="closeDropdown"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import notificationService from '../services/notificationService.js'

export default {
  name: 'NotificationCenter',
  setup() {
    const router = useRouter()
    const showDropdown = ref(false)
    const notifications = ref([])
    const unreadCount = ref(0)

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

    // Méthodes
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const closeDropdown = () => {
      showDropdown.value = false
    }

    const loadNotifications = () => {
      if (currentUser.value) {
        notifications.value = notificationService.getNotificationsForUser(
          currentUser.value.id, 
          currentUser.value.type
        )
        unreadCount.value = notificationService.getUnreadCount()
      }
    }

    const markAllAsRead = () => {
      notificationService.markAllAsRead()
      loadNotifications()
    }

    const clearAll = () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
        notificationService.clearAllNotifications()
        loadNotifications()
      }
    }

    const deleteNotification = (notificationId) => {
      notificationService.deleteNotification(notificationId)
      loadNotifications()
    }

    const handleNotificationClick = (notification) => {
      // Marquer comme lue
      notificationService.markAsRead(notification.id)
      loadNotifications()

      // Navigation selon le type de notification
      if (notification.type === 'new_reservation' && currentUser.value?.type === 'restaurant') {
        router.push('/restaurant-reservations')
      } else if (notification.type === 'reservation_status' && currentUser.value?.type === 'user') {
        router.push('/reservations')
      } else if (notification.type === 'reminder' && currentUser.value?.type === 'user') {
        router.push('/reservations')
      }

      closeDropdown()
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
      
      return date.toLocaleDateString('fr-FR')
    }

    // S'abonner aux changements de notifications
    let unsubscribe
    onMounted(() => {
      loadNotifications()
      unsubscribe = notificationService.subscribe(() => {
        loadNotifications()
      })
    })

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    return {
      showDropdown,
      notifications,
      unreadCount,
      toggleDropdown,
      closeDropdown,
      markAllAsRead,
      clearAll,
      deleteNotification,
      handleNotificationClick,
      formatTime
    }
  }
}
</script>

<style scoped>
.notification-center {
  position: relative;
}

.notification-trigger {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
}

.notification-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notification-icon {
  font-size: 1.2rem;
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 400px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
  margin-top: 10px;
}

.dropdown-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.dropdown-header h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  background: #667eea;
  color: white;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #5a6fd8;
}

.clear-btn {
  background: #dc3545;
}

.clear-btn:hover {
  background: #c82333;
}

.notifications-list {
  max-height: 350px;
  overflow-y: auto;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #6c757d;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px 20px;
  border-bottom: 1px solid #f1f3f4;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: #e3f2fd;
  border-left: 4px solid #667eea;
}

.notification-icon-small {
  font-size: 1.2rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.notification-message {
  color: #5a6c7d;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 6px;
}

.notification-time {
  font-size: 0.75rem;
  color: #6c757d;
}

.notification-actions {
  flex-shrink: 0;
}

.delete-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #f8d7da;
  color: #dc3545;
}

.dropdown-footer {
  padding: 15px 20px;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.view-all-btn {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.view-all-btn:hover {
  text-decoration: underline;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* Responsive */
@media (max-width: 768px) {
  .notification-dropdown {
    width: 320px;
    right: -10px;
  }
  
  .dropdown-header {
    padding: 15px;
  }
  
  .notification-item {
    padding: 12px 15px;
  }
}

@media (max-width: 480px) {
  .notification-dropdown {
    width: 280px;
    right: -20px;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>
