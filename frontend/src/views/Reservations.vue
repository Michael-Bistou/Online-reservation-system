<template>
  <div class="reservations-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">{{ $t('reservations.my_reservations') }}</h1>
            <p class="page-subtitle">{{ $t('reservations.subtitle') }}</p>
          </div>
          <div class="header-actions">
            <button @click="showNewReservationModal = true" class="btn-primary btn-new-reservation">
              <span class="btn-icon">➕</span>
              {{ $t('reservations.newReservation') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>{{ $t('reservations.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <h3>{{ $t('common.error') }}</h3>
          <p>{{ error }}</p>
          <button @click="loadReservations" class="btn-primary">
            {{ $t('common.retry') }}
          </button>
        </div>

        <!-- Reservations Content -->
        <div v-else>
          <!-- Filters and Stats -->
          <div class="filters-section">
            <div class="filters-row">
              <div class="filter-group">
                <label class="filter-label">{{ $t('reservations.status') }}</label>
                <select v-model="selectedStatus" class="filter-select" @change="handleFilter">
                  <option value="">{{ $t('common.all') }}</option>
                  <option value="confirmed">{{ $t('reservations.confirmed') }}</option>
                  <option value="pending">{{ $t('reservations.pending') }}</option>
                  <option value="completed">{{ $t('reservations.completed') }}</option>
                  <option value="cancelled">{{ $t('reservations.cancelled') }}</option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">{{ $t('common.date') }}</label>
                <select v-model="selectedDateFilter" class="filter-select" @change="handleFilter">
                  <option value="">{{ $t('common.all') }}</option>
                  <option value="upcoming">{{ $t('reservations.upcoming_reservations') }}</option>
                  <option value="past">{{ $t('reservations.past_reservations') }}</option>
                  <option value="today">{{ $t('common.today') }}</option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">{{ $t('common.search') }}</label>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="filter-input"
                  :placeholder="$t('reservations.search_placeholder')"
                  @input="handleSearch"
                />
              </div>
            </div>

            <!-- Stats Cards -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-content">
                  <div class="stat-number">{{ totalReservations }}</div>
                  <div class="stat-label">{{ $t('reservations.total_reservations') }}</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                  <div class="stat-number">{{ confirmedReservations }}</div>
                  <div class="stat-label">{{ $t('reservations.confirmed_reservations') }}</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">⏳</div>
                <div class="stat-content">
                  <div class="stat-number">{{ pendingReservations }}</div>
                  <div class="stat-label">{{ $t('reservations.pending_reservations') }}</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🎉</div>
                <div class="stat-content">
                  <div class="stat-number">{{ completedReservations }}</div>
                  <div class="stat-label">{{ $t('reservations.completed_reservations') }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reservations List -->
          <div class="reservations-section">
            <div v-if="filteredReservations.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <h3>{{ $t('reservations.noReservations') }}</h3>
              <p>{{ $t('reservations.noReservationsText') }}</p>
              <button @click="showNewReservationModal = true" class="btn-primary">
                {{ $t('reservations.createFirst') }}
              </button>
            </div>

            <div v-else class="reservations-grid">
              <div
                v-for="reservation in filteredReservations"
                :key="reservation.id"
                class="reservation-card"
                :class="`status-${reservation.status}`"
              >
                <!-- Restaurant Info -->
                <div class="reservation-header">
                  <div class="restaurant-info">
                    <h3 class="restaurant-name">{{ reservation.restaurant_name }}</h3>
                    <div class="reservation-meta">
                      <span class="reservation-date">
                        📅 {{ formatDate(reservation.date) }}
                      </span>
                      <span class="reservation-time">
                        🕐 {{ reservation.time }}
                      </span>
                      <span class="party-size">
                        👥 {{ reservation.party_size }} {{ reservation.party_size === 1 ? 'personne' : 'personnes' }}
                      </span>
                    </div>
                  </div>
                  <div class="status-badge" :class="`status-${reservation.status}`">
                    {{ getStatusText(reservation.status) }}
                  </div>
                </div>

                <!-- Reservation Details -->
                <div class="reservation-details">
                  <div class="detail-row">
                    <span class="detail-label">{{ $t('reservations.reservation_id') }}:</span>
                    <span class="detail-value">#{{ reservation.id }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">{{ $t('reservations.table_number') }}:</span>
                    <span class="detail-value">{{ reservation.table_number || 'À confirmer' }}</span>
                  </div>
                  <div v-if="reservation.special_requests" class="detail-row">
                    <span class="detail-label">{{ $t('reservations.special_requests') }}:</span>
                    <span class="detail-value">{{ reservation.special_requests }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="reservation-actions">
                  <button @click="viewRestaurant(reservation.restaurant_id)" class="btn-outline btn-sm">
                    {{ $t('reservations.viewRestaurant') }}
                  </button>
                  <button v-if="canModify(reservation)" @click="editReservation(reservation)" class="btn-outline btn-sm">
                    {{ $t('reservations.modify') }}
                  </button>
                  <button v-if="canCancel(reservation)" @click="cancelReservation(reservation)" class="btn-danger btn-sm">
                    {{ $t('reservations.cancel') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Reservation Modal -->
    <div v-if="showNewReservationModal" class="modal-overlay" @click="showNewReservationModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('reservations.newReservation') }}</h3>
          <button @click="showNewReservationModal = false" class="modal-close">×</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="createNewReservation" class="reservation-form">
            <!-- Restaurant Selection -->
            <div class="form-group">
              <label class="form-label">{{ $t('reservations.restaurant') }}</label>
              <select v-model="newReservation.restaurant_id" class="form-input" required>
                <option value="">{{ $t('common.select') }}</option>
                <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant.id">
                  {{ restaurant.name }} - {{ restaurant.cuisine_type }}
                </option>
              </select>
            </div>

            <!-- Date -->
            <div class="form-group">
              <label class="form-label">{{ $t('reservations.reservation_date') }}</label>
              <input
                v-model="newReservation.date"
                type="date"
                class="form-input"
                :min="today"
                required
              />
            </div>

            <!-- Time -->
            <div class="form-group">
              <label class="form-label">{{ $t('reservations.reservation_time') }}</label>
              <select v-model="newReservation.time" class="form-input" required>
                <option value="">{{ $t('common.select') }}</option>
                <option value="12:00">12:00</option>
                <option value="12:30">12:30</option>
                <option value="13:00">13:00</option>
                <option value="13:30">13:30</option>
                <option value="19:00">19:00</option>
                <option value="19:30">19:30</option>
                <option value="20:00">20:00</option>
                <option value="20:30">20:30</option>
                <option value="21:00">21:00</option>
                <option value="21:30">21:30</option>
              </select>
            </div>

            <!-- Party Size -->
            <div class="form-group">
              <label class="form-label">{{ $t('reservations.party_size') }}</label>
              <select v-model="newReservation.party_size" class="form-input" required>
                <option value="">{{ $t('common.select') }}</option>
                <option v-for="i in 10" :key="i" :value="i">{{ i }} {{ i === 1 ? 'personne' : 'personnes' }}</option>
              </select>
            </div>

            <!-- Special Requests -->
            <div class="form-group">
              <label class="form-label">{{ $t('reservations.special_requests') }}</label>
              <textarea
                v-model="newReservation.special_requests"
                class="form-input"
                rows="3"
                :placeholder="$t('reservations.special_requests_placeholder')"
              ></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showNewReservationModal = false" class="btn-outline">
                {{ $t('common.cancel') }}
              </button>
              <button type="submit" class="btn-primary" :disabled="submitting">
                <span v-if="submitting" class="loading-spinner-small"></span>
                {{ submitting ? $t('common.submitting') : $t('reservations.create_reservation') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div v-if="showCancelModal" class="modal-overlay" @click="showCancelModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('reservations.confirm_cancellation') }}</h3>
          <button @click="showCancelModal = false" class="modal-close">×</button>
        </div>
        
        <div class="modal-body">
          <p>{{ $t('reservations.cancel_confirmation_message') }}</p>
          <div class="modal-actions">
            <button @click="showCancelModal = false" class="btn-outline">
              {{ $t('common.cancel') }}
            </button>
            <button @click="confirmCancel" class="btn-danger" :disabled="submitting">
              <span v-if="submitting" class="loading-spinner-small"></span>
              {{ submitting ? $t('common.submitting') : $t('reservations.confirm_cancellation') }}
            </button>
          </div>
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
    const { t } = useI18n()
    
    // Reactive data
    const reservations = ref([])
    const restaurants = ref([])
    const loading = ref(true)
    const error = ref(null)
    const submitting = ref(false)
    
    // Filters
    const selectedStatus = ref('')
    const selectedDateFilter = ref('')
    const searchQuery = ref('')
    
    // Modals
    const showNewReservationModal = ref(false)
    const showCancelModal = ref(false)
    const reservationToCancel = ref(null)
    
    // New reservation form
    const newReservation = ref({
      restaurant_id: '',
      date: '',
      time: '',
      party_size: '',
      special_requests: ''
    })

    // Computed properties
    const today = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const filteredReservations = computed(() => {
      let filtered = reservations.value

      // Filter by status
      if (selectedStatus.value) {
        filtered = filtered.filter(r => r.status === selectedStatus.value)
      }

      // Filter by date
      if (selectedDateFilter.value) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        filtered = filtered.filter(r => {
          const reservationDate = new Date(r.date)
          reservationDate.setHours(0, 0, 0, 0)
          
          switch (selectedDateFilter.value) {
            case 'upcoming':
              return reservationDate >= today
            case 'past':
              return reservationDate < today
            case 'today':
              return reservationDate.getTime() === today.getTime()
            default:
              return true
          }
        })
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(r => 
          r.restaurant_name.toLowerCase().includes(query) ||
          r.special_requests?.toLowerCase().includes(query)
        )
      }

      return filtered
    })

    const totalReservations = computed(() => reservations.value.length)
    const confirmedReservations = computed(() => reservations.value.filter(r => r.status === 'confirmed').length)
    const pendingReservations = computed(() => reservations.value.filter(r => r.status === 'pending').length)
    const completedReservations = computed(() => reservations.value.filter(r => r.status === 'completed').length)

    // Methods
    const loadReservations = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Try to get from API first
        try {
          const response = await axios.get('http://localhost:5000/api/reservations')
          reservations.value = response.data.reservations
        } catch (apiError) {
          // Fallback to sample data
          reservations.value = getSampleReservations()
        }
        
        // Load restaurants for new reservation form
        restaurants.value = getSampleRestaurants()
        
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err)
        error.value = t('reservations.load_error')
      } finally {
        loading.value = false
      }
    }

    const getSampleReservations = () => {
      return [
        {
          id: 1,
          restaurant_id: 1,
          restaurant_name: "Le Petit Bistrot",
          date: "2024-01-15",
          time: "19:30",
          party_size: 4,
          status: "confirmed",
          table_number: "12",
          special_requests: "Table près de la fenêtre si possible",
          created_at: "2024-01-10T10:30:00Z"
        },
        {
          id: 2,
          restaurant_id: 2,
          restaurant_name: "Sakura Sushi",
          date: "2024-01-20",
          time: "20:00",
          party_size: 2,
          status: "pending",
          table_number: null,
          special_requests: "Allergie aux fruits de mer",
          created_at: "2024-01-12T14:20:00Z"
        },
        {
          id: 3,
          restaurant_id: 5,
          restaurant_name: "Le Grand Restaurant",
          date: "2024-01-08",
          time: "19:00",
          party_size: 6,
          status: "completed",
          table_number: "8",
          special_requests: "Anniversaire - gâteau surprise",
          created_at: "2024-01-05T16:45:00Z"
        },
        {
          id: 4,
          restaurant_id: 3,
          restaurant_name: "Trattoria Bella",
          date: "2024-01-25",
          time: "12:30",
          party_size: 3,
          status: "confirmed",
          table_number: "15",
          special_requests: "",
          created_at: "2024-01-15T09:15:00Z"
        },
        {
          id: 5,
          restaurant_id: 7,
          restaurant_name: "Bamboo Palace",
          date: "2024-01-05",
          time: "19:00",
          party_size: 2,
          status: "cancelled",
          table_number: "5",
          special_requests: "",
          created_at: "2024-01-02T11:30:00Z"
        }
      ]
    }

    const getSampleRestaurants = () => {
      return [
        { id: 1, name: "Le Petit Bistrot", cuisine_type: "Française" },
        { id: 2, name: "Sakura Sushi", cuisine_type: "Japonaise" },
        { id: 3, name: "Trattoria Bella", cuisine_type: "Italienne" },
        { id: 4, name: "Spice Garden", cuisine_type: "Indienne" },
        { id: 5, name: "Le Grand Restaurant", cuisine_type: "Française" },
        { id: 6, name: "Taco Loco", cuisine_type: "Mexicaine" },
        { id: 7, name: "Bamboo Palace", cuisine_type: "Chinoise" },
        { id: 8, name: "Ouzeri Athina", cuisine_type: "Grecque" },
        { id: 9, name: "Tapas Barcelona", cuisine_type: "Espagnole" },
        { id: 10, name: "Siam Garden", cuisine_type: "Thaï" }
      ]
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

    const getStatusText = (status) => {
      const statusMap = {
        'pending': t('reservations.pending'),
        'confirmed': t('reservations.confirmed'),
        'completed': t('reservations.completed'),
        'cancelled': t('reservations.cancelled')
      }
      return statusMap[status] || status
    }

    const canModify = (reservation) => {
      const reservationDate = new Date(reservation.date)
      const today = new Date()
      return reservation.status === 'pending' || reservation.status === 'confirmed' && reservationDate > today
    }

    const canCancel = (reservation) => {
      const reservationDate = new Date(reservation.date)
      const today = new Date()
      return reservation.status === 'pending' || reservation.status === 'confirmed' && reservationDate > today
    }

    const handleFilter = () => {
      // Filtering is handled by computed property
    }

    const handleSearch = () => {
      // Search is handled by computed property
    }

    const viewRestaurant = (restaurantId) => {
      router.push(`/restaurants/${restaurantId}`)
    }

    const editReservation = (reservation) => {
      // For now, redirect to restaurant details to make a new reservation
      router.push(`/restaurants/${reservation.restaurant_id}`)
    }

    const cancelReservation = (reservation) => {
      reservationToCancel.value = reservation
      showCancelModal.value = true
    }

    const confirmCancel = async () => {
      try {
        submitting.value = true
        
        // For now, just update the status locally
        const reservation = reservations.value.find(r => r.id === reservationToCancel.value.id)
        if (reservation) {
          reservation.status = 'cancelled'
        }
        
        showCancelModal.value = false
        reservationToCancel.value = null
        
        // Show success message
        alert(t('reservations.reservation_cancelled'))
        
      } catch (err) {
        console.error('Erreur lors de l\'annulation:', err)
        alert(t('reservations.cancel_error'))
      } finally {
        submitting.value = false
      }
    }

    const createNewReservation = async () => {
      try {
        submitting.value = true
        
        // Validate form
        if (!newReservation.value.restaurant_id || !newReservation.value.date || 
            !newReservation.value.time || !newReservation.value.party_size) {
          alert(t('common.please_fill_all_fields'))
          return
        }

        // Create new reservation
        const restaurant = restaurants.value.find(r => r.id === parseInt(newReservation.value.restaurant_id))
        const newReservationData = {
          id: Date.now(), // Generate unique ID
          restaurant_id: parseInt(newReservation.value.restaurant_id),
          restaurant_name: restaurant.name,
          date: newReservation.value.date,
          time: newReservation.value.time,
          party_size: parseInt(newReservation.value.party_size),
          status: 'pending',
          table_number: null,
          special_requests: newReservation.value.special_requests,
          created_at: new Date().toISOString()
        }

        // Add to reservations list
        reservations.value.unshift(newReservationData)
        
        // Reset form
        newReservation.value = {
          restaurant_id: '',
          date: '',
          time: '',
          party_size: '',
          special_requests: ''
        }
        
        showNewReservationModal.value = false
        
        // Show success message
        alert(t('reservations.reservation_created'))
        
      } catch (err) {
        console.error('Erreur lors de la création de la réservation:', err)
        alert(t('reservations.reservation_error'))
      } finally {
        submitting.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      loadReservations()
    })

    return {
      reservations,
      restaurants,
      loading,
      error,
      submitting,
      selectedStatus,
      selectedDateFilter,
      searchQuery,
      showNewReservationModal,
      showCancelModal,
      reservationToCancel,
      newReservation,
      today,
      filteredReservations,
      totalReservations,
      confirmedReservations,
      pendingReservations,
      completedReservations,
      loadReservations,
      formatDate,
      getStatusText,
      canModify,
      canCancel,
      handleFilter,
      handleSearch,
      viewRestaurant,
      editReservation,
      cancelReservation,
      confirmCancel,
      createNewReservation
    }
  }
}
</script>

<style scoped>
.reservations-page {
  min-height: 100vh;
  background: var(--surface-color);
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  color: white;
  padding: 60px 0 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.btn-new-reservation {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 25px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  transition: all 0.3s ease;
}

.btn-new-reservation:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Main Content */
.main-content {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Loading & Error States */
.loading-container,
.error-container {
  text-align: center;
  padding: 100px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.filter-select,
.filter-input {
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: var(--surface-color);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.stat-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 5px;
}

/* Reservations Section */
.reservations-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
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
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 30px;
}

/* Reservations Grid */
.reservations-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reservation-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s ease;
  background: white;
}

.reservation-card:hover {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.reservation-card.status-pending {
  border-left: 4px solid #f59e0b;
}

.reservation-card.status-confirmed {
  border-left: 4px solid #10b981;
}

.reservation-card.status-completed {
  border-left: 4px solid #3b82f6;
}

.reservation-card.status-cancelled {
  border-left: 4px solid #ef4444;
  opacity: 0.7;
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.restaurant-name {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.reservation-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-confirmed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-completed {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.reservation-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: var(--text-primary);
}

.detail-value {
  color: var(--text-secondary);
}

.reservation-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-danger {
  background: #ef4444;
  border: 2px solid #ef4444;
  color: white;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #dc2626;
  border-color: #dc2626;
}

/* Modal Styles */
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 30px;
}

.reservation-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-input {
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.modal-actions .btn-outline,
.modal-actions .btn-primary,
.modal-actions .btn-danger {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .filters-row {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .reservation-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .reservation-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .reservation-actions {
    justify-content: center;
  }
  
  .modal-content {
    margin: 20px;
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
  
  .reservation-card {
    padding: 20px;
  }
  
  .modal-header,
  .modal-body {
    padding: 20px;
  }
}
</style>
