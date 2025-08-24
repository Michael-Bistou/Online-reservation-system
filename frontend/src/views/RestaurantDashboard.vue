<template>
  <div class="restaurant-dashboard">
    <!-- Barre de navigation restaurant -->
    <div class="restaurant-nav">
      <div class="container">
        <div class="nav-content">
          <div class="nav-brand">
            <router-link to="/restaurant-dashboard" class="nav-logo">
              {{ $t('restaurant_dashboard.nav.dashboard') }}
            </router-link>
          </div>
          <div class="nav-links">
            <router-link to="/restaurant-dashboard" class="nav-link active">
              📊 {{ $t('restaurant_dashboard.nav.dashboard').replace('🏪 ', '') }}
            </router-link>
            <router-link to="/restaurant-reservations" class="nav-link">
              {{ $t('restaurant_dashboard.nav.reservations') }}
            </router-link>
            <router-link to="/restaurant-stats" class="nav-link">
              {{ $t('restaurant_dashboard.nav.statistics') }}
            </router-link>
            <router-link to="/restaurant-menu" class="nav-link">
              {{ $t('restaurant_dashboard.nav.menu') }}
            </router-link>
            <router-link to="/restaurant-profile" class="nav-link">
              {{ $t('restaurant_dashboard.nav.profile') }}
            </router-link>
          </div>
          <div class="nav-actions">
            <!-- Language Selector -->
            <div class="language-selector">
              <select v-model="currentLanguage" @change="changeLanguage" class="language-select">
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>
            <router-link to="/" class="btn btn-outline btn-sm">
              {{ $t('restaurant_dashboard.nav.main_site') }}
            </router-link>
            <button @click="logout" class="btn btn-outline btn-sm">
              {{ $t('restaurant_dashboard.nav.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-header">
      <div class="container">
        <h1 class="dashboard-title">{{ $t('restaurant_dashboard.header.title') }}</h1>
        <p class="dashboard-subtitle">{{ $t('restaurant_dashboard.header.welcome', { name: restaurant?.restaurant_name || 'Restaurant' }) }}</p>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="container">
        <div class="dashboard-grid">
          <!-- Informations du restaurant -->
          <div class="dashboard-card">
            <h3 class="card-title">{{ $t('restaurant_dashboard.restaurant_info.title') }}</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">{{ $t('restaurant_dashboard.restaurant_info.name') }} :</span>
                <span class="info-value">{{ restaurant?.restaurant_name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('restaurant_dashboard.restaurant_info.cuisine_type') }} :</span>
                <span class="info-value">{{ restaurant?.cuisine_type }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('restaurant_dashboard.restaurant_info.price_range') }} :</span>
                <span class="info-value">{{ restaurant?.price_range }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('restaurant_dashboard.restaurant_info.address') }} :</span>
                <span class="info-value">{{ restaurant?.address }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('restaurant_dashboard.restaurant_info.phone') }} :</span>
                <span class="info-value">{{ restaurant?.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('restaurant_dashboard.restaurant_info.email') }} :</span>
                <span class="info-value">{{ restaurant?.email }}</span>
              </div>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="dashboard-card">
            <h3 class="card-title">{{ $t('restaurant_dashboard.statistics.title') }}</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">{{ todayReservations }}</div>
                <div class="stat-label">{{ $t('restaurant_dashboard.statistics.today_reservations') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ pendingReservations }}</div>
                <div class="stat-label">{{ $t('restaurant_dashboard.statistics.pending_reservations') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ restaurant?.capacity || 0 }}</div>
                <div class="stat-label">{{ $t('restaurant_dashboard.statistics.total_capacity') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ confirmedReservations }}</div>
                <div class="stat-label">{{ $t('restaurant_dashboard.statistics.confirmed_reservations') }}</div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="dashboard-card">
            <h3 class="card-title">{{ $t('restaurant_dashboard.quick_actions.title') }}</h3>
            <div class="actions-grid">
              <router-link to="/restaurant-reservations" class="action-btn">
                <span class="action-icon">📅</span>
                <span class="action-text">{{ $t('restaurant_dashboard.quick_actions.manage_reservations') }}</span>
              </router-link>
              <router-link to="/restaurant-profile" class="action-btn">
                <span class="action-icon">⚙️</span>
                <span class="action-text">{{ $t('restaurant_dashboard.quick_actions.edit_profile') }}</span>
              </router-link>
                        <router-link to="/restaurant-stats" class="action-btn">
            <span class="action-icon">📊</span>
            <span class="action-text">{{ $t('restaurant_dashboard.quick_actions.view_statistics') }}</span>
          </router-link>
          <router-link to="/restaurant-menu" class="action-btn">
            <span class="action-icon">📝</span>
            <span class="action-text">{{ $t('restaurant_dashboard.quick_actions.manage_menu') }}</span>
          </router-link>
            </div>
          </div>

          <!-- Horaires et équipements -->
          <div class="dashboard-card">
            <h3 class="card-title">{{ $t('restaurant_dashboard.hours_amenities.title') }}</h3>
            <div class="info-section">
              <h4>{{ $t('restaurant_dashboard.hours_amenities.opening_hours') }}</h4>
              <p class="opening-hours">{{ restaurant?.opening_hours || $t('restaurant_dashboard.hours_amenities.not_specified') }}</p>
            </div>
            <div class="info-section">
              <h4>{{ $t('restaurant_dashboard.hours_amenities.available_amenities') }}</h4>
              <div class="amenities-list">
                <span v-if="restaurant?.has_parking" class="amenity-tag">{{ $t('restaurant_dashboard.hours_amenities.parking') }}</span>
                <span v-if="restaurant?.has_wifi" class="amenity-tag">{{ $t('restaurant_dashboard.hours_amenities.wifi') }}</span>
                <span v-if="restaurant?.has_outdoor_seating" class="amenity-tag">{{ $t('restaurant_dashboard.hours_amenities.outdoor_seating') }}</span>
                <span v-if="restaurant?.is_wheelchair_accessible" class="amenity-tag">{{ $t('restaurant_dashboard.hours_amenities.wheelchair_accessible') }}</span>
                <span v-if="!restaurant?.has_parking && !restaurant?.has_wifi && !restaurant?.has_outdoor_seating && !restaurant?.is_wheelchair_accessible" class="no-amenities">
                  {{ $t('restaurant_dashboard.hours_amenities.no_amenities') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Emails reçus -->
          <div class="dashboard-card">
            <h3 class="card-title">{{ $t('restaurant_dashboard.emails.title') }}</h3>
            <div v-if="restaurantEmails.length === 0" class="empty-state">
              <div class="empty-icon">📧</div>
              <p>{{ $t('restaurant_dashboard.emails.no_emails') }}</p>
              <small>{{ $t('restaurant_dashboard.emails.no_emails_text') }}</small>
            </div>
            
            <div v-else class="emails-list">
              <div 
                v-for="email in restaurantEmails.slice(0, 3)" 
                :key="email.id" 
                class="email-item"
              >
                <div class="email-header">
                  <div class="email-type" :class="`type-${email.type}`">
                    {{ getEmailTypeLabel(email.type) }}
                  </div>
                  <div class="email-date">
                    {{ formatEmailDate(email.timestamp) }}
                  </div>
                </div>
                
                <div class="email-content">
                  <div class="email-subject">
                    <strong>{{ email.subject }}</strong>
                  </div>
                  <div class="email-preview">
                    {{ truncateEmailContent(email.content) }}
                  </div>
                </div>
              </div>
              
              <div v-if="restaurantEmails.length > 3" class="view-more">
                <router-link to="/email-history" class="btn btn-outline btn-sm">
                  {{ $t('restaurant_dashboard.emails.view_all_emails', { count: restaurantEmails.length }) }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onActivated, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: 'RestaurantDashboard',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    
    // Function to handle language changes
    const handleLanguageChange = () => {
      // Force re-render when language changes
      nextTick(() => {
        // The component will automatically re-render with new translations
      })
    }
    
    // Reactive data
    const restaurant = ref(null)
    const todayReservations = ref(0)
    const pendingReservations = ref(0)
    const confirmedReservations = ref(0)
    const restaurantEmails = ref([])
    const currentLanguage = ref(localStorage.getItem('i18nextLng') || 'fr')

    const calculateStats = () => {
      try {
        // Récupérer toutes les réservations
        const allReservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]')
        
        // Récupérer le restaurant actuel
        const currentRestaurant = JSON.parse(localStorage.getItem('currentRestaurant') || '{}')
        const restaurantData = JSON.parse(localStorage.getItem('restaurantData') || '{}')
        
        // Utiliser le restaurant connecté ou les données du restaurant
        const restaurantName = currentRestaurant.restaurant_name || restaurantData.restaurant_name
        
        // Filtrer les réservations pour ce restaurant (comparaison insensible à la casse)
        const restaurantReservations = allReservations.filter(reservation => {
          const reservationName = reservation.restaurant_name?.trim().toLowerCase()
          const currentName = restaurantName?.trim().toLowerCase()
          return reservationName === currentName
        })

        // Calculer les statistiques
        const today = new Date()
        const todayString = today.toISOString().split('T')[0]
        
        console.log('🔍 Calcul des statistiques:')
        console.log('   - Date aujourd\'hui:', todayString)
        console.log('   - Nombre total de réservations:', restaurantReservations.length)
        console.log('   - Réservations pour ce restaurant:', restaurantReservations)
        
        todayReservations.value = restaurantReservations.filter(reservation => {
          // Normaliser la date de réservation pour la comparaison
          const reservationDate = new Date(reservation.date)
          const reservationDateString = reservationDate.toISOString().split('T')[0]
          
          const isToday = reservationDateString === todayString
          console.log(`   - Réservation ${reservation.id}: ${reservation.date} (${reservationDateString}) = ${isToday ? 'AUJOURD\'HUI' : 'pas aujourd\'hui'}`)
          
          // Comparer les dates normalisées
          return isToday
        }).length
        
        console.log('   - Réservations aujourd\'hui:', todayReservations.value)

        pendingReservations.value = restaurantReservations.filter(reservation => 
          reservation.status === 'pending'
        ).length

        confirmedReservations.value = restaurantReservations.filter(reservation => 
          reservation.status === 'confirmed'
        ).length

      } catch (error) {
        console.error('Erreur lors du calcul des statistiques:', error)
      }
    }

    const loadRestaurant = () => {
      try {
        const currentRestaurant = JSON.parse(localStorage.getItem('currentRestaurant') || '{}')
        const restaurantData = JSON.parse(localStorage.getItem('restaurantData') || '{}')
        
        restaurant.value = currentRestaurant.restaurant_name ? currentRestaurant : restaurantData
      } catch (error) {
        console.error('Erreur lors du chargement du restaurant:', error)
      }
    }

    const loadRestaurantEmails = () => {
      try {
        const allEmails = JSON.parse(localStorage.getItem('emailHistory') || '[]')
        const restaurantName = restaurant.value?.restaurant_name || ''
        
        // Filtrer les emails pour ce restaurant
        restaurantEmails.value = allEmails.filter(email => {
          const restaurantEmail = `${restaurantName.toLowerCase().replace(/\s+/g, '')}@example.com`
          return email.to === restaurantEmail
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      } catch (error) {
        console.error('Erreur lors du chargement des emails:', error)
        restaurantEmails.value = []
      }
    }

    const getEmailTypeLabel = (type) => {
      const labels = {
        confirmation: 'Confirmation',
        new_reservation: 'Nouvelle réservation',
        reminder: 'Rappel',
        cancellation: 'Annulation'
      }
      return labels[type] || type
    }

    const formatEmailDate = (timestamp) => {
      return new Date(timestamp).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const truncateEmailContent = (content) => {
      return content.length > 100 ? content.substring(0, 100) + '...' : content
    }

    // Language change function
    const changeLanguage = (event) => {
      const newLang = event.target.value
      localStorage.setItem('i18nextLng', newLang)
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: newLang } }))
      
      // Force page reload to apply language change
      window.location.reload()
    }

    onMounted(() => {
      // Vérifier si le restaurant est connecté
      const isLoggedIn = localStorage.getItem('restaurantLoggedIn')
      if (!isLoggedIn) {
        router.push('/restaurant-login')
        return
      }

      // Charger les données du restaurant
      loadRestaurant()
      
      // Charger les emails du restaurant
      loadRestaurantEmails()

      // Calculer les statistiques
      calculateStats()
      
      // Listen for language changes
      window.addEventListener('languageChanged', handleLanguageChange)
    })

    // Recalculer les statistiques quand on revient sur la page
    onActivated(() => {
      calculateStats()
      loadRestaurantEmails()
    })

    // Surveiller les changements dans localStorage pour recalculer les stats
    const handleStorageChange = (e) => {
      if (e.key === 'restaurantReservations') {
        console.log('🔄 Changement détecté dans les réservations, recalcul des stats...')
        calculateStats()
      }
    }

    // Ajouter l'écouteur d'événements
    window.addEventListener('storage', handleStorageChange)
    
    // Nettoyer l'écouteur lors de la destruction du composant
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange)
      // Clean up language change event listener
      window.removeEventListener('languageChanged', handleLanguageChange)
    })

    const logout = () => {
      localStorage.removeItem('restaurantLoggedIn')
      localStorage.removeItem('currentRestaurant')
      router.push('/restaurant-login')
    }

    return {
      restaurant,
      todayReservations,
      pendingReservations,
      confirmedReservations,
      restaurantEmails,
      currentLanguage,
      getEmailTypeLabel,
      formatEmailDate,
      truncateEmailContent,
      calculateStats,
      changeLanguage,
      logout
    }
  }
}
</script>

