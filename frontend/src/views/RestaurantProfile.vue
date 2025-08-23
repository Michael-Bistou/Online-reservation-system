<template>
  <div class="restaurant-profile">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Modifier le Profil</h1>
        <p class="page-subtitle">Mettez à jour les informations de votre restaurant</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div class="profile-form">
          <!-- Informations du restaurant -->
          <div class="form-section">
            <h3 class="section-title">Informations du restaurant</h3>
            
            <div class="form-group">
              <label class="form-label">Nom du restaurant *</label>
              <input
                v-model="form.restaurant_name"
                type="text"
                class="form-input"
                :class="{ 'error': errors.restaurant_name }"
                placeholder="Ex: Le Petit Bistrot"
                required
              />
              <span v-if="errors.restaurant_name" class="form-error">{{ errors.restaurant_name }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Type de cuisine *</label>
              <select
                v-model="form.cuisine_type"
                class="form-input"
                :class="{ 'error': errors.cuisine_type }"
                required
              >
                <option value="">Sélectionnez un type de cuisine</option>
                <option value="Française">Française</option>
                <option value="Italienne">Italienne</option>
                <option value="Japonaise">Japonaise</option>
                <option value="Chinoise">Chinoise</option>
                <option value="Mexicaine">Mexicaine</option>
                <option value="Indienne">Indienne</option>
                <option value="Thaï">Thaï</option>
                <option value="Grecque">Grecque</option>
                <option value="Espagnole">Espagnole</option>
                <option value="Autre">Autre</option>
              </select>
              <span v-if="errors.cuisine_type" class="form-error">{{ errors.cuisine_type }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Gamme de prix *</label>
              <select
                v-model="form.price_range"
                class="form-input"
                :class="{ 'error': errors.price_range }"
                required
              >
                <option value="">Sélectionnez une gamme de prix</option>
                <option value="€">€ (Économique)</option>
                <option value="€€">€€ (Modéré)</option>
                <option value="€€€">€€€ (Élevé)</option>
                <option value="€€€€">€€€€ (Luxe)</option>
              </select>
              <span v-if="errors.price_range" class="form-error">{{ errors.price_range }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                v-model="form.description"
                class="form-input"
                rows="4"
                placeholder="Décrivez votre restaurant, votre cuisine, votre ambiance..."
              ></textarea>
            </div>
          </div>

          <!-- Adresse et contact -->
          <div class="form-section">
            <h3 class="section-title">Adresse et contact</h3>
            
            <div class="form-group">
              <label class="form-label">Adresse complète *</label>
              <input
                v-model="form.address"
                type="text"
                class="form-input"
                :class="{ 'error': errors.address }"
                placeholder="123 Rue de la Paix, 75001 Paris"
                required
              />
              <span v-if="errors.address" class="form-error">{{ errors.address }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Téléphone *</label>
              <input
                v-model="form.phone"
                type="tel"
                class="form-input"
                :class="{ 'error': errors.phone }"
                placeholder="01 23 45 67 89"
                required
              />
              <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Email *</label>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'error': errors.email }"
                placeholder="contact@restaurant.fr"
                required
              />
              <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Site web</label>
              <input
                v-model="form.website"
                type="url"
                class="form-input"
                placeholder="https://www.restaurant.fr"
              />
            </div>
          </div>

          <!-- Horaires et capacité -->
          <div class="form-section">
            <h3 class="section-title">Horaires et capacité</h3>
            
            <div class="form-group">
              <label class="form-label">Horaires d'ouverture *</label>
              <textarea
                v-model="form.opening_hours"
                class="form-input"
                :class="{ 'error': errors.opening_hours }"
                rows="3"
                placeholder="Ex: Lun-Sam: 12h-14h30, 19h-22h30"
                required
              ></textarea>
              <span v-if="errors.opening_hours" class="form-error">{{ errors.opening_hours }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Capacité d'accueil *</label>
              <input
                v-model="form.capacity"
                type="number"
                class="form-input"
                :class="{ 'error': errors.capacity }"
                placeholder="50"
                min="1"
                required
              />
              <span v-if="errors.capacity" class="form-error">{{ errors.capacity }}</span>
            </div>
          </div>

          <!-- Équipements -->
          <div class="form-section">
            <h3 class="section-title">Équipements disponibles</h3>
            
            <div class="amenities-grid">
              <label class="amenity-checkbox">
                <input
                  v-model="form.has_parking"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">🚗 Parking</span>
              </label>

              <label class="amenity-checkbox">
                <input
                  v-model="form.has_wifi"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">📶 Wi-Fi</span>
              </label>

              <label class="amenity-checkbox">
                <input
                  v-model="form.has_outdoor_seating"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">🌳 Terrasse</span>
              </label>

              <label class="amenity-checkbox">
                <input
                  v-model="form.is_wheelchair_accessible"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">♿ Accessible PMR</span>
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
              <span v-if="loading">Sauvegarde...</span>
              <span v-else>Sauvegarder les modifications</span>
            </button>
            <router-link to="/restaurant-dashboard" class="btn btn-outline">
              Annuler
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RestaurantProfile',
  setup() {
    const router = useRouter()
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
        errors.restaurant_name = 'Le nom du restaurant est requis'
        isValid = false
      } else if (form.restaurant_name.length < 2) {
        errors.restaurant_name = 'Le nom doit contenir au moins 2 caractères'
        isValid = false
      }

      // Validation type de cuisine
      if (!form.cuisine_type) {
        errors.cuisine_type = 'Le type de cuisine est requis'
        isValid = false
      }

      // Validation gamme de prix
      if (!form.price_range) {
        errors.price_range = 'La gamme de prix est requise'
        isValid = false
      }

      // Validation adresse
      if (!form.address.trim()) {
        errors.address = 'L\'adresse est requise'
        isValid = false
      }

      // Validation téléphone
      const phoneRegex = /^[0-9]{10}$/
      if (!form.phone) {
        errors.phone = 'Le téléphone est requis'
        isValid = false
      } else if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
        errors.phone = 'Format de téléphone invalide (10 chiffres)'
        isValid = false
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = 'L\'email est requis'
        isValid = false
      } else if (!emailRegex.test(form.email)) {
        errors.email = 'Format d\'email invalide'
        isValid = false
      }

      // Validation horaires
      if (!form.opening_hours.trim()) {
        errors.opening_hours = 'Les horaires d\'ouverture sont requis'
        isValid = false
      }

      // Validation capacité
      if (!form.capacity) {
        errors.capacity = 'La capacité est requise'
        isValid = false
      } else if (parseInt(form.capacity) < 1) {
        errors.capacity = 'La capacité doit être supérieure à 0'
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
        
        successMessage.value = 'Profil mis à jour avec succès !'
        
        // Rediriger vers le dashboard après 2 secondes
        setTimeout(() => {
          router.push('/restaurant-dashboard')
        }, 2000)
        
      } catch (err) {
        console.error('Erreur de mise à jour du profil:', err)
        errorMessage.value = 'Une erreur inattendue s\'est produite'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadRestaurantData()
    })

    return {
      form,
      errors,
      loading,
      errorMessage,
      successMessage,
      saveChanges
    }
  }
}
</script>

<style scoped>
.restaurant-profile {
  min-height: 100vh;
  background: #f8f9fa;
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
