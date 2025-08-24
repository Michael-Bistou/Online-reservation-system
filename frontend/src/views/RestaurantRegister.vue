<template>
  <div class="restaurant-register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1 class="register-title">{{ $t('restaurant_register.title') }}</h1>
          <p class="register-subtitle">{{ $t('restaurant_register.subtitle') }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- Informations du restaurant -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('restaurant_register.sections.restaurant_info') }}</h3>
            
            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.restaurant_name') }} *</label>
              <input
                v-model="form.restaurant_name"
                type="text"
                class="form-input"
                :class="{ 'error': errors.restaurant_name }"
                :placeholder="$t('restaurant_register.placeholders.restaurant_name')"
                required
              />
              <span v-if="errors.restaurant_name" class="form-error">{{ errors.restaurant_name }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.cuisine_type') }} *</label>
              <select
                v-model="form.cuisine_type"
                class="form-input"
                :class="{ 'error': errors.cuisine_type }"
                required
              >
                <option value="">{{ $t('restaurant_register.placeholders.select_cuisine') }}</option>
                <option value="Française">{{ $t('restaurant_register.cuisine_types.french') }}</option>
                <option value="Italienne">{{ $t('restaurant_register.cuisine_types.italian') }}</option>
                <option value="Japonaise">{{ $t('restaurant_register.cuisine_types.japanese') }}</option>
                <option value="Chinoise">{{ $t('restaurant_register.cuisine_types.chinese') }}</option>
                <option value="Mexicaine">{{ $t('restaurant_register.cuisine_types.mexican') }}</option>
                <option value="Indienne">{{ $t('restaurant_register.cuisine_types.indian') }}</option>
                <option value="Thaï">{{ $t('restaurant_register.cuisine_types.thai') }}</option>
                <option value="Grecque">{{ $t('restaurant_register.cuisine_types.greek') }}</option>
                <option value="Espagnole">{{ $t('restaurant_register.cuisine_types.spanish') }}</option>
                <option value="Autre">{{ $t('restaurant_register.cuisine_types.other') }}</option>
              </select>
              <span v-if="errors.cuisine_type" class="form-error">{{ errors.cuisine_type }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.price_range') }} *</label>
              <select
                v-model="form.price_range"
                class="form-input"
                :class="{ 'error': errors.price_range }"
                required
              >
                <option value="">{{ $t('restaurant_register.placeholders.select_price_range') }}</option>
                <option value="€">{{ $t('restaurant_register.price_ranges.budget') }}</option>
                <option value="€€">{{ $t('restaurant_register.price_ranges.moderate') }}</option>
                <option value="€€€">{{ $t('restaurant_register.price_ranges.expensive') }}</option>
                <option value="€€€€">{{ $t('restaurant_register.price_ranges.luxury') }}</option>
              </select>
              <span v-if="errors.price_range" class="form-error">{{ errors.price_range }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.description') }}</label>
              <textarea
                v-model="form.description"
                class="form-input"
                rows="4"
                :placeholder="$t('restaurant_register.placeholders.description')"
              ></textarea>
            </div>
          </div>

          <!-- Adresse et contact -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('restaurant_register.sections.address_contact') }}</h3>
            
            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.address') }} *</label>
              <input
                v-model="form.address"
                type="text"
                class="form-input"
                :class="{ 'error': errors.address }"
                :placeholder="$t('restaurant_register.placeholders.address')"
                required
              />
              <span v-if="errors.address" class="form-error">{{ errors.address }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.phone') }} *</label>
              <input
                v-model="form.phone"
                type="tel"
                class="form-input"
                :class="{ 'error': errors.phone }"
                :placeholder="$t('restaurant_register.placeholders.phone')"
                required
              />
              <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.email') }} *</label>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'error': errors.email }"
                :placeholder="$t('restaurant_register.placeholders.email')"
                required
              />
              <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.website') }}</label>
              <input
                v-model="form.website"
                type="url"
                class="form-input"
                :placeholder="$t('restaurant_register.placeholders.website')"
              />
            </div>
          </div>

          <!-- Horaires et capacité -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('restaurant_register.sections.hours_capacity') }}</h3>
            
            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.opening_hours') }} *</label>
              <textarea
                v-model="form.opening_hours"
                class="form-input"
                :class="{ 'error': errors.opening_hours }"
                rows="3"
                :placeholder="$t('restaurant_register.placeholders.opening_hours')"
                required
              ></textarea>
              <span v-if="errors.opening_hours" class="form-error">{{ errors.opening_hours }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.capacity') }} *</label>
              <input
                v-model="form.capacity"
                type="number"
                class="form-input"
                :class="{ 'error': errors.capacity }"
                :placeholder="$t('restaurant_register.placeholders.capacity')"
                min="1"
                required
              />
              <span v-if="errors.capacity" class="form-error">{{ errors.capacity }}</span>
            </div>
          </div>

          <!-- Équipements -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('restaurant_register.sections.amenities') }}</h3>
            
            <div class="amenities-grid">
              <label class="amenity-checkbox">
                <input
                  v-model="form.has_parking"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">{{ $t('restaurant_register.amenities.parking') }}</span>
              </label>

              <label class="amenity-checkbox">
                <input
                  v-model="form.has_wifi"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">{{ $t('restaurant_register.amenities.wifi') }}</span>
              </label>

              <label class="amenity-checkbox">
                <input
                  v-model="form.has_outdoor_seating"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">{{ $t('restaurant_register.amenities.outdoor_seating') }}</span>
              </label>

              <label class="amenity-checkbox">
                <input
                  v-model="form.is_wheelchair_accessible"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">{{ $t('restaurant_register.amenities.wheelchair_accessible') }}</span>
              </label>
            </div>
          </div>

          <!-- Informations du propriétaire -->
          <div class="form-section">
            <h3 class="section-title">{{ $t('restaurant_register.sections.owner_info') }}</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ $t('restaurant_register.fields.owner_first_name') }} *</label>
                <input
                  v-model="form.owner_first_name"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.owner_first_name }"
                  :placeholder="$t('restaurant_register.placeholders.owner_first_name')"
                  required
                />
                <span v-if="errors.owner_first_name" class="form-error">{{ errors.owner_first_name }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">{{ $t('restaurant_register.fields.owner_last_name') }} *</label>
                <input
                  v-model="form.owner_last_name"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.owner_last_name }"
                  :placeholder="$t('restaurant_register.placeholders.owner_last_name')"
                  required
                />
                <span v-if="errors.owner_last_name" class="form-error">{{ errors.owner_last_name }}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.password') }} *</label>
              <input
                v-model="form.password"
                type="password"
                class="form-input"
                :class="{ 'error': errors.password }"
                :placeholder="$t('restaurant_register.placeholders.password')"
                required
              />
              <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('restaurant_register.fields.confirm_password') }} *</label>
              <input
                v-model="form.confirm_password"
                type="password"
                class="form-input"
                :class="{ 'error': errors.confirm_password }"
                :placeholder="$t('restaurant_register.placeholders.confirm_password')"
                required
              />
              <span v-if="errors.confirm_password" class="form-error">{{ errors.confirm_password }}</span>
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

          <!-- Bouton d'inscription -->
          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            <div class="btn-content">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-if="loading">{{ $t('restaurant_register.actions.registering') }}</span>
              <span v-else>{{ $t('restaurant_register.actions.register') }}</span>
            </div>
          </button>
        </form>

        <div class="register-footer">
          <div class="divider">
            <span class="divider-text">{{ $t('restaurant_register.footer.or') }}</span>
          </div>
          <p class="footer-text">{{ $t('restaurant_register.footer.has_account') }}</p>
          <router-link to="/restaurant-login" class="btn btn-outline btn-full">
            {{ $t('restaurant_register.actions.login') }}
          </router-link>
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
  name: 'RestaurantRegister',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const loading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const form = reactive({
      // Informations du restaurant
      restaurant_name: '',
      cuisine_type: '',
      price_range: '',
      description: '',
      
      // Adresse et contact
      address: '',
      phone: '',
      email: '',
      website: '',
      
      // Horaires et capacité
      opening_hours: '',
      capacity: '',
      
      // Équipements
      has_parking: false,
      has_wifi: false,
      has_outdoor_seating: false,
      is_wheelchair_accessible: false,
      
      // Propriétaire
      owner_first_name: '',
      owner_last_name: '',
      password: '',
      confirm_password: ''
    })

    const errors = reactive({
      restaurant_name: '',
      cuisine_type: '',
      price_range: '',
      address: '',
      phone: '',
      email: '',
      opening_hours: '',
      capacity: '',
      owner_first_name: '',
      owner_last_name: '',
      password: '',
      confirm_password: ''
    })

    const validateForm = () => {
      // Réinitialiser les erreurs
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      let isValid = true

      // Validation nom du restaurant
      if (!form.restaurant_name.trim()) {
        errors.restaurant_name = t('restaurant_register.validation.restaurant_name_required')
        isValid = false
      } else if (form.restaurant_name.length < 2) {
        errors.restaurant_name = t('restaurant_register.validation.restaurant_name_min_length')
        isValid = false
      }

      // Validation type de cuisine
      if (!form.cuisine_type) {
        errors.cuisine_type = t('restaurant_register.validation.cuisine_type_required')
        isValid = false
      }

      // Validation gamme de prix
      if (!form.price_range) {
        errors.price_range = t('restaurant_register.validation.price_range_required')
        isValid = false
      }

      // Validation adresse
      if (!form.address.trim()) {
        errors.address = t('restaurant_register.validation.address_required')
        isValid = false
      }

      // Validation téléphone
      const phoneRegex = /^[0-9]{10}$/
      if (!form.phone) {
        errors.phone = t('restaurant_register.validation.phone_required')
        isValid = false
      } else if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
        errors.phone = t('restaurant_register.validation.phone_invalid')
        isValid = false
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = t('restaurant_register.validation.email_required')
        isValid = false
      } else if (!emailRegex.test(form.email)) {
        errors.email = t('restaurant_register.validation.email_invalid')
        isValid = false
      }

      // Validation horaires
      if (!form.opening_hours.trim()) {
        errors.opening_hours = t('restaurant_register.validation.opening_hours_required')
        isValid = false
      }

      // Validation capacité
      if (!form.capacity) {
        errors.capacity = t('restaurant_register.validation.capacity_required')
        isValid = false
      } else if (parseInt(form.capacity) < 1) {
        errors.capacity = t('restaurant_register.validation.capacity_min')
        isValid = false
      }

      // Validation propriétaire
      if (!form.owner_first_name.trim()) {
        errors.owner_first_name = t('restaurant_register.validation.owner_first_name_required')
        isValid = false
      } else if (form.owner_first_name.length < 2) {
        errors.owner_first_name = t('restaurant_register.validation.owner_first_name_min_length')
        isValid = false
      }

      if (!form.owner_last_name.trim()) {
        errors.owner_last_name = t('restaurant_register.validation.owner_last_name_required')
        isValid = false
      } else if (form.owner_last_name.length < 2) {
        errors.owner_last_name = t('restaurant_register.validation.owner_last_name_min_length')
        isValid = false
      }

      // Validation mot de passe
      if (!form.password) {
        errors.password = t('restaurant_register.validation.password_required')
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = t('restaurant_register.validation.password_min_length')
        isValid = false
      }

      // Validation confirmation mot de passe
      if (!form.confirm_password) {
        errors.confirm_password = t('restaurant_register.validation.confirm_password_required')
        isValid = false
      } else if (form.password !== form.confirm_password) {
        errors.confirm_password = t('restaurant_register.validation.passwords_not_match')
        isValid = false
      }

      return isValid
    }

    const handleRegister = async () => {
      if (!validateForm()) return

      loading.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        const restaurantData = {
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
          is_wheelchair_accessible: form.is_wheelchair_accessible,
          owner_first_name: form.owner_first_name.trim(),
          owner_last_name: form.owner_last_name.trim(),
          password: form.password,
          role: 'restaurant'
        }

        // Pour l'instant, simuler une inscription réussie
        console.log('Données du restaurant:', restaurantData)
        
        successMessage.value = t('restaurant_register.messages.success')
        
        // Stocker les données du restaurant
        localStorage.setItem('restaurantData', JSON.stringify(restaurantData))
        
        // Rediriger vers le dashboard restaurant après 2 secondes
        setTimeout(() => {
          router.push('/restaurant-dashboard')
        }, 2000)
        
      } catch (err) {
        console.error(t('restaurant_register.messages.register_error'), err)
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

    onMounted(() => {
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
      handleRegister
    }
  }
}
</script>

<style scoped>
.restaurant-register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-container {
  width: 100%;
  max-width: 800px;
}

.register-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
}

.register-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 25px;
  background: #f8f9fa;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
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

.btn {
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
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

.btn-full {
  width: 100%;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.register-footer {
  margin-top: 30px;
  text-align: center;
}

.divider {
  position: relative;
  margin: 30px 0;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.divider-text {
  background: white;
  padding: 0 15px;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.footer-text {
  color: #7f8c8d;
  margin-bottom: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .register-card {
    padding: 30px 20px;
  }
  
  .register-title {
    font-size: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .restaurant-register-page {
    padding: 20px 10px;
  }
  
  .register-card {
    padding: 25px 15px;
  }
  
  .register-title {
    font-size: 1.8rem;
  }
  
  .form-section {
    padding: 20px 15px;
  }
}
</style>
