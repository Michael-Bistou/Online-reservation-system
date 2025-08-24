<template>
  <div class="login-page">
    <div class="login-background">
      <div class="background-overlay"></div>
    </div>
    
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-section">
            <div class="logo-icon">G</div>
            <h1 class="logo-text">{{ $t('common.app_name') }}</h1>
          </div>
          <h2 class="login-title">{{ $t('auth.login.title') }}</h2>
          <p class="login-subtitle">{{ $t('auth.login.subtitle') }}</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">{{ $t('auth.login.email') }}</label>
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
            <label for="password" class="form-label">{{ $t('auth.login.password') }}</label>
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

          <div v-if="errorMessage" class="alert alert-error">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">{{ errorMessage }}</div>
          </div>

          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            <div class="btn-content">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-if="loading">{{ $t('auth.login.loading') }}</span>
              <span v-else>{{ $t('auth.login.submit') }}</span>
            </div>
          </button>
        </form>

        <div class="login-footer">
          <div class="divider">
            <span class="divider-text">{{ $t('common.or') }}</span>
          </div>
          <p class="footer-text">{{ $t('auth.login.noAccount') }}</p>
          <router-link to="/register" class="btn btn-outline btn-full">
            {{ $t('auth.login.createAccount') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import authService from '../services/auth.js'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t: $t } = useI18n()
    const loading = ref(false)
    const errorMessage = ref('')

    const form = reactive({
      email: '',
      password: ''
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    const validateForm = () => {
      errors.email = ''
      errors.password = ''

      if (!form.email) {
        errors.email = $t('auth.login.errors.emailRequired')
        return false
      }

      if (!form.password) {
        errors.password = $t('auth.login.errors.passwordRequired')
        return false
      }

      return true
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      loading.value = true
      errorMessage.value = ''

      try {
        const result = await authService.login(form.email, form.password)
        
        if (result.success) {
          // Rediriger vers la page demandée ou vers les restaurants
          const redirectTo = route.query.redirect || '/restaurants'
          router.push(redirectTo)
        } else {
          errorMessage.value = result.error
        }
      } catch (err) {
        console.error('Erreur de connexion:', err)
        errorMessage.value = $t('auth.login.errors.unexpectedError')
      } finally {
        loading.value = false
      }
    }

    // Écouter les changements de langue
    const handleLanguageChange = () => {
      console.log('🌍 Langue changée, mise à jour de la page de connexion...')
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
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--surface-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-background {
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

.login-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 450px;
  padding: 2rem;
}

.login-card {
  background: var(--surface-color);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-gold);
  backdrop-filter: blur(20px);
}

.login-header {
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

.login-title {
  font-size: 2rem;
  font-weight: 300;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-family: 'Playfair Display', serif;
}

.login-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 300;
}

.login-form {
  margin-bottom: 2rem;
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

.login-footer {
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

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  .login-title {
    font-size: 1.75rem;
  }
}
</style>
