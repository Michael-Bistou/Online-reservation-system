<template>
  <div class="restaurant-dashboard">
    <!-- Barre de navigation restaurant -->
    <div class="restaurant-nav">
      <div class="container">
        <div class="nav-content">
          <div class="nav-brand">
            <router-link to="/restaurant-dashboard" class="nav-logo">
              🏪 Dashboard Restaurant
            </router-link>
          </div>
          <div class="nav-links">
            <router-link to="/restaurant-dashboard" class="nav-link active">
              📊 Dashboard
            </router-link>
            <router-link to="/restaurant-reservations" class="nav-link">
              📅 Réservations
            </router-link>
            <router-link to="/restaurant-stats" class="nav-link">
              📈 Statistiques
            </router-link>
            <router-link to="/restaurant-menu" class="nav-link">
              📝 Menu
            </router-link>
            <router-link to="/restaurant-profile" class="nav-link">
              ⚙️ Profil
            </router-link>
          </div>
          <div class="nav-actions">
            <router-link to="/" class="btn btn-outline btn-sm">
              🏠 Site Principal
            </router-link>
            <button @click="logout" class="btn btn-outline btn-sm">
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-header">
      <div class="container">
        <h1 class="dashboard-title">Dashboard Restaurant</h1>
        <p class="dashboard-subtitle">Bienvenue, {{ restaurant?.restaurant_name || 'Restaurant' }}</p>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="container">
        <div class="dashboard-grid">
          <!-- Informations du restaurant -->
          <div class="dashboard-card">
            <h3 class="card-title">Informations du restaurant</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Nom :</span>
                <span class="info-value">{{ restaurant?.restaurant_name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Type de cuisine :</span>
                <span class="info-value">{{ restaurant?.cuisine_type }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Gamme de prix :</span>
                <span class="info-value">{{ restaurant?.price_range }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Adresse :</span>
                <span class="info-value">{{ restaurant?.address }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Téléphone :</span>
                <span class="info-value">{{ restaurant?.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email :</span>
                <span class="info-value">{{ restaurant?.email }}</span>
              </div>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="dashboard-card">
            <h3 class="card-title">Statistiques</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">{{ todayReservations }}</div>
                <div class="stat-label">Réservations aujourd'hui</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ pendingReservations }}</div>
                <div class="stat-label">Réservations en attente</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ restaurant?.capacity || 0 }}</div>
                <div class="stat-label">Capacité totale</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ confirmedReservations }}</div>
                <div class="stat-label">Réservations confirmées</div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="dashboard-card">
            <h3 class="card-title">Actions rapides</h3>
            <div class="actions-grid">
              <router-link to="/restaurant-reservations" class="action-btn">
                <span class="action-icon">📅</span>
                <span class="action-text">Gérer les réservations</span>
              </router-link>
              <router-link to="/restaurant-profile" class="action-btn">
                <span class="action-icon">⚙️</span>
                <span class="action-text">Modifier le profil</span>
              </router-link>
                        <router-link to="/restaurant-stats" class="action-btn">
            <span class="action-icon">📊</span>
            <span class="action-text">Voir les statistiques</span>
          </router-link>
          <router-link to="/restaurant-menu" class="action-btn">
            <span class="action-icon">📝</span>
            <span class="action-text">Gérer le menu</span>
          </router-link>
            </div>
          </div>

          <!-- Horaires et équipements -->
          <div class="dashboard-card">
            <h3 class="card-title">Horaires et équipements</h3>
            <div class="info-section">
              <h4>Horaires d'ouverture</h4>
              <p class="opening-hours">{{ restaurant?.opening_hours || 'Non renseigné' }}</p>
            </div>
            <div class="info-section">
              <h4>Équipements disponibles</h4>
              <div class="amenities-list">
                <span v-if="restaurant?.has_parking" class="amenity-tag">🚗 Parking</span>
                <span v-if="restaurant?.has_wifi" class="amenity-tag">📶 Wi-Fi</span>
                <span v-if="restaurant?.has_outdoor_seating" class="amenity-tag">🌳 Terrasse</span>
                <span v-if="restaurant?.is_wheelchair_accessible" class="amenity-tag">♿ Accessible PMR</span>
                <span v-if="!restaurant?.has_parking && !restaurant?.has_wifi && !restaurant?.has_outdoor_seating && !restaurant?.is_wheelchair_accessible" class="no-amenities">
                  Aucun équipement renseigné
                </span>
              </div>
            </div>
          </div>

          <!-- Emails reçus -->
          <div class="dashboard-card">
            <h3 class="card-title">📧 Emails reçus</h3>
            <div v-if="restaurantEmails.length === 0" class="empty-state">
              <div class="empty-icon">📧</div>
              <p>Aucun email reçu</p>
              <small>Les emails de nouvelles réservations apparaîtront ici.</small>
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
                  Voir tous les emails ({{ restaurantEmails.length }})
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
import { ref, onMounted, onActivated, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RestaurantDashboard',
  setup() {
    const router = useRouter()
    const restaurant = ref(null)
    const todayReservations = ref(0)
    const pendingReservations = ref(0)
    const confirmedReservations = ref(0)
    const restaurantEmails = ref([])

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
      getEmailTypeLabel,
      formatEmailDate,
      truncateEmailContent,
      calculateStats,
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
</style>
