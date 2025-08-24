<template>
  <div class="restaurant-login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">{{ $t('restaurant_login.title') }}</h1>
          <p class="login-subtitle">{{ $t('restaurant_login.subtitle') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">{{ $t('restaurant_login.fields.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              :class="{ 'error': errors.email }"
              :placeholder="$t('restaurant_login.placeholders.email')"
              required
            />
            <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('restaurant_login.fields.password') }}</label>
            <input
              v-model="form.password"
              type="password"
              class="form-input"
              :class="{ 'error': errors.password }"
              :placeholder="$t('restaurant_login.placeholders.password')"
              required
            />
            <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
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

          <!-- Bouton de connexion -->
          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            <div class="btn-content">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-if="loading">{{ $t('restaurant_login.actions.logging_in') }}</span>
              <span v-else>{{ $t('restaurant_login.actions.login') }}</span>
            </div>
          </button>
        </form>

        <div class="login-footer">
          <div class="divider">
            <span class="divider-text">{{ $t('restaurant_login.footer.or') }}</span>
          </div>
          <p class="footer-text">{{ $t('restaurant_login.footer.no_account') }}</p>
          <router-link to="/restaurant-register" class="btn btn-outline btn-full">
            {{ $t('restaurant_login.footer.register') }}
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
  name: 'RestaurantLogin',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const loading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const form = reactive({
      email: '',
      password: ''
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    const validateForm = () => {
      // Réinitialiser les erreurs
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      let isValid = true

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = t('restaurant_login.validation.email_required')
        isValid = false
      } else if (!emailRegex.test(form.email)) {
        errors.email = t('restaurant_login.validation.email_invalid')
        isValid = false
      }

      // Validation mot de passe
      if (!form.password) {
        errors.password = t('restaurant_login.validation.password_required')
        isValid = false
      }

      return isValid
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      loading.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        // Récupérer les données du restaurant depuis localStorage
        const restaurantData = localStorage.getItem('restaurantData')
        
        if (!restaurantData) {
          errorMessage.value = t('restaurant_login.messages.no_restaurant')
          return
        }

        const restaurant = JSON.parse(restaurantData)
        
        // Vérifier les identifiants
        if (restaurant.email.toLowerCase() === form.email.toLowerCase() && 
            restaurant.password === form.password) {
          
          successMessage.value = 'Connexion réussie ! Redirection...'
          
          // Stocker les informations de connexion
          localStorage.setItem('restaurantLoggedIn', 'true')
          localStorage.setItem('currentRestaurant', JSON.stringify(restaurant))
          
          // Rediriger vers le dashboard restaurant après 2 secondes
          setTimeout(() => {
            router.push('/restaurant-dashboard')
          }, 2000)
          
        } else {
          errorMessage.value = t('restaurant_login.messages.invalid_credentials')
        }
        
      } catch (err) {
        console.error(t('restaurant_login.messages.login_error'), err)
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
      handleLogin
    }
  }
}
</script>

<style scoped>
.restaurant-login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
}

.login-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
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

.login-footer {
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
@media (max-width: 480px) {
  .restaurant-login-page {
    padding: 20px 10px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 2rem;
  }
}
</style>
