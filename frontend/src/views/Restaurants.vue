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
                          <option value="">Type de cuisine</option>
                          <option value="Française">Française</option>
                          <option value="Italienne">Italienne</option>
                          <option value="Japonaise">Japonaise</option>
                          <option value="Chinoise">Chinoise</option>
                          <option value="Mexicaine">Mexicaine</option>
                          <option value="Indienne">Indienne</option>
                          <option value="Thaï">Thaï</option>
                          <option value="Grecque">Grecque</option>
                          <option value="Espagnole">Espagnole</option>
                        </select>

            <select v-model="selectedPriceRange" class="filter-select" @change="handleFilter">
              <option value="">Gamme de prix</option>
              <option value="€">Économique (€)</option>
              <option value="€€">Modérée (€€)</option>
              <option value="€€€">Élevée (€€€)</option>
              <option value="€€€€">Luxe (€€€€)</option>
            </select>

            <select v-model="selectedRating" class="filter-select" @change="handleFilter">
              <option value="">Note minimum</option>
              <option value="4.5">4.5 étoiles et plus</option>
              <option value="4.0">4.0 étoiles et plus</option>
              <option value="3.5">3.5 étoiles et plus</option>
              <option value="3.0">3.0 étoiles et plus</option>
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
                  <span v-if="restaurant.review_count" class="review-count">({{ restaurant.review_count }} avis)</span>
                </div>
              </div>

              <div class="restaurant-details">
                <p class="restaurant-cuisine">{{ translateCuisineType(restaurant.cuisine_type) }}</p>
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
                <button @click.stop="viewRestaurant(restaurant)" class="btn-outline btn-details">
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

