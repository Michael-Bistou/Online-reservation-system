<template>
  <div class="restaurant-profile">
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
            <router-link to="/restaurant-dashboard" class="nav-link">
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
            <router-link to="/restaurant-profile" class="nav-link active">
              {{ $t('restaurant_dashboard.nav.profile') }}
            </router-link>
          </div>
          <div class="nav-actions">
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

    <div class="page-header">
      <div class="container">
        <h1 class="page-title">{{ $t('restaurant_profile.title') }}</h1>
        <p class="page-subtitle">{{ $t('restaurant_profile.subtitle') }}</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div class="profile-form">
          <!-- Informations du restaurant -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('restaurant_profile.sections.restaurant_info') }}</h3>
            
            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.restaurant_name') }} *</label>
              <input
                v-model="form.restaurant_name"
                type="text"
                class="form-input"
                :class="{ 'error': errors.restaurant_name }"
                :placeholder="$t('restaurant_profile.placeholders.restaurant_name')"
                required
              />
              <span v-if="errors.restaurant_name" class="form-error">{{ errors.restaurant_name }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.cuisine_type') }} *</label>
              <select
                v-model="form.cuisine_type"
                class="form-input"
                :class="{ 'error': errors.cuisine_type }"
                required
              >
                <option value="">{{ $t('restaurant_profile.placeholders.select_cuisine') }}</option>
                <option value="Française">{{ $t('restaurant_profile.cuisine_types.french') }}</option>
                <option value="Italienne">{{ $t('restaurant_profile.cuisine_types.italian') }}</option>
                <option value="Japonaise">{{ $t('restaurant_profile.cuisine_types.japanese') }}</option>
                <option value="Chinoise">{{ $t('restaurant_profile.cuisine_types.chinese') }}</option>
                <option value="Mexicaine">{{ $t('restaurant_profile.cuisine_types.mexican') }}</option>
                <option value="Indienne">{{ $t('restaurant_profile.cuisine_types.indian') }}</option>
                <option value="Thaï">{{ $t('restaurant_profile.cuisine_types.thai') }}</option>
                <option value="Grecque">{{ $t('restaurant_profile.cuisine_types.greek') }}</option>
                <option value="Espagnole">{{ $t('restaurant_profile.cuisine_types.spanish') }}</option>
                <option value="Autre">{{ $t('restaurant_profile.cuisine_types.other') }}</option>
              </select>
              <span v-if="errors.cuisine_type" class="form-error">{{ errors.cuisine_type }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.price_range') }} *</label>
              <select
                v-model="form.price_range"
                class="form-input"
                :class="{ 'error': errors.price_range }"
                required
              >
                <option value="">{{ $t('restaurant_profile.placeholders.select_price_range') }}</option>
                <option value="€">{{ $t('restaurant_profile.price_ranges.budget') }}</option>
                <option value="€€">{{ $t('restaurant_profile.price_ranges.moderate') }}</option>
                <option value="€€€">{{ $t('restaurant_profile.price_ranges.expensive') }}</option>
                <option value="€€€€">{{ $t('restaurant_profile.price_ranges.luxury') }}</option>
              </select>
              <span v-if="errors.price_range" class="form-error">{{ errors.price_range }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.description') }}</label>
              <textarea
                v-model="form.description"
                class="form-input"
                rows="4"
                :placeholder="$t('restaurant_profile.placeholders.description')"
              ></textarea>
            </div>
          </div>

          <!-- Adresse et contact -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('restaurant_profile.sections.address_contact') }}</h3>
            
            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.address') }} *</label>
              <input
                v-model="form.address"
                type="text"
                class="form-input"
                :class="{ 'error': errors.address }"
                :placeholder="$t('restaurant_profile.placeholders.address')"
                required
              />
              <span v-if="errors.address" class="form-error">{{ errors.address }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.phone') }} *</label>
              <input
                v-model="form.phone"
                type="tel"
                class="form-input"
                :class="{ 'error': errors.phone }"
                :placeholder="$t('restaurant_profile.placeholders.phone')"
                required
              />
              <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.email') }} *</label>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'error': errors.email }"
                :placeholder="$t('restaurant_profile.placeholders.email')"
                required
              />
              <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.website') }}</label>
              <input
                v-model="form.website"
                type="url"
                class="form-input"
                :placeholder="$t('restaurant_profile.placeholders.website')"
              />
            </div>
          </div>

          <!-- Horaires et capacité -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('restaurant_profile.sections.hours_capacity') }}</h3>
            
            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.opening_hours') }} *</label>
              <textarea
                v-model="form.opening_hours"
                class="form-input"
                :class="{ 'error': errors.opening_hours }"
                rows="3"
                :placeholder="$t('restaurant_profile.placeholders.opening_hours')"
                required
              ></textarea>
              <span v-if="errors.opening_hours" class="form-error">{{ errors.opening_hours }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_profile.fields.capacity') }} *</label>
              <input
                v-model="form.capacity"
                type="number"
                class="form-input"
                :class="{ 'error': errors.capacity }"
                :placeholder="$t('restaurant_profile.placeholders.capacity')"
                min="1"
                required
              />
              <span v-if="errors.capacity" class="form-error">{{ errors.capacity }}</span>
            </div>
          </div>

          <!-- Équipements -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('restaurant_profile.sections.amenities') }}</h3>
            
            <div class="amenities-grid">
              <label class="amenity-checkbox">
                <input
                  v-model="form.has_parking"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">{{ $t('restaurant_profile.amenities.parking') }}</span>
              </label>

              <label class="amenity-checkbox">
                <input
                  v-model="form.has_wifi"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">{{ $t('restaurant_profile.amenities.wifi') }}</span>
              </label>

              <label class="amenity-checkbox">
                <input
                  v-model="form.has_outdoor_seating"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">{{ $t('restaurant_profile.amenities.outdoor_seating') }}</span>
              </label>

              <label class="amenity-checkbox">
                <input
                  v-model="form.is_wheelchair_accessible"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">{{ $t('restaurant_profile.amenities.wheelchair_accessible') }}</span>
              </label>
            </div>
          </div>

          <!-- Messages d'erreur et de succès -->
          <div v-if="errorMessage" class="alert alert-error">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">{{ errorMessage }}</div>
          </div>

          <div v-if="successMessage" class="alert alert-success">
            <div class="alert-icon">✅</div>
            <div class="alert-content">{{ successMessage }}</div>
          </div>

          <!-- Boutons d'action -->
          <div class="form-actions">
            <button @click="saveChanges" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-if="loading">{{ $t('restaurant_profile.actions.saving') }}</span>
              <span v-else>{{ $t('restaurant_profile.actions.save') }}</span>
            </button>
            <router-link to="/restaurant-dashboard" class="btn btn-outline">
              {{ $t('restaurant_profile.actions.cancel') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: 'RestaurantProfile',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    
    const loading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const form = reactive({
      restaurant_name: '',
      cuisine_type: '',
      price_range: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      opening_hours: '',
      capacity: '',
      has_parking: false,
      has_wifi: false,
      has_outdoor_seating: false,
      is_wheelchair_accessible: false
    })

    const errors = reactive({
      restaurant_name: '',
      cuisine_type: '',
      price_range: '',
      address: '',
      phone: '',
      email: '',
      opening_hours: '',
      capacity: ''
    })

    const validateForm = () => {
      // Réinitialiser les erreurs
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      let isValid = true

      // Validation nom du restaurant
      if (!form.restaurant_name.trim()) {
        errors.restaurant_name = t('restaurant_profile.validation.restaurant_name_required')
        isValid = false
      } else if (form.restaurant_name.length < 2) {
        errors.restaurant_name = t('restaurant_profile.validation.restaurant_name_min_length')
        isValid = false
      }

      // Validation type de cuisine
      if (!form.cuisine_type) {
        errors.cuisine_type = t('restaurant_profile.validation.cuisine_type_required')
        isValid = false
      }

      // Validation gamme de prix
      if (!form.price_range) {
        errors.price_range = t('restaurant_profile.validation.price_range_required')
        isValid = false
      }

      // Validation adresse
      if (!form.address.trim()) {
        errors.address = t('restaurant_profile.validation.address_required')
        isValid = false
      }

      // Validation téléphone
      const phoneRegex = /^[0-9]{10}$/
      if (!form.phone) {
        errors.phone = t('restaurant_profile.validation.phone_required')
        isValid = false
      } else if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
        errors.phone = t('restaurant_profile.validation.phone_invalid')
        isValid = false
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = t('restaurant_profile.validation.email_required')
        isValid = false
      } else if (!emailRegex.test(form.email)) {
        errors.email = t('restaurant_profile.validation.email_invalid')
        isValid = false
      }

      // Validation horaires
      if (!form.opening_hours.trim()) {
        errors.opening_hours = t('restaurant_profile.validation.opening_hours_required')
        isValid = false
      }

      // Validation capacité
      if (!form.capacity) {
        errors.capacity = t('restaurant_profile.validation.capacity_required')
        isValid = false
      } else if (parseInt(form.capacity) < 1) {
        errors.capacity = t('restaurant_profile.validation.capacity_min')
        isValid = false
      }

      return isValid
    }

    const loadRestaurantData = () => {
      const restaurantData = localStorage.getItem('currentRestaurant')
      if (restaurantData) {
        const restaurant = JSON.parse(restaurantData)
        
        // Remplir le formulaire avec les données existantes
        Object.keys(form).forEach(key => {
          if (restaurant[key] !== undefined) {
            form[key] = restaurant[key]
          }
        })
      }
    }

    const saveChanges = async () => {
      if (!validateForm()) return

      loading.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        // Récupérer les données actuelles du restaurant
        const currentRestaurant = JSON.parse(localStorage.getItem('currentRestaurant') || '{}')
        
        // Mettre à jour avec les nouvelles données
        const updatedRestaurant = {
          ...currentRestaurant,
          restaurant_name: form.restaurant_name.trim(),
          cuisine_type: form.cuisine_type,
          price_range: form.price_range,
          description: form.description.trim(),
          address: form.address.trim(),
          phone: form.phone.replace(/\s/g, ''),
          email: form.email.toLowerCase(),
          website: form.website.trim(),
          opening_hours: form.opening_hours.trim(),
          capacity: parseInt(form.capacity),
          has_parking: form.has_parking,
          has_wifi: form.has_wifi,
          has_outdoor_seating: form.has_outdoor_seating,
          is_wheelchair_accessible: form.is_wheelchair_accessible
        }

        // Sauvegarder dans localStorage
        localStorage.setItem('currentRestaurant', JSON.stringify(updatedRestaurant))
        localStorage.setItem('restaurantData', JSON.stringify(updatedRestaurant))
        
        successMessage.value = t('restaurant_profile.messages.success')
        
        // Rediriger vers le dashboard après 2 secondes
        setTimeout(() => {
          router.push('/restaurant-dashboard')
        }, 2000)
        
      } catch (err) {
        console.error(t('restaurant_profile.messages.error'), err)
        errorMessage.value = 'Une erreur inattendue s\'est produite'
      } finally {
        loading.value = false
      }
    }

    // Function to handle language changes
    const handleLanguageChange = () => {
      nextTick(() => {
        // The component will automatically re-render with new translations
      })
    }

    const logout = () => {
      localStorage.removeItem('restaurantLoggedIn')
      localStorage.removeItem('currentRestaurant')
      window.location.href = '/restaurant-login'
    }

    onMounted(() => {
      loadRestaurantData()
      // Listen for language changes
      window.addEventListener('languageChanged', handleLanguageChange)
    })

    onUnmounted(() => {
      // Clean up event listener
      window.removeEventListener('languageChanged', handleLanguageChange)
    })

    return {
      form,
      errors,
      loading,
      errorMessage,
      successMessage,
      saveChanges,
      logout
    }
  }
}
</script>

<style scoped>
.restaurant-profile {
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 80px; /* Espace pour la barre de navigation fixe */
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
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-form {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #e74c3c;
}

.form-error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.amenity-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.amenity-checkbox:hover {
  background-color: #e9ecef;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.checkbox-label {
  font-weight: 500;
  color: #2c3e50;
}

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 20px;
}

.alert-error {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.alert-icon {
  font-size: 1.2rem;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}







.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .profile-form {
    padding: 30px 20px;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 40px 0 30px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .profile-form {
    padding: 25px 15px;
  }
}
</style>
