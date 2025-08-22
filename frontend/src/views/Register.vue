<template>
  <div class="register-page">
    <div class="container">
      <div class="register-card">
        <h1 class="register-title">{{ $t('auth.register.title') }}</h1>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="first_name" class="form-label">{{ $t('auth.register.firstName') }}</label>
              <input
                type="text"
                id="first_name"
                v-model="form.first_name"
                class="form-input"
                :class="{ 'error': errors.first_name }"
                placeholder="Votre prénom"
                required
              />
              <span v-if="errors.first_name" class="form-error">{{ errors.first_name }}</span>
            </div>

            <div class="form-group">
              <label for="last_name" class="form-label">{{ $t('auth.register.lastName') }}</label>
              <input
                type="text"
                id="last_name"
                v-model="form.last_name"
                class="form-input"
                :class="{ 'error': errors.last_name }"
                placeholder="Votre nom"
                required
              />
              <span v-if="errors.last_name" class="form-error">{{ errors.last_name }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">{{ $t('auth.register.email') }}</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="form-input"
              :class="{ 'error': errors.email }"
              placeholder="votre@email.com"
              required
            />
            <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">{{ $t('auth.register.phone') }}</label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              class="form-input"
              :class="{ 'error': errors.phone }"
              placeholder="0612345678"
              required
            />
            <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">{{ $t('auth.register.password') }}</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="Votre mot de passe"
              required
            />
            <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirm_password" class="form-label">{{ $t('auth.register.confirmPassword') }}</label>
            <input
              type="password"
              id="confirm_password"
              v-model="form.confirm_password"
              class="form-input"
              :class="{ 'error': errors.confirm_password }"
              placeholder="Confirmez votre mot de passe"
              required
            />
            <span v-if="errors.confirm_password" class="form-error">{{ errors.confirm_password }}</span>
          </div>

          <div v-if="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            <span v-if="loading">{{ $t('auth.register.loading') }}</span>
            <span v-else>{{ $t('auth.register.submit') }}</span>
          </button>
        </form>

        <div class="register-footer">
          <p>{{ $t('auth.register.hasAccount') }}</p>
          <router-link to="/login" class="btn btn-outline">
            {{ $t('auth.register.login') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
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
        errors.first_name = 'Le prénom est requis'
        isValid = false
      } else if (form.first_name.length < 2) {
        errors.first_name = 'Le prénom doit contenir au moins 2 caractères'
        isValid = false
      }

      // Validation nom
      if (!form.last_name.trim()) {
        errors.last_name = 'Le nom est requis'
        isValid = false
      } else if (form.last_name.length < 2) {
        errors.last_name = 'Le nom doit contenir au moins 2 caractères'
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

      // Validation téléphone
      const phoneRegex = /^[0-9]{10}$/
      if (!form.phone) {
        errors.phone = 'Le téléphone est requis'
        isValid = false
      } else if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
        errors.phone = 'Format de téléphone invalide (10 chiffres)'
        isValid = false
      }

      // Validation mot de passe
      if (!form.password) {
        errors.password = 'Le mot de passe est requis'
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
        isValid = false
      }

      // Validation confirmation mot de passe
      if (!form.confirm_password) {
        errors.confirm_password = 'La confirmation du mot de passe est requise'
        isValid = false
      } else if (form.password !== form.confirm_password) {
        errors.confirm_password = 'Les mots de passe ne correspondent pas'
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
          name: `${form.first_name.trim()} ${form.last_name.trim()}`,
          email: form.email.toLowerCase(),
          phone: form.phone.replace(/\s/g, ''),
          password: form.password
        }

        const result = await authService.register(userData)
        
        if (result.success) {
          successMessage.value = 'Compte créé avec succès ! Redirection...'
          
          // Rediriger vers les restaurants après 2 secondes
          setTimeout(() => {
            router.push('/restaurants')
          }, 2000)
        } else {
          if (result.errors && result.errors.length > 0) {
            // Gérer les erreurs de validation du serveur
            result.errors.forEach(error => {
              if (error.path === 'email') errors.email = error.msg
              if (error.path === 'name') {
                errors.first_name = error.msg
                errors.last_name = error.msg
              }
              if (error.path === 'phone') errors.phone = error.msg
              if (error.path === 'password') errors.password = error.msg
            })
          } else {
            errorMessage.value = result.error
          }
        }
      } catch (err) {
        console.error('Erreur d\'inscription:', err)
        errorMessage.value = 'Une erreur inattendue s\'est produite'
      } finally {
        loading.value = false
      }
    }

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.container {
  width: 100%;
  max-width: 500px;
}

.register-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.register-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
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
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input.error {
  border-color: #dc3545;
}

.form-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.alert {
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.btn-full {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.register-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e1e5e9;
}

.register-footer p {
  margin-bottom: 1rem;
  color: #666;
}

@media (max-width: 600px) {
  .register-page {
    padding: 1rem;
  }
  
  .register-card {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
