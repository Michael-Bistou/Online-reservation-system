<template>
  <div class="reservations-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ $t('reservations.title') }}</h1>
        <p class="page-subtitle">{{ $t('reservations.subtitle') }}</p>
        <button @click="createNewReservation" class="btn btn-primary">
                      📅 {{ $t('reservations.newReservation') }}
        </button>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>{{ $t('reservations.loading') }}</p>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadReservations" class="btn btn-primary">
          Réessayer
        </button>
      </div>

      <!-- Liste des réservations -->
      <div v-else-if="reservations.length > 0" class="reservations-list">
        <div
          v-for="reservation in sortedReservations"
          :key="reservation.id"
          class="reservation-card"
          :class="getStatusClass(reservation.status)"
        >
          <div class="reservation-header">
            <div class="restaurant-info">
              <h3 class="restaurant-name">{{ reservation.restaurant_name }}</h3>
              <p class="reservation-date">
                📅 {{ formatDate(reservation.reservation_date) }}
                à {{ formatTime(reservation.reservation_time) }}
              </p>
            </div>
            <div class="reservation-status">
              <span :class="`status-badge status-${reservation.status}`">
                {{ getStatusText(reservation.status) }}
              </span>
            </div>
          </div>

          <div class="reservation-details">
            <div class="detail-row">
              <span class="detail-label">👥 Nombre de personnes :</span>
              <span class="detail-value">{{ reservation.guest_count }} personnes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📍 Table :</span>
              <span class="detail-value">Table {{ reservation.table_number }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📝 Notes :</span>
              <span class="detail-value">{{ reservation.special_requests || 'Aucune note' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📞 Contact :</span>
              <span class="detail-value">{{ reservation.contact_phone }}</span>
            </div>
          </div>

          <div class="reservation-actions">
            <button 
              v-if="canModify(reservation)"
              @click="editReservation(reservation)" 
              class="btn btn-outline"
            >
              ✏️ Modifier
            </button>
            <button 
              v-if="canCancel(reservation)"
              @click="cancelReservation(reservation)" 
              class="btn btn-danger"
            >
              ❌ Annuler
            </button>
            <button @click="viewRestaurant(reservation)" class="btn btn-primary">
              🍽️ Voir Restaurant
            </button>
          </div>
        </div>
      </div>

      <!-- Message si aucune réservation -->
      <div v-else class="no-reservations">
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>{{ $t('reservations.noReservations') }}</h3>
          <p>{{ $t('reservations.noReservationsText') }}</p>
          <button @click="createNewReservation" class="btn btn-primary">
            {{ $t('reservations.createFirst') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation d'annulation -->
    <div v-if="showCancelModal" class="modal-overlay" @click="closeCancelModal">
      <div class="modal-content" @click.stop>
        <h3>Confirmer l'annulation</h3>
        <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
        <div class="modal-actions">
          <button @click="closeCancelModal" class="btn btn-outline">
            Annuler
          </button>
          <button @click="confirmCancel" class="btn btn-danger">
            Confirmer l'annulation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

export default {
  name: 'Reservations',
  setup() {
    const router = useRouter()
    const { t: $t } = useI18n()
    const loading = ref(false)
    const error = ref('')
    const reservations = ref([])
    const showCancelModal = ref(false)
    const reservationToCancel = ref(null)

    // Charger les réservations
    const loadReservations = async () => {
      loading.value = true
      error.value = ''

      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/api/reservations', {
          headers: { Authorization: `Bearer ${token}` }
        })
        reservations.value = response.data
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err)
        error.value = 'Erreur lors du chargement de vos réservations'
      } finally {
        loading.value = false
      }
    }

    // Trier les réservations par date
    const sortedReservations = computed(() => {
      return [...reservations.value].sort((a, b) => {
        const dateA = new Date(`${a.reservation_date} ${a.reservation_time}`)
        const dateB = new Date(`${b.reservation_date} ${b.reservation_time}`)
        return dateA - dateB
      })
    })

    // Utilitaires
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTime = (timeString) => {
      return timeString.substring(0, 5) // Format HH:MM
    }

    const getStatusText = (status) => {
      const statusMap = {
        'confirmed': 'Confirmée',
        'pending': 'En attente',
        'cancelled': 'Annulée',
        'completed': 'Terminée'
      }
      return statusMap[status] || status
    }

    const getStatusClass = (status) => {
      return `status-${status}`
    }

    const canModify = (reservation) => {
      const reservationDate = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`)
      const now = new Date()
      const hoursDiff = (reservationDate - now) / (1000 * 60 * 60)
      
      return reservation.status === 'confirmed' && hoursDiff > 2
    }

    const canCancel = (reservation) => {
      const reservationDate = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`)
      const now = new Date()
      const hoursDiff = (reservationDate - now) / (1000 * 60 * 60)
      
      return reservation.status === 'confirmed' && hoursDiff > 24
    }

    // Actions
    const createNewReservation = () => {
      router.push('/reservations/new')
    }

    const editReservation = (reservation) => {
      router.push(`/reservations/${reservation.id}/edit`)
    }

    const viewRestaurant = (reservation) => {
      router.push(`/restaurants/${reservation.restaurant_id}`)
    }

    const cancelReservation = (reservation) => {
      reservationToCancel.value = reservation
      showCancelModal.value = true
    }

    const closeCancelModal = () => {
      showCancelModal.value = false
      reservationToCancel.value = null
    }

    const confirmCancel = async () => {
      if (!reservationToCancel.value) return

      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:3000/api/reservations/${reservationToCancel.value.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        // Recharger les réservations
        await loadReservations()
        closeCancelModal()
      } catch (err) {
        console.error('Erreur lors de l\'annulation:', err)
        error.value = 'Erreur lors de l\'annulation de la réservation'
      }
    }

    // Charger les données au montage
    onMounted(() => {
      loadReservations()
    })

    return {
      loading,
      error,
      reservations,
      sortedReservations,
      showCancelModal,
      loadReservations,
      formatDate,
      formatTime,
      getStatusText,
      getStatusClass,
      canModify,
      canCancel,
      createNewReservation,
      editReservation,
      viewRestaurant,
      cancelReservation,
      closeCancelModal,
      confirmCancel
    }
  }
}
</script>

<style scoped>
.reservations-page {
  padding: 2rem 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 2rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  margin: 2rem 0;
}

.reservations-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reservation-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
  transition: transform 0.3s, box-shadow 0.3s;
}

.reservation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.reservation-card.status-cancelled {
  border-left-color: #dc3545;
  opacity: 0.7;
}

.reservation-card.status-completed {
  border-left-color: #28a745;
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.restaurant-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

.reservation-date {
  color: #666;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-confirmed {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-completed {
  background: #d1ecf1;
  color: #0c5460;
}

.reservation-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #333;
}

.detail-value {
  color: #666;
}

.reservation-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.reservation-actions .btn {
  flex: 1;
  min-width: 120px;
}

.no-reservations {
  text-align: center;
  padding: 3rem;
}

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #333;
}

.modal-content p {
  margin-bottom: 1.5rem;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-actions .btn {
  flex: 1;
  max-width: 150px;
}

@media (max-width: 768px) {
  .reservation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .reservation-actions {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
