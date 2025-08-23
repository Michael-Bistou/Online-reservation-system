<template>
  <div class="restaurants-page">
    <!-- Hero Section -->
    <div class="restaurants-hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('restaurants.restaurants') }}</h1>
        <p class="hero-subtitle">{{ $t('restaurants.restaurant_list') }}</p>
      </div>
    </div>

    <!-- Search and Filters Section -->
    <div class="search-section">
      <div class="container">
        <div class="search-filters">
          <!-- Search Bar -->
          <div class="search-bar">
            <div class="search-input-wrapper">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('restaurants.search_restaurants')"
                class="search-input"
                @input="handleSearch"
              />
              <div class="search-icon">🔍</div>
            </div>
          </div>

          <!-- Filters -->
          <div class="filters">
            <select v-model="selectedCuisine" class="filter-select" @change="handleFilter">
              <option value="">{{ $t('restaurants.cuisine_types') }}</option>
              <option value="française">Française</option>
              <option value="italienne">Italienne</option>
              <option value="japonaise">Japonaise</option>
              <option value="chinoise">Chinoise</option>
              <option value="mexicaine">Mexicaine</option>
              <option value="indienne">Indienne</option>
              <option value="thai">Thaï</option>
              <option value="libanaise">Libanaise</option>
              <option value="grecque">Grecque</option>
              <option value="espagnole">Espagnole</option>
            </select>

            <select v-model="selectedPriceRange" class="filter-select" @change="handleFilter">
              <option value="">{{ $t('restaurants.price_range') }}</option>
              <option value="€">€ (Économique)</option>
              <option value="€€">€€ (Modéré)</option>
              <option value="€€€">€€€ (Élevé)</option>
              <option value="€€€€">€€€€ (Luxe)</option>
            </select>

            <select v-model="selectedRating" class="filter-select" @change="handleFilter">
              <option value="">{{ $t('restaurants.rating') }}</option>
              <option value="4.5">4.5+ ⭐</option>
              <option value="4.0">4.0+ ⭐</option>
              <option value="3.5">3.5+ ⭐</option>
              <option value="3.0">3.0+ ⭐</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Restaurants List -->
    <div class="restaurants-section">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>{{ $t('common.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <h3>{{ $t('common.error') }}</h3>
          <p>{{ error }}</p>
          <button @click="loadRestaurants" class="btn-primary">
            {{ $t('common.retry') }}
          </button>
        </div>

        <!-- Restaurants Grid -->
        <div v-else-if="filteredRestaurants.length > 0" class="restaurants-grid">
          <div
            v-for="restaurant in filteredRestaurants"
            :key="restaurant.id"
            class="restaurant-card"
            @click="viewRestaurant(restaurant)"
          >
            <!-- Restaurant Image -->
            <div class="restaurant-image">
              <img
                :src="restaurant.image || '/img/restaurants/placeholder.jpg'"
                :alt="restaurant.name"
                class="restaurant-img"
              />
              <div class="restaurant-overlay">
                <div class="restaurant-badges">
                  <span v-if="restaurant.is_featured" class="badge badge-featured">
                    {{ $t('restaurants.featured_restaurant') }}
                  </span>
                  <span v-if="restaurant.is_popular" class="badge badge-popular">
                    {{ $t('restaurants.popular_restaurant') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Restaurant Info -->
            <div class="restaurant-info">
              <div class="restaurant-header">
                <h3 class="restaurant-name">{{ restaurant.name }}</h3>
                <div class="restaurant-rating">
                  <span class="rating-stars">
                    {{ '⭐'.repeat(Math.floor(restaurant.rating || 0)) }}
                  </span>
                  <span class="rating-number">{{ restaurant.rating || 0 }}/5</span>
                </div>
              </div>

              <div class="restaurant-details">
                <p class="restaurant-cuisine">{{ restaurant.cuisine_type }}</p>
                <p class="restaurant-price">{{ restaurant.price_range }}</p>
                <p class="restaurant-address">{{ restaurant.address }}</p>
              </div>

              <div class="restaurant-amenities">
                <span v-if="restaurant.has_parking" class="amenity">🚗</span>
                <span v-if="restaurant.has_wifi" class="amenity">📶</span>
                <span v-if="restaurant.has_outdoor_seating" class="amenity">🌳</span>
                <span v-if="restaurant.is_wheelchair_accessible" class="amenity">♿</span>
              </div>

              <div class="restaurant-actions">
                <button class="btn-primary btn-reserve">
                  {{ $t('restaurants.make_reservation') }}
                </button>
                <button class="btn-outline btn-details">
                  {{ $t('common.details') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="no-results">
          <div class="no-results-icon">🍽️</div>
          <h3>{{ $t('restaurants.no_restaurants_found') }}</h3>
          <p>{{ $t('restaurants.try_different_filters') }}</p>
          <button @click="clearFilters" class="btn-primary">
            {{ $t('common.clear_filters') }}
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
  name: 'Restaurants',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    
    // Reactive data
    const restaurants = ref([])
    const loading = ref(true)
    const error = ref(null)
    const searchQuery = ref('')
    const selectedCuisine = ref('')
    const selectedPriceRange = ref('')
    const selectedRating = ref('')

    // Computed properties
    const filteredRestaurants = computed(() => {
      let filtered = restaurants.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(restaurant =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisine_type.toLowerCase().includes(query) ||
          restaurant.address.toLowerCase().includes(query)
        )
      }

      // Cuisine filter
      if (selectedCuisine.value) {
        filtered = filtered.filter(restaurant =>
          restaurant.cuisine_type.toLowerCase() === selectedCuisine.value.toLowerCase()
        )
      }

      // Price range filter
      if (selectedPriceRange.value) {
        filtered = filtered.filter(restaurant =>
          restaurant.price_range === selectedPriceRange.value
        )
      }

      // Rating filter
      if (selectedRating.value) {
        const minRating = parseFloat(selectedRating.value)
        filtered = filtered.filter(restaurant =>
          (restaurant.rating || 0) >= minRating
        )
      }

      return filtered
    })

    // Methods
    const loadRestaurants = async () => {
      try {
        loading.value = true
        error.value = null
        
        const response = await axios.get('http://localhost:5000/api/restaurants')
        restaurants.value = response.data.restaurants || []
        
        // If no restaurants in database, add sample data
        if (restaurants.value.length === 0) {
          restaurants.value = getSampleRestaurants()
        }
      } catch (err) {
        console.error('Erreur lors du chargement des restaurants:', err)
        error.value = t('restaurants.load_error')
        // Use sample data as fallback
        restaurants.value = getSampleRestaurants()
      } finally {
        loading.value = false
      }
    }

    const getSampleRestaurants = () => {
      return [
        {
          id: 1,
          name: "Le Petit Bistrot",
          cuisine_type: "Française",
          address: "123 Rue de la Paix, Paris",
          phone: "01 23 45 67 89",
          email: "contact@petitbistrot.fr",
          description: "Authentique cuisine française dans un cadre chaleureux",
          price_range: "€€",
          rating: 4.5,
          opening_hours: "Lun-Sam: 12h-14h30, 19h-22h30",
          capacity: 50,
          has_parking: true,
          has_wifi: true,
          has_outdoor_seating: false,
          is_wheelchair_accessible: true,
          is_featured: true,
          is_popular: true
        },
        {
          id: 2,
          name: "Sakura Sushi",
          cuisine_type: "Japonaise",
          address: "456 Avenue des Champs, Paris",
          phone: "01 98 76 54 32",
          email: "info@sakurasushi.fr",
          description: "Sushi frais et authentique dans un décor zen",
          price_range: "€€€",
          rating: 4.8,
          opening_hours: "Mar-Dim: 12h-14h, 19h-23h",
          capacity: 30,
          has_parking: false,
          has_wifi: true,
          has_outdoor_seating: true,
          is_wheelchair_accessible: false,
          is_featured: false,
          is_popular: true
        },
        {
          id: 3,
          name: "Trattoria Bella",
          cuisine_type: "Italienne",
          address: "789 Boulevard Saint-Germain, Paris",
          phone: "01 11 22 33 44",
          email: "reservation@trattoriabella.fr",
          description: "Pâtes et pizzas traditionnelles italiennes",
          price_range: "€€",
          rating: 4.2,
          opening_hours: "Lun-Dim: 12h-15h, 19h-23h",
          capacity: 80,
          has_parking: true,
          has_wifi: true,
          has_outdoor_seating: true,
          is_wheelchair_accessible: true,
          is_featured: false,
          is_popular: false
        },
        {
          id: 4,
          name: "Spice Garden",
          cuisine_type: "Indienne",
          address: "321 Rue du Commerce, Paris",
          phone: "01 55 66 77 88",
          email: "hello@spicegarden.fr",
          description: "Cuisine indienne épicée et colorée",
          price_range: "€€",
          rating: 4.0,
          opening_hours: "Mar-Dim: 12h-14h30, 19h-22h30",
          capacity: 60,
          has_parking: false,
          has_wifi: true,
          has_outdoor_seating: false,
          is_wheelchair_accessible: true,
          is_featured: false,
          is_popular: false
        },
        {
          id: 5,
          name: "Le Grand Restaurant",
          cuisine_type: "Française",
          address: "654 Champs-Élysées, Paris",
          phone: "01 99 88 77 66",
          email: "contact@legrandrestaurant.fr",
          description: "Gastronomie française de luxe",
          price_range: "€€€€",
          rating: 4.9,
          opening_hours: "Mar-Sam: 19h-23h",
          capacity: 40,
          has_parking: true,
          has_wifi: true,
          has_outdoor_seating: true,
          is_wheelchair_accessible: true,
          is_featured: true,
          is_popular: true
        },
        {
          id: 6,
          name: "Taco Loco",
          cuisine_type: "Mexicaine",
          address: "987 Rue de Rivoli, Paris",
          phone: "01 44 55 66 77",
          email: "hola@tacoloco.fr",
          description: "Tacos authentiques et margaritas",
          price_range: "€",
          rating: 3.8,
          opening_hours: "Lun-Dim: 11h30-23h",
          capacity: 45,
          has_parking: false,
          has_wifi: true,
          has_outdoor_seating: true,
          is_wheelchair_accessible: false,
          is_featured: false,
          is_popular: false
        }
      ]
    }

    const handleSearch = () => {
      // Search is handled by computed property
    }

    const handleFilter = () => {
      // Filtering is handled by computed property
    }

    const clearFilters = () => {
      searchQuery.value = ''
      selectedCuisine.value = ''
      selectedPriceRange.value = ''
      selectedRating.value = ''
    }

    const viewRestaurant = (restaurant) => {
      // Navigate to restaurant details page
      router.push(`/restaurants/${restaurant.id}`)
    }

    // Lifecycle
    onMounted(() => {
      loadRestaurants()
    })

    return {
      restaurants,
      loading,
      error,
      searchQuery,
      selectedCuisine,
      selectedPriceRange,
      selectedRating,
      filteredRestaurants,
      loadRestaurants,
      handleSearch,
      handleFilter,
      clearFilters,
      viewRestaurant
    }
  }
}
</script>

<style scoped>
.restaurants-page {
  min-height: 100vh;
  background: var(--surface-color);
}

/* Hero Section */
.restaurants-hero {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  padding: 80px 0;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

/* Search Section */
.search-section {
  background: white;
  padding: 40px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-filters {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-bar {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 15px 50px 15px 20px;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--text-muted);
}

.filters {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 20px;
  border: 2px solid var(--border-color);
  border-radius: 25px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

/* Restaurants Section */
.restaurants-section {
  padding: 60px 0;
}

.loading-container,
.error-container,
.no-results {
  text-align: center;
  padding: 60px 20px;
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

.error-icon,
.no-results-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

/* Restaurant Card */
.restaurant-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
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
  transition: transform 0.3s ease;
}

.restaurant-card:hover .restaurant-img {
  transform: scale(1.05);
}

.restaurant-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3));
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 15px;
}

.restaurant-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-featured {
  background: var(--primary-color);
  color: white;
}

.badge-popular {
  background: var(--success-color);
  color: white;
}

.restaurant-info {
  padding: 25px;
}

.restaurant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.restaurant-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  font-family: 'Playfair Display', serif;
}

.restaurant-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rating-stars {
  font-size: 0.9rem;
}

.rating-number {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

.restaurant-details {
  margin-bottom: 20px;
}

.restaurant-cuisine {
  color: var(--primary-color);
  font-weight: 600;
  margin: 0 0 5px 0;
  font-size: 0.9rem;
}

.restaurant-price {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0 0 5px 0;
}

.restaurant-address {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
}

.restaurant-amenities {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.amenity {
  font-size: 1.2rem;
  opacity: 0.7;
}

.restaurant-actions {
  display: flex;
  gap: 10px;
}

.btn-reserve,
.btn-details {
  flex: 1;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-reserve {
  background: var(--primary-color);
  color: white;
}

.btn-reserve:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

.btn-details {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-details:hover {
  background: var(--primary-color);
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .search-filters {
    gap: 15px;
  }
  
  .filters {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-select {
    width: 100%;
    max-width: 300px;
  }
  
  .restaurants-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .restaurant-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .restaurants-hero {
    padding: 60px 0;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .search-section {
    padding: 30px 0;
  }
  
  .restaurants-section {
    padding: 40px 0;
  }
  
  .restaurant-info {
    padding: 20px;
  }
  
  .restaurant-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