export default {
  name: 'Restaurants',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    
    // Function to translate cuisine types
    const translateCuisineType = (cuisineType) => {
      const cuisineMap = {
        'Française': 'french',
        'Italienne': 'italian',
        'Japonaise': 'japanese',
        'Chinoise': 'chinese',
        'Mexicaine': 'mexican',
        'Indienne': 'indian',
        'Thaï': 'thai',
        'Grecque': 'greek',
        'Espagnole': 'spanish'
      }
      
      const key = cuisineMap[cuisineType]
      return key ? t(`restaurants.cuisine_options.${key}`) : cuisineType
    }
    
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
        
        // Utiliser directement les restaurants du carrousel (données complètes)
        restaurants.value = getSampleRestaurants()
        
        // Charger les restaurants inscrits depuis localStorage
        const registeredRestaurants = getRegisteredRestaurants()
        
        // Ajouter les restaurants inscrits
        if (registeredRestaurants.length > 0) {
          restaurants.value = [...restaurants.value, ...registeredRestaurants]
        }
        
      } catch (err) {
        console.error('Erreur lors du chargement des restaurants:', err)
        error.value = t('restaurants.load_error')
        // Utiliser les données d'exemple en cas d'erreur
        restaurants.value = getSampleRestaurants()
      } finally {
        loading.value = false
      }
    }

    const getRegisteredRestaurants = () => {
      const restaurantData = localStorage.getItem('restaurantData')
      if (!restaurantData) return []
      
      try {
        const restaurant = JSON.parse(restaurantData)
        
        // Convertir le format du restaurant inscrit au format attendu
        return [{
          id: `registered_${Date.now()}`, // ID unique pour les restaurants inscrits
          name: restaurant.restaurant_name,
          cuisine_type: restaurant.cuisine_type,
          address: restaurant.address,
          phone: restaurant.phone,
          email: restaurant.email,
          description: restaurant.description || 'Restaurant inscrit sur notre plateforme',
          price_range: restaurant.price_range,
          rating: 0, // Pas encore d'avis
          review_count: 0,
          opening_hours: restaurant.opening_hours,
          capacity: restaurant.capacity,
          has_parking: restaurant.has_parking,
          has_wifi: restaurant.has_wifi,
          has_outdoor_seating: restaurant.has_outdoor_seating,
          is_wheelchair_accessible: restaurant.is_wheelchair_accessible,
          is_featured: false,
          is_popular: false,
          is_registered: true, // Marquer comme restaurant inscrit
          website: restaurant.website
        }]
      } catch (err) {
        console.error('Erreur lors du parsing des données restaurant:', err)
        return []
      }
    }

                    const getSampleRestaurants = () => {
                  return [
                    {
                      id: 1,
                      name: "Le Petit Bistrot",
                      cuisine_type: "Française",
                      address: "123 Rue de la Paix, 75001 Paris",
                      phone: "01 42 86 17 18",
                      email: "contact@lepetitbistrot.fr",
                      description: "Un charmant bistrot français au cœur de Paris, proposant une cuisine traditionnelle française dans une ambiance chaleureuse et authentique. Notre chef prépare des plats avec des ingrédients frais et locaux.",
                      image: "/img/restaurants/french-bistrot.jpg",
                      price_range: "€€",
                      rating: 4.8,
                      review_count: 127,
                      opening_hours: "Lun-Sam: 12h-14h30, 19h-22h30 | Dim: 19h-22h",
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
                      address: "456 Avenue des Champs, 75008 Paris",
                      phone: "01 45 62 33 44",
                      email: "reservations@sakurasushi.fr",
                      description: "Restaurant japonais spécialisé dans les sushis et sashimis, offrant une expérience culinaire authentique du Japon avec des ingrédients frais et de qualité. Notre chef maître sushi prépare chaque plat avec précision.",
                      image: "/img/restaurants/japanese-sushi.jpg",
                      price_range: "€€€",
                      rating: 4.9,
                      review_count: 89,
                      opening_hours: "Lun-Sam: 11h30-14h, 18h-22h | Dim: 18h-21h",
                      capacity: 30,
                      has_parking: false,
                      has_wifi: true,
                      has_outdoor_seating: true,
                      is_wheelchair_accessible: false,
                      is_featured: true,
                      is_popular: true
                    },
                    {
                      id: 3,
                      name: "Trattoria Bella",
                      cuisine_type: "Italienne",
                      address: "789 Boulevard Saint-Germain, 75006 Paris",
                      phone: "01 43 25 67 89",
                      email: "info@trattoriabella.fr",
                      description: "Une trattoria italienne authentique où vous pourrez déguster des plats traditionnels italiens préparés avec des ingrédients frais et de qualité. Notre pizza est cuite au feu de bois et nos pâtes sont faites maison.",
                      image: "/img/restaurants/italian-trattoria.jpg",
                      price_range: "€€",
                      rating: 4.7,
                      review_count: 156,
                      opening_hours: "Mar-Dim: 12h-15h, 19h-23h | Lun: Fermé",
                      capacity: 80,
                      has_parking: true,
                      has_wifi: true,
                      has_outdoor_seating: true,
                      is_wheelchair_accessible: true,
                      is_featured: true,
                      is_popular: true
                    },
                    {
                      id: 4,
                      name: "Spice Garden",
                      cuisine_type: "Indienne",
                      address: "321 Rue du Commerce, 75015 Paris",
                      phone: "01 48 56 78 90",
                      email: "reservations@spicegarden.fr",
                      description: "Restaurant indien proposant une cuisine raffinée avec des épices authentiques et des plats traditionnels du nord et du sud de l'Inde. Nos currys sont préparés avec des épices fraîchement moulues.",
                      image: "/img/restaurants/indian-spice.jpg",
                      price_range: "€€",
                      rating: 4.0,
                      review_count: 94,
                      opening_hours: "Lun-Dim: 12h-15h, 19h-23h30",
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
                      address: "654 Champs-Élysées, 75008 Paris",
                      phone: "01 42 65 43 21",
                      email: "reservations@legrandrestaurant.fr",
                      description: "Restaurant gastronomique français de haute cuisine, proposant des plats raffinés et une expérience culinaire exceptionnelle. Notre chef étoilé crée des menus saisonniers d'exception.",
                      image: "/img/restaurants/french-luxury.jpg",
                      price_range: "€€€€",
                      rating: 4.9,
                      review_count: 203,
                      opening_hours: "Mar-Sam: 19h-22h30 | Dim-Lun: Fermé",
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
                      address: "987 Rue de Rivoli, 75001 Paris",
                      phone: "01 40 20 30 40",
                      email: "hola@tacoloco.fr",
                      description: "Restaurant mexicain authentique avec des saveurs épicées et des plats traditionnels comme les tacos, enchiladas et guacamole fait maison. Notre ambiance festive vous transporte au Mexique.",
                      image: "/img/restaurants/mexican-tacos.jpeg",
                      price_range: "€",
                      rating: 3.8,
                      review_count: 67,
                      opening_hours: "Mar-Dim: 12h-16h, 18h-23h | Lun: Fermé",
                      capacity: 45,
                      has_parking: false,
                      has_wifi: true,
                      has_outdoor_seating: true,
                      is_wheelchair_accessible: false,
                      is_featured: false,
                      is_popular: false
                    },
                    {
                      id: 7,
                      name: "Bamboo Palace",
                      cuisine_type: "Chinoise",
                      address: "147 Rue de la Roquette, 75011 Paris",
                      phone: "01 47 00 11 22",
                      email: "info@bamboopalace.fr",
                      description: "Restaurant chinois traditionnel proposant une large gamme de plats authentiques, des dim sum aux plats principaux en passant par les soupes. Notre cuisine reflète la diversité de la gastronomie chinoise.",
                      image: "/img/restaurants/chinese-bamboo.jpg",
                      price_range: "€€",
                      rating: 4.3,
                      review_count: 112,
                      opening_hours: "Lun-Dim: 11h-23h",
                      capacity: 70,
                      has_parking: true,
                      has_wifi: true,
                      has_outdoor_seating: false,
                      is_wheelchair_accessible: true,
                      is_featured: false,
                      is_popular: true
                    },
                    {
                      id: 8,
                      name: "Ouzeri Athina",
                      cuisine_type: "Grecque",
                      address: "258 Rue du Faubourg Saint-Antoine, 75012 Paris",
                      phone: "01 43 44 55 66",
                      email: "info@ouzeriathina.fr",
                      description: "Restaurant grec authentique avec des plats traditionnels, des vins grecs et une ambiance chaleureuse. Nos mezzés et nos plats de poisson frais vous feront voyager en Grèce.",
                      image: "/img/restaurants/greek-ouzeri.jpg",
                      price_range: "€€",
                      rating: 4.1,
                      review_count: 78,
                      opening_hours: "Lun-Dim: 12h-16h, 19h-23h30",
                      capacity: 55,
                      has_parking: false,
                      has_wifi: true,
                      has_outdoor_seating: true,
                      is_wheelchair_accessible: true,
                      is_featured: false,
                      is_popular: false
                    },
                    {
                      id: 9,
                      name: "Tapas Barcelona",
                      cuisine_type: "Espagnole",
                      address: "369 Avenue de la République, 75011 Paris",
                      phone: "01 48 05 06 07",
                      email: "hola@tapasbarcelona.fr",
                      description: "Restaurant espagnol authentique proposant une large sélection de tapas traditionnelles et des plats catalans. Notre paella et nos tapas vous feront découvrir les saveurs de l'Espagne.",
                      image: "/img/restaurants/spanish-tapas.jpg",
                      price_range: "€€",
                      rating: 4.4,
                      review_count: 145,
                      opening_hours: "Mar-Dim: 12h-15h, 19h-23h | Lun: Fermé",
                      capacity: 65,
                      has_parking: true,
                      has_wifi: true,
                      has_outdoor_seating: true,
                      is_wheelchair_accessible: true,
                      is_featured: false,
                      is_popular: true
                    },
                    {
                      id: 10,
                      name: "Siam Garden",
                      cuisine_type: "Thaï",
                      address: "741 Rue de Charonne, 75011 Paris",
                      phone: "01 43 67 89 01",
                      email: "hello@siamgarden.fr",
                      description: "Restaurant thaïlandais authentique avec des plats épicés et aromatiques, des currys traditionnels et des desserts exotiques. Notre cuisine vous fera découvrir les saveurs authentiques de la Thaïlande.",
                      image: "/img/restaurants/thai-siam.jpg",
                      price_range: "€€",
                      rating: 4.6,
                      review_count: 98,
                      opening_hours: "Lun-Dim: 11h-22h",
                      capacity: 50,
                      has_parking: false,
                      has_wifi: true,
                      has_outdoor_seating: false,
                      is_wheelchair_accessible: true,
                      is_featured: false,
                      is_popular: true
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
      console.log('Navigating to restaurant:', restaurant.id, restaurant.name)
      router.push(`/restaurants/${restaurant.id}`)
    }

    // Écouter les changements de langue
    const handleLanguageChange = () => {
      console.log('🌍 Langue changée, mise à jour de la page restaurants...')
      // Le composant se mettra à jour automatiquement grâce aux $t()
    }

    // Lifecycle
    onMounted(() => {
      loadRestaurants()
      window.addEventListener('languageChanged', handleLanguageChange)
    })

    onUnmounted(() => {
      window.removeEventListener('languageChanged', handleLanguageChange)
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
      translateCuisineType,
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
  color: white;
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
  display: flex;
  flex-direction: column;
  height: 500px;
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
  display: flex;
  flex-direction: column;
  flex: 1;
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
  color: #2c3e50;
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
  color: #7f8c8d;
  font-weight: 600;
}

.review-count {
  font-size: 0.75rem;
  color: #95a5a6;
  font-weight: 400;
}

.restaurant-details {
  margin-bottom: 20px;
}

.restaurant-cuisine {
  color: #d4af37;
  font-weight: 600;
  margin: 0 0 5px 0;
  font-size: 0.9rem;
}

.restaurant-price {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0 0 5px 0;
}

.restaurant-address {
  color: #5a6c7d;
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
  margin-top: auto;
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
  background: #d4af37;
  color: white;
  font-weight: 600;
}

.btn-reserve:hover {
  background: #b8941f;
  transform: translateY(-2px);
}

.btn-details {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
  font-weight: 600;
}

.btn-details:hover {
  background: #d4af37;
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
