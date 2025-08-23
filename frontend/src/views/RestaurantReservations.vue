<template>
  <div class="restaurant-reservations">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Gestion des Réservations</h1>
        <p class="page-subtitle">Gérez les réservations de votre restaurant</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- Filtres et statistiques -->
        <div class="filters-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ totalReservations }}</div>
              <div class="stat-label">Total des réservations</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ pendingReservations }}</div>
              <div class="stat-label">En attente</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ confirmedReservations }}</div>
              <div class="stat-label">Confirmées</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ todayReservations }}</div>
              <div class="stat-label">Aujourd'hui</div>
            </div>
          </div>

          <div class="filters-row">
            <div class="filter-group">
              <label class="filter-label">Statut</label>
              <select v-model="selectedStatus" class="filter-select">
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmées</option>
                <option value="cancelled">Annulées</option>
                <option value="completed">Terminées</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Date</label>
              <select v-model="selectedDate" class="filter-select">
                <option value="">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="tomorrow">Demain</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Rechercher</label>
              <input
                v-model="searchQuery"
                type="text"
                class="filter-input"
                placeholder="Nom du client, email..."
              />
            </div>

            <button @click="clearFilters" class="btn btn-outline">
              Effacer les filtres
            </button>
          </div>
        </div>

        <!-- Liste des réservations -->
        <div class="reservations-section">
          <div class="section-header">
            <h2 class="section-title">Réservations</h2>
            <div class="section-actions">
              <button @click="refreshReservations" class="btn btn-outline">
                <span class="btn-icon">🔄</span>
                Actualiser
              </button>
            </div>
          </div>

          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Chargement des réservations...</p>
          </div>

          <div v-else-if="filteredReservations.length === 0" class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>Aucune réservation trouvée</h3>
            <p>{{ getEmptyStateMessage() }}</p>
          </div>

          <div v-else class="reservations-grid">
            <div
              v-for="reservation in filteredReservations"
              :key="reservation.id"
              class="reservation-card"
              :class="`status-${reservation.status}`"
            >
              <div class="reservation-header">
                <div class="reservation-info">
                  <h3 class="client-name">{{ reservation.clientName }}</h3>
                  <p class="reservation-date">
                    {{ formatDate(reservation.date) }} à {{ reservation.time }}
                  </p>
                  <p class="party-size">{{ reservation.partySize }} personnes</p>
                </div>
                <div class="status-badge" :class="`status-${reservation.status}`">
                  {{ getStatusLabel(reservation.status) }}
                </div>
              </div>

              <div class="reservation-details">
                <div class="detail-row">
                  <span class="detail-label">Email :</span>
                  <span class="detail-value">{{ reservation.clientEmail }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Téléphone :</span>
                  <span class="detail-value">{{ reservation.clientPhone }}</span>
                </div>
                <div v-if="reservation.specialRequests" class="detail-row">
                  <span class="detail-label">Demandes spéciales :</span>
                  <span class="detail-value">{{ reservation.specialRequests }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Numéro de réservation :</span>
                  <span class="detail-value">#{{ reservation.id }}</span>
                </div>
              </div>

              <div class="reservation-actions">
                <button
                  v-if="reservation.status === 'pending'"
                  @click="confirmReservation(reservation.id)"
                  class="btn btn-success"
                >
                  Confirmer
                </button>
                <button
                  v-if="reservation.status === 'pending'"
                  @click="rejectReservation(reservation.id)"
                  class="btn btn-danger"
                >
                  Refuser
                </button>
                <button
                  v-if="reservation.status === 'confirmed'"
                  @click="completeReservation(reservation.id)"
                  class="btn btn-primary"
                >
                  Marquer comme terminée
                </button>
                <button
                  v-if="['pending', 'confirmed'].includes(reservation.status)"
                  @click="cancelReservation(reservation.id)"
                  class="btn btn-outline"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Confirmer l'action</h3>
        <p>{{ confirmModalMessage }}</p>
        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-outline">Annuler</button>
          <button @click="executeAction" class="btn" :class="confirmModalButtonClass">
            {{ confirmModalButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'RestaurantReservations',
  setup() {
    const loading = ref(false)
    const reservations = ref([])
    const selectedStatus = ref('')
    const selectedDate = ref('')
    const searchQuery = ref('')
    
    // Modal state
    const showConfirmModal = ref(false)
    const confirmModalMessage = ref('')
    const confirmModalButtonText = ref('')
    const confirmModalButtonClass = ref('')
    const pendingAction = ref(null)

    // Données de test
    const mockReservations = [
      {
        id: 1,
        clientName: 'Jean Dupont',
        clientEmail: 'jean.dupont@email.com',
        clientPhone: '01 23 45 67 89',
        date: '2024-01-15',
        time: '19:30',
        partySize: 4,
        status: 'pending',
        specialRequests: 'Table près de la fenêtre si possible'
      },
      {
        id: 2,
        clientName: 'Marie Martin',
        clientEmail: 'marie.martin@email.com',
        clientPhone: '01 98 76 54 32',
        date: '2024-01-15',
        time: '20:00',
        partySize: 2,
        status: 'confirmed',
        specialRequests: ''
      },
      {
        id: 3,
        clientName: 'Pierre Durand',
        clientEmail: 'pierre.durand@email.com',
        clientPhone: '01 11 22 33 44',
        date: '2024-01-16',
        time: '12:30',
        partySize: 6,
        status: 'pending',
        specialRequests: 'Allergie aux fruits de mer'
      }
    ]

    // Computed properties
    const filteredReservations = computed(() => {
      let filtered = reservations.value

      // Filtrer par statut
      if (selectedStatus.value) {
        filtered = filtered.filter(r => r.status === selectedStatus.value)
      }

      // Filtrer par date
      if (selectedDate.value) {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        filtered = filtered.filter(r => {
          const reservationDate = new Date(r.date)
          switch (selectedDate.value) {
            case 'today':
              return reservationDate.toDateString() === today.toDateString()
            case 'tomorrow':
              return reservationDate.toDateString() === tomorrow.toDateString()
            case 'week':
              const weekFromNow = new Date(today)
              weekFromNow.setDate(today.getDate() + 7)
              return reservationDate >= today && reservationDate <= weekFromNow
            case 'month':
              return reservationDate.getMonth() === today.getMonth() && 
                     reservationDate.getFullYear() === today.getFullYear()
            default:
              return true
          }
        })
      }

      // Filtrer par recherche
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(r => 
          r.clientName.toLowerCase().includes(query) ||
          r.clientEmail.toLowerCase().includes(query) ||
          r.clientPhone.includes(query)
        )
      }

      return filtered
    })

    const totalReservations = computed(() => reservations.value.length)
    const pendingReservations = computed(() => 
      reservations.value.filter(r => r.status === 'pending').length
    )
    const confirmedReservations = computed(() => 
      reservations.value.filter(r => r.status === 'confirmed').length
    )
    const todayReservations = computed(() => {
      const today = new Date().toDateString()
      return reservations.value.filter(r => 
        new Date(r.date).toDateString() === today
      ).length
    })

    // Methods
    const loadReservations = () => {
      loading.value = true
      
      // Charger les réservations depuis localStorage
      try {
        const storedReservations = localStorage.getItem('restaurantReservations')
        if (storedReservations) {
          const allReservations = JSON.parse(storedReservations)
          
          // Récupérer les données du restaurant connecté
          const currentRestaurant = JSON.parse(localStorage.getItem('currentRestaurant') || '{}')
          
          // Filtrer les réservations pour ce restaurant
          const restaurantReservations = allReservations.filter(reservation => 
            reservation.restaurant_name === currentRestaurant.restaurant_name
          )
          
          reservations.value = restaurantReservations.length > 0 ? restaurantReservations : mockReservations
        } else {
          reservations.value = mockReservations
        }
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err)
        reservations.value = mockReservations
      }
      
      loading.value = false
    }

    const refreshReservations = () => {
      loadReservations()
    }

    const clearFilters = () => {
      selectedStatus.value = ''
      selectedDate.value = ''
      searchQuery.value = ''
    }

    const getEmptyStateMessage = () => {
      if (selectedStatus.value || selectedDate.value || searchQuery.value) {
        return 'Aucune réservation ne correspond à vos critères de recherche.'
      }
      return 'Vous n\'avez pas encore reçu de réservations.'
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getStatusLabel = (status) => {
      const labels = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        cancelled: 'Annulée',
        completed: 'Terminée'
      }
      return labels[status] || status
    }

    const showConfirmModalAction = (action, reservationId, message, buttonText, buttonClass) => {
      pendingAction.value = { action, reservationId }
      confirmModalMessage.value = message
      confirmModalButtonText.value = buttonText
      confirmModalButtonClass.value = buttonClass
      showConfirmModal.value = true
    }

    const closeModal = () => {
      showConfirmModal.value = false
      pendingAction.value = null
    }

    const executeAction = () => {
      if (pendingAction.value) {
        const { action, reservationId } = pendingAction.value
        switch (action) {
          case 'confirm':
            confirmReservationAction(reservationId)
            break
          case 'reject':
            rejectReservationAction(reservationId)
            break
          case 'complete':
            completeReservationAction(reservationId)
            break
          case 'cancel':
            cancelReservationAction(reservationId)
            break
        }
      }
      closeModal()
    }

    const confirmReservation = (id) => {
      showConfirmModalAction(
        'confirm',
        id,
        'Êtes-vous sûr de vouloir confirmer cette réservation ?',
        'Confirmer',
        'btn-success'
      )
    }

    const confirmReservationAction = (id) => {
      const reservation = reservations.value.find(r => r.id === id)
      if (reservation) {
        reservation.status = 'confirmed'
        updateReservationInStorage(reservation)
      }
    }

    const rejectReservation = (id) => {
      showConfirmModalAction(
        'reject',
        id,
        'Êtes-vous sûr de vouloir refuser cette réservation ?',
        'Refuser',
        'btn-danger'
      )
    }

    const rejectReservationAction = (id) => {
      const reservation = reservations.value.find(r => r.id === id)
      if (reservation) {
        reservation.status = 'cancelled'
        updateReservationInStorage(reservation)
      }
    }

    const completeReservation = (id) => {
      showConfirmModalAction(
        'complete',
        id,
        'Marquer cette réservation comme terminée ?',
        'Terminer',
        'btn-primary'
      )
    }

    const completeReservationAction = (id) => {
      const reservation = reservations.value.find(r => r.id === id)
      if (reservation) {
        reservation.status = 'completed'
        updateReservationInStorage(reservation)
      }
    }

    const cancelReservation = (id) => {
      showConfirmModalAction(
        'cancel',
        id,
        'Êtes-vous sûr de vouloir annuler cette réservation ?',
        'Annuler',
        'btn-danger'
      )
    }

    const cancelReservationAction = (id) => {
      const reservation = reservations.value.find(r => r.id === id)
      if (reservation) {
        reservation.status = 'cancelled'
        updateReservationInStorage(reservation)
      }
    }

    const updateReservationInStorage = (updatedReservation) => {
      try {
        const storedReservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]')
        
        // Trouver et mettre à jour la réservation
        const index = storedReservations.findIndex(r => r.id === updatedReservation.id)
        if (index !== -1) {
          storedReservations[index] = updatedReservation
          localStorage.setItem('restaurantReservations', JSON.stringify(storedReservations))
          console.log('Réservation mise à jour:', updatedReservation)
        }
      } catch (err) {
        console.error('Erreur lors de la mise à jour de la réservation:', err)
      }
    }

    onMounted(() => {
      loadReservations()
    })

    return {
      loading,
      reservations,
      selectedStatus,
      selectedDate,
      searchQuery,
      filteredReservations,
      totalReservations,
      pendingReservations,
      confirmedReservations,
      todayReservations,
      showConfirmModal,
      confirmModalMessage,
      confirmModalButtonText,
      confirmModalButtonClass,
      refreshReservations,
      clearFilters,
      getEmptyStateMessage,
      formatDate,
      getStatusLabel,
      closeModal,
      executeAction,
      confirmReservation,
      rejectReservation,
      completeReservation,
      cancelReservation
    }
  }
}
</script>

