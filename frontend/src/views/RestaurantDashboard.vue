<template>
  <div class="restaurant-dashboard">
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
                <div class="stat-number">0</div>
                <div class="stat-label">Réservations aujourd'hui</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">Réservations en attente</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ restaurant?.capacity || 0 }}</div>
                <div class="stat-label">Capacité totale</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">Réservations confirmées</div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="dashboard-card">
            <h3 class="card-title">Actions rapides</h3>
            <div class="actions-grid">
              <button class="action-btn">
                <span class="action-icon">📅</span>
                <span class="action-text">Gérer les réservations</span>
              </button>
              <button class="action-btn">
                <span class="action-icon">⚙️</span>
                <span class="action-text">Modifier le profil</span>
              </button>
              <button class="action-btn">
                <span class="action-icon">📊</span>
                <span class="action-text">Voir les statistiques</span>
              </button>
              <button class="action-btn">
                <span class="action-icon">📝</span>
                <span class="action-text">Gérer le menu</span>
              </button>
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
        </div>

        <!-- Bouton de déconnexion -->
        <div class="logout-section">
          <button @click="logout" class="btn btn-outline">
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RestaurantDashboard',
  setup() {
    const router = useRouter()
    const restaurant = ref(null)

    onMounted(() => {
      // Vérifier si le restaurant est connecté
      const isLoggedIn = localStorage.getItem('restaurantLoggedIn')
      if (!isLoggedIn) {
        router.push('/restaurant-login')
        return
      }

      // Récupérer les données du restaurant
      const restaurantData = localStorage.getItem('currentRestaurant')
      if (restaurantData) {
        restaurant.value = JSON.parse(restaurantData)
      }
    })

    const logout = () => {
      localStorage.removeItem('restaurantLoggedIn')
      localStorage.removeItem('currentRestaurant')
      router.push('/restaurant-login')
    }

    return {
      restaurant,
      logout
    }
  }
}
</script>

<style scoped>
.restaurant-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
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

.logout-section {
  text-align: center;
  margin-top: 40px;
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: center;
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
