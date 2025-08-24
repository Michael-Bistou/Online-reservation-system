<template>
  <div class="restaurant-details-page">
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
      <button @click="loadRestaurant" class="btn-primary">
        {{ $t('common.retry') }}
      </button>
    </div>

    <!-- Restaurant Details -->
    <div v-else-if="restaurant" class="restaurant-content">
      <!-- Hero Section -->
      <div class="restaurant-hero">
        <div class="hero-background">
          <img
            :src="restaurant.image || '/img/restaurants/placeholder.jpg'"
            :alt="restaurant.name"
            class="hero-image"
          />
          <div class="hero-overlay"></div>
        </div>
        
        <div class="hero-content">
          <div class="container">
            <div class="hero-info">
              <div class="restaurant-badges">
                <span v-if="restaurant.is_featured" class="badge badge-featured">
                  {{ $t('restaurants.featured_restaurant') }}
                </span>
                <span v-if="restaurant.is_popular" class="badge badge-popular">
                  {{ $t('restaurants.popular_restaurant') }}
                </span>
              </div>
              
              <h1 class="restaurant-title">{{ restaurant.name }}</h1>
              
              <div class="restaurant-meta">
                <div class="rating-section">
                  <span class="rating-stars">
                    {{ '⭐'.repeat(Math.floor(restaurant.rating || 0)) }}
                  </span>
                  <span class="rating-number">{{ restaurant.rating || 0 }}/5</span>
                                      <span class="rating-count">({{ restaurant.review_count || 0 }} {{ $t('restaurants.reviews') }})</span>
                </div>
                
                <div class="cuisine-price">
                  <span class="cuisine-type">{{ translateCuisineType(restaurant.cuisine_type) }}</span>
                  <span class="price-range">{{ restaurant.price_range }}</span>
                </div>
              </div>
              
              <div class="restaurant-actions">
                <button @click="showReservationModal = true" class="btn-primary btn-reserve">
                  {{ $t('restaurants.make_reservation') }}
                </button>
                <button @click="scrollToDetails" class="btn-outline btn-details">
                  {{ $t('common.details') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content light-bg">
        <div class="container">
          <div class="content-grid">
            <!-- Left Column - Restaurant Info -->
            <div class="restaurant-info light-bg">
              <!-- Description -->
              <section class="info-section">
                <h2 class="section-title">{{ $t('restaurants.description') }}</h2>
                <p class="description">{{ getTranslatedDescription(restaurant) }}</p>
              </section>

              <!-- Contact & Location -->
              <section class="info-section">
                <h2 class="section-title">{{ $t('restaurants.location') }}</h2>
                <div class="contact-info">
                  <div class="contact-item">
                    <span class="contact-icon">📍</span>
                    <div class="contact-details">
                      <strong>{{ $t('restaurants.address') }}</strong>
                      <p>{{ restaurant.address }}</p>
                    </div>
                  </div>
                  
                  <div class="contact-item">
                    <span class="contact-icon">📞</span>
                    <div class="contact-details">
                      <strong>{{ $t('restaurants.phone') }}</strong>
                      <p>{{ restaurant.phone }}</p>
                    </div>
                  </div>
                  
                  <div class="contact-item">
                    <span class="contact-icon">📧</span>
                    <div class="contact-details">
                      <strong>{{ $t('restaurants.email') }}</strong>
                      <p>{{ restaurant.email }}</p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Opening Hours -->
              <section class="info-section">
                <h2 class="section-title">{{ $t('restaurants.opening_hours') }}</h2>
                <div class="opening-hours">
                  <p>{{ restaurant.opening_hours }}</p>
                </div>
              </section>

              <!-- Amenities -->
              <section class="info-section">
                <h2 class="section-title">{{ $t('restaurants.amenities') }}</h2>
                <div class="amenities-grid">
                  <div v-if="restaurant.has_parking" class="amenity-item">
                    <span class="amenity-icon">🚗</span>
                    <span class="amenity-text">{{ $t('restaurants.parking') }}</span>
                  </div>
                  <div v-if="restaurant.has_wifi" class="amenity-item">
                    <span class="amenity-icon">📶</span>
                    <span class="amenity-text">{{ $t('restaurants.wifi') }}</span>
                  </div>
                  <div v-if="restaurant.has_outdoor_seating" class="amenity-item">
                    <span class="amenity-icon">🌳</span>
                    <span class="amenity-text">{{ $t('restaurants.outdoor_seating') }}</span>
                  </div>
                  <div v-if="restaurant.is_wheelchair_accessible" class="amenity-item">
                    <span class="amenity-icon">♿</span>
                    <span class="amenity-text">{{ $t('restaurants.wheelchair_accessible') }}</span>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right Column - Reservation Form -->
            <div class="reservation-sidebar light-bg">
              <div class="reservation-card light-bg">
                <h3 class="reservation-title">{{ $t('restaurants.make_reservation') }}</h3>
                
                <form @submit.prevent="handleReservation" class="reservation-form">
                  <!-- Date -->
                  <div class="form-group">
                    <label class="form-label">{{ $t('reservations.reservation_date') }}</label>
                    <input
                      v-model="reservationData.date"
                      type="date"
                      class="form-input"
                      :min="today"
                      required
                    />
                  </div>

                  <!-- Time -->
                  <div class="form-group">
                    <label class="form-label">{{ $t('reservations.reservation_time') }}</label>
                    <select v-model="reservationData.time" class="form-input" required>
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
                    <select v-model="reservationData.partySize" class="form-input" required>
                      <option value="">{{ $t('common.select') }}</option>
                      <option v-for="i in 10" :key="i" :value="i">{{ i }} {{ i === 1 ? $t('restaurants.person') : $t('common.people') }}</option>
                    </select>
                  </div>

                  <!-- Special Requests -->
                  <div class="form-group">
                    <label class="form-label">{{ $t('reservations.special_requests') }}</label>
                    <textarea
                      v-model="reservationData.specialRequests"
                      class="form-input"
                      rows="3"
                      :placeholder="$t('reservations.special_requests_placeholder')"
                    ></textarea>
                  </div>

                  <!-- Submit Button -->
                  <button type="submit" class="btn-primary btn-submit" :disabled="submitting">
                    <span v-if="submitting" class="loading-spinner-small"></span>
                    {{ submitting ? $t('common.submitting') : $t('restaurants.make_reservation') }}
                  </button>
                </form>

                <!-- Restaurant Capacity Info -->
                <div class="capacity-info">
                  <p><strong>{{ $t('restaurants.capacity') }}:</strong> {{ restaurant.capacity }} {{ $t('common.people') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reservation Modal -->
    <div v-if="showReservationModal" class="modal-overlay" @click="showReservationModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('restaurants.make_reservation') }} - {{ restaurant?.name }}</h3>
          <button @click="showReservationModal = false" class="modal-close">×</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleReservation" class="reservation-form">
            <!-- Same form fields as sidebar -->
            <div class="form-group">
              <label class="form-label">{{ $t('reservations.reservation_date') }}</label>
              <input
                v-model="reservationData.date"
                type="date"
                class="form-input"
                :min="today"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('reservations.reservation_time') }}</label>
              <select v-model="reservationData.time" class="form-input" required>
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

            <div class="form-group">
              <label class="form-label">{{ $t('reservations.party_size') }}</label>
              <select v-model="reservationData.partySize" class="form-input" required>
                <option value="">{{ $t('common.select') }}</option>
                <option v-for="i in 10" :key="i" :value="i">{{ i }} {{ i === 1 ? $t('restaurants.person') : $t('common.people') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('reservations.special_requests') }}</label>
              <textarea
                v-model="reservationData.specialRequests"
                class="form-input"
                rows="3"
                :placeholder="$t('reservations.special_requests_placeholder')"
              ></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showReservationModal = false" class="btn-outline">
                {{ $t('common.cancel') }}
              </button>
              <button type="submit" class="btn-primary" :disabled="submitting">
                <span v-if="submitting" class="loading-spinner-small"></span>
                {{ submitting ? $t('common.submitting') : $t('payment.continue_to_payment') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de paiement -->
    <div v-if="showPaymentModal" class="modal-overlay payment-modal">
      <div class="modal-content payment-modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('payment.deposit_payment') }}</h3>
          <button @click="handlePaymentCancel" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div v-if="!currentReservation" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Chargement du formulaire de paiement...</p>
          </div>
          <PaymentForm
            v-else
            :reservation-id="currentReservation.id.toString()"
            :restaurant-name="currentReservation.restaurant_name"
            :restaurant-price-range="restaurant?.price_range || '€€'"
            :reservation-date="currentReservation.date"
            :reservation-time="currentReservation.time"
            :party-size="currentReservation.party_size"
            @success="handlePaymentSuccess"
            @cancel="handlePaymentCancel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import authService from '../services/auth.js'
import notificationService from '../services/notificationService.js'
import { validateReservation } from '../utils/validation.js'
import PaymentForm from '../components/PaymentForm.vue'

export default {
  name: 'RestaurantDetails',
  components: {
    PaymentForm
  },
  setup() {
    const route = useRoute()
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
    
    // Function to get translated description
    const getTranslatedDescription = (restaurant) => {
      if (!restaurant) return ''
      
      try {
        // Obtenir la langue actuelle depuis localStorage
        const currentLang = localStorage.getItem('i18nextLng') || 'fr'
        const descriptions = restaurant.descriptions || {}
        

        
        // Si on a une description traduite pour la langue actuelle, l'utiliser
        if (descriptions[currentLang]) {
          return descriptions[currentLang]
        }
        
        // Sinon, utiliser la description par défaut
        return restaurant.description || ''
      } catch (error) {
        console.error('Erreur dans getTranslatedDescription:', error)
        return restaurant.description || ''
      }
    }
    
    // Function to handle language changes
    const handleLanguageChange = () => {
      // Force re-render when language changes
      nextTick(() => {
        // The component will automatically re-render with new translations
      })
    }
    
    // Reactive data
    const restaurant = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const showReservationModal = ref(false)
    const showPaymentModal = ref(false)
    const submitting = ref(false)
    const currentReservation = ref(null)
    
    const reservationData = ref({
      date: '',
      time: '',
      partySize: '',
      specialRequests: ''
    })

    // Computed properties
    const today = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    // Methods
    const loadRestaurant = async () => {
      try {
        loading.value = true
        error.value = null
        
        const restaurantId = route.params.id
        
        // Vérifier si c'est un restaurant inscrit
        if (restaurantId.startsWith('registered_')) {
          restaurant.value = getRegisteredRestaurant()
        } else {
          // Utiliser directement les données du carrousel (données complètes)
          restaurant.value = getSampleRestaurant(restaurantId)
        }
        
        if (!restaurant.value) {
          error.value = t('restaurants.restaurant_not_found')
        }
      } catch (err) {
        console.error('Erreur lors du chargement du restaurant:', err)
        error.value = t('restaurants.load_error')
      } finally {
        loading.value = false
      }
    }

    const getRegisteredRestaurant = () => {
      const restaurantData = localStorage.getItem('restaurantData')
      if (!restaurantData) return null
      
      try {
        const data = JSON.parse(restaurantData)
        
        // Convertir au format attendu
        return {
          id: data.restaurant_name, // Utiliser le nom comme ID pour les notifications
          name: data.restaurant_name,
          cuisine_type: data.cuisine_type,
          address: data.address,
          phone: data.phone,
          email: data.email,
          description: data.description || 'Restaurant inscrit sur notre plateforme',
          price_range: data.price_range,
          rating: 0,
          review_count: 0,
          opening_hours: data.opening_hours,
          capacity: data.capacity,
          has_parking: data.has_parking,
          has_wifi: data.has_wifi,
          has_outdoor_seating: data.has_outdoor_seating,
          is_wheelchair_accessible: data.is_wheelchair_accessible,
          is_featured: false,
          is_popular: false,
          is_registered: true,
          website: data.website
        }
      } catch (err) {
        console.error('Erreur lors du parsing des données restaurant:', err)
        return null
      }
    }

    const getSampleRestaurant = (id) => {
      const sampleRestaurants = {
        '1': {
          id: 1,
          name: "Le Petit Bistrot",
          cuisine_type: "Française",
          address: "123 Rue de la Paix, 75001 Paris",
          phone: "01 42 86 17 18",
          email: "contact@lepetitbistrot.fr",
          description: "Un charmant bistrot français au cœur de Paris, proposant une cuisine traditionnelle française dans une ambiance chaleureuse et authentique. Notre chef prépare des plats avec des ingrédients frais et locaux.",
          descriptions: {
            fr: "Un charmant bistrot français au cœur de Paris, proposant une cuisine traditionnelle française dans une ambiance chaleureuse et authentique. Notre chef prépare des plats avec des ingrédients frais et locaux.",
            en: "A charming French bistro in the heart of Paris, offering traditional French cuisine in a warm and authentic atmosphere. Our chef prepares dishes with fresh, local ingredients."
          },
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
        '2': {
          id: 2,
          name: "Sakura Sushi",
          cuisine_type: "Japonaise",
          address: "456 Avenue des Champs, 75008 Paris",
          phone: "01 45 62 33 44",
          email: "reservations@sakurasushi.fr",
          description: "Restaurant japonais spécialisé dans les sushis et sashimis, offrant une expérience culinaire authentique du Japon avec des ingrédients frais et de qualité. Notre chef maître sushi prépare chaque plat avec précision.",
          descriptions: {
            fr: "Restaurant japonais spécialisé dans les sushis et sashimis, offrant une expérience culinaire authentique du Japon avec des ingrédients frais et de qualité. Notre chef maître sushi prépare chaque plat avec précision.",
            en: "Japanese restaurant specializing in sushi and sashimi, offering an authentic Japanese culinary experience with fresh, quality ingredients. Our master sushi chef prepares each dish with precision."
          },
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
        '3': {
          id: 3,
          name: "Trattoria Bella",
          cuisine_type: "Italienne",
          address: "789 Boulevard Saint-Germain, 75006 Paris",
          phone: "01 43 25 67 89",
          email: "info@trattoriabella.fr",
          description: "Une trattoria italienne authentique où vous pourrez déguster des plats traditionnels italiens préparés avec des ingrédients frais et de qualité. Notre pizza est cuite au feu de bois et nos pâtes sont faites maison.",
          descriptions: {
            fr: "Une trattoria italienne authentique où vous pourrez déguster des plats traditionnels italiens préparés avec des ingrédients frais et de qualité. Notre pizza est cuite au feu de bois et nos pâtes sont faites maison.",
            en: "An authentic Italian trattoria where you can enjoy traditional Italian dishes prepared with fresh, quality ingredients. Our pizza is wood-fired and our pasta is homemade."
          },
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
        '4': {
          id: 4,
          name: "Spice Garden",
          cuisine_type: "Indienne",
          address: "321 Rue du Commerce, 75015 Paris",
          phone: "01 48 56 78 90",
          email: "reservations@spicegarden.fr",
          description: "Restaurant indien proposant une cuisine raffinée avec des épices authentiques et des plats traditionnels du nord et du sud de l'Inde. Nos currys sont préparés avec des épices fraîchement moulues.",
          descriptions: {
            fr: "Restaurant indien proposant une cuisine raffinée avec des épices authentiques et des plats traditionnels du nord et du sud de l'Inde. Nos currys sont préparés avec des épices fraîchement moulues.",
            en: "Indian restaurant offering refined cuisine with authentic spices and traditional dishes from north and south India. Our curries are prepared with freshly ground spices."
          },
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
        '5': {
          id: 5,
          name: "Le Grand Restaurant",
          cuisine_type: "Française",
          address: "654 Champs-Élysées, 75008 Paris",
          phone: "01 42 65 43 21",
          email: "reservations@legrandrestaurant.fr",
          description: "Restaurant gastronomique français de haute cuisine, proposant des plats raffinés et une expérience culinaire exceptionnelle. Notre chef étoilé crée des menus saisonniers d'exception.",
          descriptions: {
            fr: "Restaurant gastronomique français de haute cuisine, proposant des plats raffinés et une expérience culinaire exceptionnelle. Notre chef étoilé crée des menus saisonniers d'exception.",
            en: "French gastronomic restaurant of haute cuisine, offering refined dishes and an exceptional culinary experience. Our starred chef creates exceptional seasonal menus."
          },
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
        '6': {
          id: 6,
          name: "Taco Loco",
          cuisine_type: "Mexicaine",
          address: "987 Rue de Rivoli, 75001 Paris",
          phone: "01 40 20 30 40",
          email: "hola@tacoloco.fr",
          description: "Restaurant mexicain authentique avec des saveurs épicées et des plats traditionnels comme les tacos, enchiladas et guacamole fait maison. Notre ambiance festive vous transporte au Mexique.",
          descriptions: {
            fr: "Restaurant mexicain authentique avec des saveurs épicées et des plats traditionnels comme les tacos, enchiladas et guacamole fait maison. Notre ambiance festive vous transporte au Mexique.",
            en: "Authentic Mexican restaurant with spicy flavors and traditional dishes like tacos, enchiladas and homemade guacamole. Our festive atmosphere transports you to Mexico."
          },
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
        '7': {
          id: 7,
          name: "Bamboo Palace",
          cuisine_type: "Chinoise",
          address: "147 Rue de la Roquette, 75011 Paris",
          phone: "01 47 00 11 22",
          email: "info@bamboopalace.fr",
          description: "Restaurant chinois traditionnel proposant une large gamme de plats authentiques, des dim sum aux plats principaux en passant par les soupes. Notre cuisine reflète la diversité de la gastronomie chinoise.",
          descriptions: {
            fr: "Restaurant chinois traditionnel proposant une large gamme de plats authentiques, des dim sum aux plats principaux en passant par les soupes. Notre cuisine reflète la diversité de la gastronomie chinoise.",
            en: "Traditional Chinese restaurant offering a wide range of authentic dishes, from dim sum to main courses and soups. Our cuisine reflects the diversity of Chinese gastronomy."
          },
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
        '8': {
          id: 8,
          name: "Ouzeri Athina",
          cuisine_type: "Grecque",
          address: "258 Rue du Faubourg Saint-Antoine, 75012 Paris",
          phone: "01 43 44 55 66",
          email: "info@ouzeriathina.fr",
          description: "Restaurant grec authentique avec des plats traditionnels, des vins grecs et une ambiance chaleureuse. Nos mezzés et nos plats de poisson frais vous feront voyager en Grèce.",
          descriptions: {
            fr: "Restaurant grec authentique avec des plats traditionnels, des vins grecs et une ambiance chaleureuse. Nos mezzés et nos plats de poisson frais vous feront voyager en Grèce.",
            en: "Authentic Greek restaurant with traditional dishes, Greek wines and a warm atmosphere. Our mezze and fresh fish dishes will take you to Greece."
          },
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
        '9': {
          id: 9,
          name: "Tapas Barcelona",
          cuisine_type: "Espagnole",
          address: "369 Avenue de la République, 75011 Paris",
          phone: "01 48 05 06 07",
          email: "hola@tapasbarcelona.fr",
          description: "Restaurant espagnol authentique proposant une large sélection de tapas traditionnelles et des plats catalans. Notre paella et nos tapas vous feront découvrir les saveurs de l'Espagne.",
          descriptions: {
            fr: "Restaurant espagnol authentique proposant une large sélection de tapas traditionnelles et des plats catalans. Notre paella et nos tapas vous feront découvrir les saveurs de l'Espagne.",
            en: "Authentic Spanish restaurant offering a wide selection of traditional tapas and Catalan dishes. Our paella and tapas will introduce you to the flavors of Spain."
          },
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
        '10': {
          id: 10,
          name: "Siam Garden",
          cuisine_type: "Thaï",
          address: "741 Rue de Charonne, 75011 Paris",
          phone: "01 43 67 89 01",
          email: "hello@siamgarden.fr",
          description: "Restaurant thaïlandais authentique avec des plats épicés et aromatiques, des currys traditionnels et des desserts exotiques. Notre cuisine vous fera découvrir les saveurs authentiques de la Thaïlande.",
          descriptions: {
            fr: "Restaurant thaïlandais authentique avec des plats épicés et aromatiques, des currys traditionnels et des desserts exotiques. Notre cuisine vous fera découvrir les saveurs authentiques de la Thaïlande.",
            en: "Authentic Thai restaurant with spicy and aromatic dishes, traditional curries and exotic desserts. Our cuisine will introduce you to the authentic flavors of Thailand."
          },
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
      }
      
      return sampleRestaurants[id] || null
    }

    const handleReservation = async () => {
      try {
        submitting.value = true
        
        // Validate form
        const validation = validateReservation({
          date: reservationData.value.date,
          time: reservationData.value.time,
          party_size: reservationData.value.partySize,
          special_requests: reservationData.value.specialRequests
        })

        if (!validation.isValid) {
          const errorMessages = Object.values(validation.errors).join('\n')
          alert(`Erreurs de validation:\n${errorMessages}`)
          return
        }

        // Récupérer les informations de l'utilisateur connecté
        if (!authService.isAuthenticated()) {
          alert('Vous devez être connecté pour faire une réservation')
          router.push('/login')
          return
        }

        const user = authService.getCurrentUser()
        if (!user) {
          alert('Erreur lors de la récupération des données utilisateur')
          router.push('/login')
          return
        }

        // Create reservation
        const reservation = {
          id: Date.now(), // ID unique
          restaurant_id: restaurant.value.id,
          restaurant_name: restaurant.value.name || restaurant.value.restaurant_name,
          price_range: restaurant.value.price_range || '€€', // Ajouter le price_range
          user_id: user.id || 'guest_user',
          user_name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username || 'Invité',
          user_email: user.email || 'invite@example.com',
          date: reservationData.value.date,
          time: reservationData.value.time,
          party_size: parseInt(reservationData.value.partySize),
          special_requests: reservationData.value.specialRequests,
          status: 'pending',
          table_number: null,
          created_at: new Date().toISOString()
        }

        // Stocker la réservation temporairement et passer au paiement
        currentReservation.value = reservation
        showReservationModal.value = false
        showPaymentModal.value = true
        
      } catch (err) {
        console.error('Erreur lors de la création de la réservation:', err)
        alert(t('reservations.reservation_error'))
      } finally {
        submitting.value = false
      }
    }

    // Gérer le succès du paiement
    const handlePaymentSuccess = (paymentResult) => {
      try {
        // Ajouter les informations de paiement à la réservation
        currentReservation.value.payment_id = paymentResult.transactionId
        currentReservation.value.payment_amount = paymentResult.amount
        currentReservation.value.status = 'confirmed' // Confirmer automatiquement après paiement

        // Sauvegarder la réservation dans localStorage
        saveReservation(currentReservation.value)

        // Envoyer des notifications par email
        notificationService.sendNewReservationEmailToRestaurant(currentReservation.value)
        notificationService.sendReservationConfirmationEmail(currentReservation.value)
        
        // Programmer un rappel automatique
        notificationService.scheduleReminder(currentReservation.value)

        // Show success message
        alert('Réservation confirmée ! Votre acompte a été prélevé avec succès.')
        
        // Reset form
        reservationData.value = {
          date: '',
          time: '',
          partySize: '',
          specialRequests: ''
        }
        
        showPaymentModal.value = false
        currentReservation.value = null
        
        // Redirect to reservations page
        router.push('/reservations')
        
      } catch (err) {
        console.error('Erreur lors de la finalisation de la réservation:', err)
        alert('Erreur lors de la finalisation de la réservation')
      }
    }

    // Annuler le paiement
    const handlePaymentCancel = () => {
      showPaymentModal.value = false
      currentReservation.value = null
      showReservationModal.value = true
    }

    const saveReservation = (reservation) => {
      try {
        // Récupérer les réservations existantes
        const existingReservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]')
        
        // Ajouter la nouvelle réservation
        existingReservations.push(reservation)
        
        // Sauvegarder
        localStorage.setItem('restaurantReservations', JSON.stringify(existingReservations))
        
        // Créer une notification pour le restaurant
        const restaurantName = restaurant.value.name || restaurant.value.restaurant_name
        const restaurantId = restaurant.value.id || restaurant.value.restaurant_name
        notificationService.createReservationNotification(reservation, restaurantName, restaurantId)
        


      } catch (err) {
        console.error('Erreur lors de la sauvegarde de la réservation:', err)
      }
    }

    const scrollToDetails = () => {
      const detailsSection = document.querySelector('.main-content')
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }

    // Lifecycle
    onMounted(() => {
      loadRestaurant()
      // Listen for language changes
      window.addEventListener('languageChanged', handleLanguageChange)
    })

    onUnmounted(() => {
      // Clean up event listener
      window.removeEventListener('languageChanged', handleLanguageChange)
    })

    return {
      restaurant,
      loading,
      error,
      showReservationModal,
      showPaymentModal,
      submitting,
      currentReservation,
      reservationData,
      today,
      translateCuisineType,
      getTranslatedDescription,
      loadRestaurant,
      handleReservation,
      handlePaymentSuccess,
      handlePaymentCancel,
      scrollToDetails
    }
  }
}
</script>

<style scoped>
.restaurant-details-page {
  min-height: 100vh;
  background: var(--surface-color);
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

/* Hero Section */
.restaurant-hero {
  position: relative;
  height: 60vh;
  min-height: 400px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-info {
  max-width: 600px;
}

.restaurant-badges {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
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

.restaurant-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
}

.restaurant-meta {
  margin-bottom: 30px;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.rating-stars {
  font-size: 1.2rem;
}

.rating-number {
  font-weight: 600;
  font-size: 1.1rem;
}

.rating-count {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.cuisine-price {
  display: flex;
  gap: 20px;
  font-size: 1.1rem;
}

.cuisine-type {
  color: var(--primary-color);
  font-weight: 600;
}

.price-range {
  color: var(--success-color);
  font-weight: 600;
}

.restaurant-actions {
  display: flex;
  gap: 15px;
}

.btn-reserve,
.btn-details {
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
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
  color: white;
  border: 2px solid white;
}

.btn-details:hover {
  background: white;
  color: var(--text-primary);
}

/* Main Content */
.main-content {
  padding: 60px 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

/* Restaurant Info */
.restaurant-info {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.info-section {
  margin-bottom: 40px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2c3e50;
  font-family: 'Playfair Display', serif;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #5a6c7d;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.contact-icon {
  font-size: 1.5rem;
  margin-top: 2px;
}

.contact-details strong {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
}

.contact-details p {
  margin: 0;
  color: #5a6c7d;
}

.opening-hours p {
  font-size: 1.1rem;
  color: #5a6c7d;
  margin: 0;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: var(--surface-color);
  border-radius: 8px;
}

.amenity-icon {
  font-size: 1.2rem;
}

.amenity-text {
  font-weight: 500;
  color: #2c3e50;
}

/* Reservation Sidebar */
.reservation-sidebar {
  position: sticky;
  top: 20px;
}

.reservation-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.reservation-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #2c3e50;
  text-align: center;
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
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-input {
  padding: 12px 15px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-input::placeholder {
  color: #7f8c8d;
}

.btn-submit {
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.capacity-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
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
  color: #333;
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

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.modal-actions .btn-outline,
  .modal-actions .btn-primary {
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

  /* Styles pour le modal de paiement */
  .payment-modal .modal-content {
    max-width: 700px;
    width: 90%;
  }

  .payment-modal-content {
    max-height: 90vh;
    overflow-y: auto;
  }

  .loading-state {
    text-align: center;
    padding: 40px 20px;
  }

  .loading-state .loading-spinner {
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

/* Responsive Design */
@media (max-width: 768px) {
  .restaurant-title {
    font-size: 2rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .restaurant-info {
    padding: 25px;
  }
  
  .reservation-sidebar {
    position: static;
  }
  
  .restaurant-actions {
    flex-direction: column;
  }
  
  .cuisine-price {
    flex-direction: column;
    gap: 10px;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .restaurant-hero {
    height: 50vh;
  }
  
  .restaurant-title {
    font-size: 1.8rem;
  }
  
  .hero-info {
    text-align: center;
  }
  
  .restaurant-badges {
    justify-content: center;
  }
  
  .main-content {
    padding: 40px 0;
  }
  
  .restaurant-info {
    padding: 20px;
  }
  
  .modal-header,
  .modal-body {
    padding: 20px;
  }
}
</style>