<style scoped>
.restaurant-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 80px;
}



.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0 40px;
  text-align: center;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
}

.dashboard-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.dashboard-content {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.dashboard-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
}



.info-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f1f3f4;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #5a6c7d;
  font-size: 0.9rem;
}

.info-value {
  color: #2c3e50;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item {
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

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: #2c3e50;
}

.action-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.5rem;
}

.action-text {
  font-weight: 500;
  text-align: center;
}

.info-section {
  margin-bottom: 25px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.opening-hours {
  color: #5a6c7d;
  line-height: 1.5;
  margin: 0;
}

.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.amenity-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.no-amenities {
  color: #7f8c8d;
  font-style: italic;
}

/* Styles pour les emails */
.empty-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.emails-list {
  max-height: 400px;
  overflow-y: auto;
}

.email-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  background: white;
  transition: all 0.3s ease;
}

.email-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.email-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.email-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.type-confirmation { background: #e3f2fd; color: #1976d2; }
.type-new_reservation { background: #f3e5f5; color: #7b1fa2; }
.type-reminder { background: #fff3e0; color: #f57c00; }
.type-cancellation { background: #ffebee; color: #d32f2f; }

.email-date {
  font-size: 0.8rem;
  color: #666;
}

.email-content {
  line-height: 1.4;
}

.email-subject {
  margin-bottom: 5px;
  color: #333;
}

.email-preview {
  color: #666;
  font-size: 0.9rem;
}

.view-more {
  text-align: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.logout-section {
  text-align: center;
  margin-top: 40px;
}



/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-title {
    font-size: 2rem;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 40px 0 30px;
  }
  
  .dashboard-title {
    font-size: 1.8rem;
  }
  
  .dashboard-content {
    padding: 30px 0;
  }
  
  .dashboard-card {
    padding: 20px;
  }
}

/* Navigation Styles */
.restaurant-nav {
  background: #2c3e50;
  padding: 15px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand .nav-logo {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: white;
}

.nav-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.language-selector {
  position: relative;
}

.language-select {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-select:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.language-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.15);
}

.language-select option {
  background: #333;
  color: white;
}

/* Responsive Navigation */
@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-links {
    gap: 15px;
  }
  
  .nav-actions {
    gap: 10px;
  }
  
  .language-select {
    font-size: 12px;
    padding: 6px 8px;
  }
}
</style>
