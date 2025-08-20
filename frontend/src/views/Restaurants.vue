<template>
  <div class="restaurants-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Restaurants</h1>
        <p class="page-subtitle">Découvrez nos restaurants partenaires</p>
      </div>

      <!-- Filtres et recherche -->
      <div class="filters-section">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher un restaurant..."
            class="search-input"
            @input="handleSearch"
          />
          <button @click="handleSearch" class="search-btn">
            🔍
          </button>
        </div>

        <div class="filters">
          <select v-model="selectedCuisine" @change="handleFilter" class="filter-select">
            <option value="">Tous les types de cuisine</option>
            <option v-for="cuisine in cuisineTypes" :key="cuisine" :value="cuisine">
              {{ cuisine }}
            </option>
          </select>

          <select v-model="sortBy" @change="handleSort" class="filter-select">
            <option value="name">Trier par nom</option>
            <option value="rating">Trier par note</option>
            <option value="price">Trier par prix</option>
          </select>
        </div>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Chargement des restaurants...</p>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadRestaurants" class="btn btn-primary">
          Réessayer
        </button>
      </div>

      <!-- Liste des restaurants -->
      <div v-else class="restaurants-grid">
        <div
          v-for="restaurant in filteredRestaurants"
          :key="restaurant.id"
          class="restaurant-card"
          @click="viewRestaurant(restaurant)"
        >
          <div class="restaurant-image">
            <img
              :src="restaurant.image_url || '/img/restaurant-placeholder.jpg'"
              :alt="restaurant.name"
              class="restaurant-img"
            />
            <div class="restaurant-rating">
              ⭐ {{ restaurant.rating || 'N/A' }}
            </div>
          </div>

          <div class="restaurant-info">
            <h3 class="restaurant-name">{{ restaurant.name }}</h3>
            <p class="restaurant-cuisine">{{ restaurant.cuisine_type }}</p>
            <p class="restaurant-description">{{ restaurant.description }}</p>
            
            <div class="restaurant-details">
              <span class="restaurant-price">
                {{ getPriceRange(restaurant.price_range) }}
              </span>
              <span class="restaurant-location">
                📍 {{ restaurant.address }}
              </span>
            </div>

            <div class="restaurant-actions">
              <button @click.stop="viewRestaurant(restaurant)" class="btn btn-primary">
                Voir détails
              </button>
              <button @click.stop="makeReservation(restaurant)" class="btn btn-outline">
                Réserver
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun restaurant -->
      <div v-if="!loading && !error && filteredRestaurants.length === 0" class="no-results">
        <p>Aucun restaurant trouvé pour votre recherche.</p>
        <button @click="clearFilters" class="btn btn-primary">
          Effacer les filtres
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Restaurants',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref('')
    const restaurants = ref([])
    const cuisineTypes = ref([])
    
    const searchQuery = ref('')
    const selectedCuisine = ref('')
    const sortBy = ref('name')

    // Charger les restaurants
    const loadRestaurants = async () => {
      loading.value = true
      error.value = ''

      try {
        const response = await axios.get('http://localhost:3000/api/restaurants')
        restaurants.value = response.data
      } catch (err) {
        console.error('Erreur lors du chargement des restaurants:', err)
        error.value = 'Erreur lors du chargement des restaurants'
      } finally {
        loading.value = false
      }
    }

    // Charger les types de cuisine
    const loadCuisineTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/restaurants/cuisine-types')
        cuisineTypes.value = response.data
      } catch (err) {
        console.error('Erreur lors du chargement des types de cuisine:', err)
      }
    }

    // Recherche
    const handleSearch = () => {
      // La recherche se fait automatiquement via computed
    }

    // Filtrage
    const handleFilter = () => {
      // Le filtrage se fait automatiquement via computed
    }

    // Tri
    const handleSort = () => {
      // Le tri se fait automatiquement via computed
    }

    // Filtrer et trier les restaurants
    const filteredRestaurants = computed(() => {
      let filtered = [...restaurants.value]

      // Filtre par recherche
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(restaurant =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.description.toLowerCase().includes(query) ||
          restaurant.cuisine_type.toLowerCase().includes(query)
        )
      }

      // Filtre par type de cuisine
      if (selectedCuisine.value) {
        filtered = filtered.filter(restaurant =>
          restaurant.cuisine_type === selectedCuisine.value
        )
      }

      // Tri
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0)
          case 'price':
            return (a.price_range || 0) - (b.price_range || 0)
          default:
            return a.name.localeCompare(b.name)
        }
      })

      return filtered
    })

    // Utilitaires
    const getPriceRange = (priceRange) => {
      const prices = ['€', '€€', '€€€', '€€€€']
      return prices[priceRange - 1] || '€€'
    }

    const viewRestaurant = (restaurant) => {
      // Pour l'instant, on affiche juste les détails dans la console
      console.log('Voir restaurant:', restaurant)
      // TODO: Créer une page de détails du restaurant
    }

    const makeReservation = (restaurant) => {
      // Rediriger vers la page de réservation
      router.push(`/reservations/new?restaurant_id=${restaurant.id}`)
    }

    const clearFilters = () => {
      searchQuery.value = ''
      selectedCuisine.value = ''
      sortBy.value = 'name'
    }

    // Charger les données au montage
    onMounted(() => {
      loadRestaurants()
      loadCuisineTypes()
    })

    return {
      loading,
      error,
      restaurants,
      cuisineTypes,
      searchQuery,
      selectedCuisine,
      sortBy,
      filteredRestaurants,
      loadRestaurants,
      handleSearch,
      handleFilter,
      handleSort,
      getPriceRange,
      viewRestaurant,
      makeReservation,
      clearFilters
    }
  }
}
</script>

<style scoped>
.restaurants-page {
  padding: 2rem 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
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
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px 0 0 8px;
  font-size: 1rem;
}

.search-btn {
  padding: 0.75rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
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

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.restaurant-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.restaurant-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.restaurant-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.restaurant-info {
  padding: 1.5rem;
}

.restaurant-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.restaurant-cuisine {
  color: #007bff;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.restaurant-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.restaurant-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.restaurant-price {
  font-weight: bold;
  color: #28a745;
}

.restaurant-location {
  color: #666;
}

.restaurant-actions {
  display: flex;
  gap: 0.5rem;
}

.restaurant-actions .btn {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.875rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .restaurants-grid {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .restaurant-actions {
    flex-direction: column;
  }
}
</style>