<style scoped>
.restaurant-reservations {
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

.filters-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #5a6c7d;
  font-weight: 500;
}

.filters-row {
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.reservations-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  font-family: 'Playfair Display', serif;
}

.section-actions {
  display: flex;
  gap: 10px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #7f8c8d;
  margin: 0;
}

.reservations-grid {
  display: grid;
  gap: 20px;
}

.reservation-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s ease;
  background: white;
}

.reservation-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.reservation-card.status-pending {
  border-left: 4px solid #ffc107;
}

.reservation-card.status-confirmed {
  border-left: 4px solid #28a745;
}

.reservation-card.status-cancelled {
  border-left: 4px solid #dc3545;
}

.reservation-card.status-completed {
  border-left: 4px solid #6c757d;
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.client-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.reservation-date {
  color: #5a6c7d;
  margin: 0 0 5px 0;
  font-weight: 500;
}

.party-size {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.9rem;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.status-confirmed {
  background: #d4edda;
  color: #155724;
}

.status-badge.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.status-completed {
  background: #e2e3e5;
  color: #383d41;
}

.reservation-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #5a6c7d;
  font-size: 0.9rem;
}

.detail-value {
  color: #2c3e50;
  font-weight: 500;
}

.reservation-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: center;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn-icon {
  margin-right: 5px;
}

/* Modal */
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
  border-radius: 15px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.modal-content p {
  color: #5a6c7d;
  margin-bottom: 25px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .reservation-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .reservation-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 40px 0 30px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-section,
  .reservations-section {
    padding: 20px;
  }
}
</style>
