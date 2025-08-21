<template>
  <div class="profile-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Mon Profil</h1>
        <p class="page-subtitle">Gérez vos informations personnelles</p>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Chargement de votre profil...</p>
      </div>

      <!-- Contenu principal -->
      <div v-else class="profile-content">
        <!-- Statistiques utilisateur -->
        <div class="stats-section">
          <h2 class="section-title">📊 Mes Statistiques</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-info">
                <span class="stat-number">{{ userStats.totalReservations }}</span>
                <span class="stat-label">Réservations totales</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <span class="stat-number">{{ userStats.confirmedReservations }}</span>
                <span class="stat-label">Réservations confirmées</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🍽️</div>
              <div class="stat-info">
                <span class="stat-number">{{ userStats.favoriteRestaurants }}</span>
                <span class="stat-label">Restaurants favoris</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">👤</div>
              <div class="stat-info">
                <span class="stat-number">{{ formatMemberSince(profile.created_at) }}</span>
                <span class="stat-label">Membre depuis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations personnelles -->
        <div class="profile-section">
          <div class="section-header">
            <h2 class="section-title">👤 Informations Personnelles</h2>
            <button 
              @click="toggleEditMode" 
              class="btn btn-outline"
              :class="{ 'btn-primary': !editMode }"
            >
              {{ editMode ? '❌ Annuler' : '✏️ Modifier' }}
            </button>
          </div>

          <form @submit.prevent="updateProfile" class="profile-form">
            <!-- Nom -->
            <div class="form-group">
              <label for="name">Nom complet</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                :readonly="!editMode"
                :class="{ 'form-control': true, 'readonly': !editMode, 'error': errors.name }"
                required
              >
              <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">Adresse email</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                :readonly="!editMode"
                :class="{ 'form-control': true, 'readonly': !editMode, 'error': errors.email }"
                required
              >
              <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>

            <!-- Téléphone -->
            <div class="form-group">
              <label for="phone">Numéro de téléphone</label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                :readonly="!editMode"
                :class="{ 'form-control': true, 'readonly': !editMode, 'error': errors.phone }"
              >
              <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
            </div>

            <!-- Boutons d'action -->
            <div v-if="editMode" class="form-actions">
              <button type="button" @click="cancelEdit" class="btn btn-outline">
                Annuler
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="updateLoading"
              >
                {{ updateLoading ? 'Sauvegarde...' : '💾 Sauvegarder' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Changement de mot de passe -->
        <div class="password-section">
          <div class="section-header">
            <h2 class="section-title">🔒 Changer le Mot de Passe</h2>
            <button 
              @click="togglePasswordMode" 
              class="btn btn-outline"
              :class="{ 'btn-primary': !passwordMode }"
            >
              {{ passwordMode ? '❌ Annuler' : '🔑 Modifier' }}
            </button>
          </div>

          <form v-if="passwordMode" @submit.prevent="updatePassword" class="password-form">
            <!-- Mot de passe actuel -->
            <div class="form-group">
              <label for="currentPassword">Mot de passe actuel</label>
              <input
                id="currentPassword"
                v-model="passwordData.currentPassword"
                type="password"
                class="form-control"
                :class="{ 'error': passwordErrors.currentPassword }"
                required
              >
              <span v-if="passwordErrors.currentPassword" class="error-text">
                {{ passwordErrors.currentPassword }}
              </span>
            </div>

            <!-- Nouveau mot de passe -->
            <div class="form-group">
              <label for="newPassword">Nouveau mot de passe</label>
              <input
                id="newPassword"
                v-model="passwordData.newPassword"
                type="password"
                class="form-control"
                :class="{ 'error': passwordErrors.newPassword }"
                required
              >
              <span v-if="passwordErrors.newPassword" class="error-text">
                {{ passwordErrors.newPassword }}
              </span>
            </div>

            <!-- Confirmation du nouveau mot de passe -->
            <div class="form-group">
              <label for="confirmPassword">Confirmer le nouveau mot de passe</label>
              <input
                id="confirmPassword"
                v-model="passwordData.confirmPassword"
                type="password"
                class="form-control"
                :class="{ 'error': passwordErrors.confirmPassword }"
                required
              >
              <span v-if="passwordErrors.confirmPassword" class="error-text">
                {{ passwordErrors.confirmPassword }}
              </span>
            </div>

            <!-- Boutons d'action -->
            <div class="form-actions">
              <button type="button" @click="cancelPasswordEdit" class="btn btn-outline">
                Annuler
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="passwordLoading"
              >
                {{ passwordLoading ? 'Changement...' : '🔒 Changer le mot de passe' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Messages de succès/erreur -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'Profile',
  setup() {
    const loading = ref(false)
    const updateLoading = ref(false)
    const passwordLoading = ref(false)
    const editMode = ref(false)
    const passwordMode = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const profile = ref({})
    const userStats = reactive({
      totalReservations: 0,
      confirmedReservations: 0,
      favoriteRestaurants: 0
    })

    const formData = reactive({
      name: '',
      email: '',
      phone: ''
    })

    const passwordData = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const errors = reactive({
      name: '',
      email: '',
      phone: ''
    })

    const passwordErrors = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // Charger le profil utilisateur
    const loadProfile = async () => {
      loading.value = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        profile.value = response.data
        formData.name = response.data.name
        formData.email = response.data.email
        formData.phone = response.data.phone || ''
        
        // Simuler des statistiques (en attendant les vraies API)
        userStats.totalReservations = Math.floor(Math.random() * 20) + 1
        userStats.confirmedReservations = Math.floor(userStats.totalReservations * 0.8)
        userStats.favoriteRestaurants = Math.floor(Math.random() * 5) + 1
        
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err)
        errorMessage.value = 'Erreur lors du chargement du profil'
      } finally {
        loading.value = false
      }
    }

    // Validation des données
    const validateForm = () => {
      clearErrors()
      let isValid = true

      if (!formData.name.trim()) {
        errors.name = 'Le nom est requis'
        isValid = false
      } else if (formData.name.trim().length < 2) {
        errors.name = 'Le nom doit contenir au moins 2 caractères'
        isValid = false
      }

      if (!formData.email.trim()) {
        errors.email = 'L\'email est requis'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Format d\'email invalide'
        isValid = false
      }

      if (formData.phone && !/^[0-9+\s-()]+$/.test(formData.phone)) {
        errors.phone = 'Format de téléphone invalide'
        isValid = false
      }

      return isValid
    }

    const validatePassword = () => {
      clearPasswordErrors()
      let isValid = true

      if (!passwordData.currentPassword) {
        passwordErrors.currentPassword = 'Le mot de passe actuel est requis'
        isValid = false
      }

      if (!passwordData.newPassword) {
        passwordErrors.newPassword = 'Le nouveau mot de passe est requis'
        isValid = false
      } else if (passwordData.newPassword.length < 6) {
        passwordErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères'
        isValid = false
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        passwordErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
        isValid = false
      }

      return isValid
    }

    const clearErrors = () => {
      errors.name = ''
      errors.email = ''
      errors.phone = ''
    }

    const clearPasswordErrors = () => {
      passwordErrors.currentPassword = ''
      passwordErrors.newPassword = ''
      passwordErrors.confirmPassword = ''
    }

    const clearMessages = () => {
      successMessage.value = ''
      errorMessage.value = ''
    }

    // Actions
    const toggleEditMode = () => {
      editMode.value = !editMode.value
      if (!editMode.value) {
        // Restaurer les données originales
        formData.name = profile.value.name
        formData.email = profile.value.email
        formData.phone = profile.value.phone || ''
        clearErrors()
      }
      clearMessages()
    }

    const togglePasswordMode = () => {
      passwordMode.value = !passwordMode.value
      if (!passwordMode.value) {
        passwordData.currentPassword = ''
        passwordData.newPassword = ''
        passwordData.confirmPassword = ''
        clearPasswordErrors()
      }
      clearMessages()
    }

    const cancelEdit = () => {
      toggleEditMode()
    }

    const cancelPasswordEdit = () => {
      togglePasswordMode()
    }

    const updateProfile = async () => {
      if (!validateForm()) return

      updateLoading.value = true
      clearMessages()

      try {
        const token = localStorage.getItem('token')
        await axios.put('http://localhost:3000/api/auth/profile', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        profile.value.name = formData.name
        profile.value.email = formData.email
        profile.value.phone = formData.phone
        
        editMode.value = false
        successMessage.value = 'Profil mis à jour avec succès !'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 5000)

      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err)
        if (err.response?.data?.errors) {
          const serverErrors = err.response.data.errors
          serverErrors.forEach(error => {
            if (error.path === 'email') errors.email = error.msg
            if (error.path === 'name') errors.name = error.msg
            if (error.path === 'phone') errors.phone = error.msg
          })
        } else {
          errorMessage.value = 'Erreur lors de la mise à jour du profil'
        }
      } finally {
        updateLoading.value = false
      }
    }

    const updatePassword = async () => {
      if (!validatePassword()) return

      passwordLoading.value = true
      clearMessages()

      try {
        const token = localStorage.getItem('token')
        await axios.put('http://localhost:3000/api/auth/password', {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        passwordMode.value = false
        passwordData.currentPassword = ''
        passwordData.newPassword = ''
        passwordData.confirmPassword = ''
        
        successMessage.value = 'Mot de passe changé avec succès !'
        
        setTimeout(() => {
          successMessage.value = ''
        }, 5000)

      } catch (err) {
        console.error('Erreur lors du changement de mot de passe:', err)
        if (err.response?.status === 400) {
          passwordErrors.currentPassword = 'Mot de passe actuel incorrect'
        } else {
          errorMessage.value = 'Erreur lors du changement de mot de passe'
        }
      } finally {
        passwordLoading.value = false
      }
    }

    // Utilitaires
    const formatMemberSince = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 30) {
        return `${diffDays} jours`
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months} mois`
      } else {
        const years = Math.floor(diffDays / 365)
        return `${years} an${years > 1 ? 's' : ''}`
      }
    }

    // Charger les données au montage
    onMounted(() => {
      loadProfile()
    })

    return {
      loading,
      updateLoading,
      passwordLoading,
      editMode,
      passwordMode,
      successMessage,
      errorMessage,
      profile,
      userStats,
      formData,
      passwordData,
      errors,
      passwordErrors,
      toggleEditMode,
      togglePasswordMode,
      cancelEdit,
      cancelPasswordEdit,
      updateProfile,
      updatePassword,
      formatMemberSince
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 2rem 0;
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-section, .profile-section, .password-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  background: #007bff;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.profile-form, .password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-control.readonly {
  background: #f8f9fa;
  cursor: default;
}

.form-control.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
