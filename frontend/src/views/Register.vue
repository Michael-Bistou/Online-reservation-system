<template>
  <div class="register-page">
    <div class="register-background">
      <div class="background-overlay"></div>
    </div>
    
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="logo-section">
            <div class="logo-icon">G</div>
            <h1 class="logo-text">{{ $t('common.app_name') }}</h1>
          </div>
          <h2 class="register-title">{{ $t('auth.register.title') }}</h2>
          <p class="register-subtitle">{{ $t('auth.register.subtitle') }}</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="first_name" class="form-label">{{ $t('auth.register.firstName') }}</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="first_name"
                  v-model="form.first_name"
                  class="form-input"
                  :class="{ 'error': errors.first_name }"
                  placeholder="Votre prénom"
                  required
                />
                <div class="input-icon">👤</div>
              </div>
              <span v-if="errors.first_name" class="form-error">{{ errors.first_name }}</span>
            </div>

            <div class="form-group">
              <label for="last_name" class="form-label">{{ $t('auth.register.lastName') }}</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="last_name"
                  v-model="form.last_name"
                  class="form-input"
                  :class="{ 'error': errors.last_name }"
                  placeholder="Votre nom"
                  required
                />
                <div class="input-icon">👤</div>
              </div>
              <span v-if="errors.last_name" class="form-error">{{ errors.last_name }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">{{ $t('auth.register.email') }}</label>
            <div class="input-wrapper">
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="form-input"
                :class="{ 'error': errors.email }"
                placeholder="votre@email.com"
                required
              />
              <div class="input-icon">📧</div>
            </div>
            <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">{{ $t('auth.register.phone') }}</label>
            <div class="input-wrapper">
              <input
                type="tel"
                id="phone"
                v-model="form.phone"
                class="form-input"
                :class="{ 'error': errors.phone }"
                placeholder="0612345678"
                required
              />
              <div class="input-icon">📱</div>
            </div>
            <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">{{ $t('auth.register.password') }}</label>
            <div class="input-wrapper">
              <input
                type="password"
                id="password"
                v-model="form.password"
                class="form-input"
                :class="{ 'error': errors.password }"
                placeholder="Votre mot de passe"
                required
              />
              <div class="input-icon">🔒</div>
            </div>
            <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirm_password" class="form-label">{{ $t('auth.register.confirmPassword') }}</label>
            <div class="input-wrapper">
              <input
                type="password"
                id="confirm_password"
                v-model="form.confirm_password"
                class="form-input"
                :class="{ 'error': errors.confirm_password }"
                placeholder="Confirmez votre mot de passe"
                required
              />
              <div class="input-icon">🔒</div>
            </div>
            <span v-if="errors.confirm_password" class="form-error">{{ errors.confirm_password }}</span>
          </div>

          <div v-if="errorMessage" class="alert alert-error">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">{{ errorMessage }}</div>
          </div>

          <div v-if="successMessage" class="alert alert-success">
            <div class="alert-icon">✅</div>
            <div class="alert-content">{{ successMessage }}</div>
          </div>

          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            <div class="btn-content">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-if="loading">{{ $t('auth.register.loading') }}</span>
              <span v-else>{{ $t('auth.register.submit') }}</span>
            </div>
          </button>
        </form>

        <div class="register-footer">
          <div class="divider">
            <span class="divider-text">{{ $t('common.or') }}</span>
          </div>
          <p class="footer-text">{{ $t('auth.register.hasAccount') }}</p>
          <router-link to="/login" class="btn btn-outline btn-full">
            {{ $t('auth.register.login') }}
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
import authService from '../services/auth.js'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const { t: $t } = useI18n()
    const loading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const form = reactive({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: ''
    })

    const errors = reactive({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: ''
    })

    const validateForm = () => {
      // Réinitialiser les erreurs
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      let isValid = true

      // Validation prénom
      if (!form.first_name.trim()) {
        errors.first_name = $t('auth.register.errors.firstNameRequired')
        isValid = false
      } else if (form.first_name.length < 2) {
        errors.first_name = $t('auth.register.errors.firstNameMin')
        isValid = false
      }

      // Validation nom
      if (!form.last_name.trim()) {
        errors.last_name = $t('auth.register.errors.lastNameRequired')
        isValid = false
      } else if (form.last_name.length < 2) {
        errors.last_name = $t('auth.register.errors.lastNameMin')
        isValid = false
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = $t('auth.register.errors.emailRequired')
        isValid = false
      } else if (!emailRegex.test(form.email)) {
        errors.email = $t('auth.register.errors.emailInvalid')
        isValid = false
      }

      // Validation téléphone
      const phoneRegex = /^[0-9]{10}$/
      if (!form.phone) {
        errors.phone = $t('auth.register.errors.phoneRequired')
        isValid = false
      } else if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
        errors.phone = $t('auth.register.errors.phoneInvalid')
        isValid = false
      }

      // Validation mot de passe
      if (!form.password) {
        errors.password = $t('auth.register.errors.passwordRequired')
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = $t('auth.register.errors.passwordMin')
        isValid = false
      }

      // Validation confirmation mot de passe
      if (!form.confirm_password) {
        errors.confirm_password = $t('auth.register.errors.confirmPasswordRequired')
        isValid = false
      } else if (form.password !== form.confirm_password) {
        errors.confirm_password = $t('auth.register.errors.passwordMatch')
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
        const userData = {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.toLowerCase(),
          phone: form.phone.replace(/\s/g, ''),
          password: form.password
        }

        const result = await authService.register(userData)
        
        if (result.success) {
          successMessage.value = $t('auth.register.success')
          
          // Rediriger vers les restaurants après 2 secondes
          setTimeout(() => {
            router.push('/restaurants')
          }, 2000)
        } else {
          if (result.errors && result.errors.length > 0) {
            // Gérer les erreurs de validation du serveur
            result.errors.forEach(error => {
              if (error.path === 'email') errors.email = error.msg
              if (error.path === 'first_name') errors.first_name = error.msg
              if (error.path === 'last_name') errors.last_name = error.msg
              if (error.path === 'phone') errors.phone = error.msg
              if (error.path === 'password') errors.password = error.msg
            })
          } else {
            errorMessage.value = result.error
          }
        }
      } catch (err) {
        console.error('Erreur d\'inscription:', err)
        errorMessage.value = $t('auth.register.errors.unexpectedError')
      } finally {
        loading.value = false
      }
    }

    // Écouter les changements de langue
    const handleLanguageChange = () => {
      // Le composant se mettra à jour automatiquement grâce aux $t()
    }

    onMounted(() => {
      window.addEventListener('languageChanged', handleLanguageChange)
    })

    onUnmounted(() => {
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
.register-page {
  min-height: 100vh;
  background: var(--surface-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.register-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  opacity: 0.1;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.register-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 550px;
  padding: 2rem;
}

.register-card {
  background: var(--surface-color);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-gold);
  backdrop-filter: blur(20px);
}

.register-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--surface-dark);
  box-shadow: var(--shadow-gold);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  font-family: 'Playfair Display', serif;
}

.register-title {
  font-size: 2rem;
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-family: 'Playfair Display', serif;
}

.register-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 300;
}

.register-form {
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: var(--surface-dark);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(200, 162, 125, 0.1);
  background: var(--surface-color);
}

.form-input.error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  opacity: 0.6;
  pointer-events: none;
}

.form-error {
  color: var(--error-color);
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: block;
  font-weight: 500;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.alert-error {
  background: rgba(139, 0, 0, 0.1);
  color: var(--error-color);
  border: 1px solid var(--error-color);
}

.alert-success {
  background: rgba(200, 162, 125, 0.1);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.alert-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.btn-full {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  border: none;
  color: var(--surface-dark);
  box-shadow: var(--shadow-gold);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(200, 162, 125, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  backdrop-filter: blur(10px);
}

.btn-outline:hover {
  background: var(--primary-color);
  color: var(--surface-dark);
  box-shadow: var(--shadow-gold);
  transform: translateY(-2px);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.register-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.divider {
  position: relative;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.divider-text {
  background: var(--surface-color);
  padding: 0 1rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.footer-text {
  margin-bottom: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    padding: 2rem 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .register-title {
    font-size: 1.75rem;
  }
}
</style>
