<template>
  <div class="profile-page">
    <!-- Header Section -->
    <div class="page-header dark-bg">
      <div class="container">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">Mon Profil</h1>
            <p class="page-subtitle">Gérez vos informations personnelles et consultez vos statistiques</p>
          </div>
          <div class="user-avatar">
            <div class="avatar-circle">
              <span class="avatar-initial">{{ userInitials }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <h3>{{ $t('common.error') }}</h3>
          <p>{{ error }}</p>
          <button @click="loadProfile" class="btn-primary">
            {{ $t('common.retry') }}
          </button>
        </div>

        <!-- Profile Content -->
        <div v-else class="profile-content">
          <!-- Mon Activité Section -->
          <div class="activity-section light-bg">
            <h2 class="section-title">Mes Statistiques</h2>
            <div class="activity-grid">
              <div class="activity-card light-bg">
                <div class="activity-icon">📅</div>
                <div class="activity-content">
                  <div class="activity-number">{{ userActivity.totalReservations }}</div>
                  <div class="activity-label">Réservations totales</div>
                </div>
              </div>
              <div class="activity-card light-bg">
                <div class="activity-icon">✅</div>
                <div class="activity-content">
                  <div class="activity-number">{{ userActivity.confirmedReservations }}</div>
                  <div class="activity-label">Réservations confirmées</div>
                </div>
              </div>
              <div class="activity-card light-bg">
                <div class="activity-icon">❌</div>
                <div class="activity-content">
                  <div class="activity-number">{{ userActivity.cancelledReservations }}</div>
                  <div class="activity-label">Réservations annulées</div>
                </div>
              </div>
              <div class="activity-card light-bg">
                <div class="activity-icon">🏪</div>
                <div class="activity-content">
                  <div class="activity-number">{{ userActivity.uniqueRestaurants }}</div>
                  <div class="activity-label">Restaurants visités</div>
                </div>
              </div>
              <div class="activity-card light-bg">
                <div class="activity-icon">💰</div>
                <div class="activity-content">
                  <div class="activity-number">{{ userActivity.totalSpent }}</div>
                  <div class="activity-label">Montant total dépensé</div>
                </div>
              </div>
              <div class="activity-card light-bg">
                <div class="activity-icon">📧</div>
                <div class="activity-content">
                  <div class="activity-number">{{ userActivity.totalEmails }}</div>
                  <div class="activity-label">Emails reçus</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Info Section -->
          <div class="info-section light-bg">
            <div class="section-header">
              <h2 class="section-title">Informations personnelles</h2>
              <button 
                v-if="!editingPersonalInfo" 
                @click="startEditPersonalInfo" 
                class="btn-outline btn-sm"
              >
                Modifier
              </button>
            </div>

            <div class="info-card light-bg">
              <div v-if="!editingPersonalInfo" class="info-display">
                <div class="info-row">
                  <span class="info-label">Nom complet</span>
                  <span class="info-value">{{ userProfile.full_name }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Adresse email</span>
                  <span class="info-value">{{ userProfile.email }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Téléphone</span>
                  <span class="info-value">{{ userProfile.phone || 'Non renseigné' }}</span>
                </div>
              </div>

              <form v-else @submit.prevent="savePersonalInfo" class="info-form">
                <div class="form-group">
                  <label class="form-label">Nom complet</label>
                  <input
                    v-model="editForm.full_name"
                    type="text"
                    class="form-input"
                    required
                  />
                  <span v-if="errors.full_name" class="error-message">{{ errors.full_name }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">Adresse email</label>
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="form-input"
                    required
                  />
                  <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">Téléphone</label>
                  <input
                    v-model="editForm.phone"
                    type="tel"
                    class="form-input"
                    placeholder="01 23 45 67 89"
                  />
                  <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                </div>

                <div class="form-actions">
                  <button type="button" @click="cancelEditPersonalInfo" class="btn-outline">
                    Annuler
                  </button>
                  <button type="submit" class="btn-primary" :disabled="saving">
                    <span v-if="saving" class="loading-spinner-small"></span>
                    {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Password Section -->
          <div class="info-section light-bg">
            <div class="section-header">
              <h2 class="section-title">Sécurité du compte</h2>
              <button 
                v-if="!editingPassword" 
                @click="startEditPassword" 
                class="btn-outline btn-sm"
              >
                Modifier le mot de passe
              </button>
            </div>

            <div class="info-card light-bg">
              <div v-if="!editingPassword" class="info-display">
                <div class="info-row">
                  <span class="info-label">Sécurité du compte</span>
                  <span class="info-value">••••••••</span>
                </div>
                <p class="info-note">Pour des raisons de sécurité, vous devez entrer votre mot de passe actuel</p>
              </div>

              <form v-else @submit.prevent="changePassword" class="info-form">
                <div class="form-group">
                  <label class="form-label">Mot de passe actuel</label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="form-input"
                    required
                  />
                  <span v-if="passwordErrors.currentPassword" class="error-message">{{ passwordErrors.currentPassword }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">Nouveau mot de passe</label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="form-input"
                    required
                  />
                  <span v-if="passwordErrors.newPassword" class="error-message">{{ passwordErrors.newPassword }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">Confirmer le nouveau mot de passe</label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="form-input"
                    required
                  />
                  <span v-if="passwordErrors.confirmPassword" class="error-message">{{ passwordErrors.confirmPassword }}</span>
                </div>

                <div class="form-actions">
                  <button type="button" @click="cancelEditPassword" class="btn-outline">
                    Annuler
                  </button>
                  <button type="submit" class="btn-primary" :disabled="changingPassword">
                    <span v-if="changingPassword" class="loading-spinner-small"></span>
                    {{ changingPassword ? 'Modification...' : 'Changer le mot de passe' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Account Actions Section -->
          <div class="actions-section light-bg">
            <h2 class="section-title">Actions</h2>
            <div class="actions-grid">
              <button @click="exportData" class="action-card light-bg">
                <div class="action-icon">📊</div>
                <div class="action-content">
                  <h3>Exporter mes données</h3>
                  <p>Téléchargez toutes vos données personnelles au format JSON</p>
                </div>
              </button>
              
              <button @click="showDeleteAccountModal = true" class="action-card danger light-bg">
                <div class="action-icon">🗑️</div>
                <div class="action-content">
                  <h3>Supprimer mon compte</h3>
                  <p>Supprimez définitivement votre compte et toutes vos données</p>
                </div>
              </button>


            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteAccountModal" class="modal-overlay" @click="showDeleteAccountModal = false">
      <div class="modal-content light-bg" @click.stop>
        <div class="modal-header">
          <h3>Confirmer la suppression du compte</h3>
          <button @click="showDeleteAccountModal = false" class="modal-close">×</button>
        </div>
        
        <div class="modal-body">
          <div class="warning-message">
            <div class="warning-icon">⚠️</div>
            <h4>Attention : Cette action est irréversible</h4>
            <p>En supprimant votre compte, vous perdrez définitivement :</p>
            <ul>
              <li>Toutes vos réservations</li>
              <li>Vos informations personnelles</li>
              <li>Votre historique d'activité</li>
            </ul>
            <p><strong>Cette action ne peut pas être annulée</strong></p>
          </div>
          
          <div class="modal-actions">
            <button @click="showDeleteAccountModal = false" class="btn-outline">
              Annuler
            </button>
            <button @click="deleteAccount" class="btn-danger" :disabled="deletingAccount">
              <span v-if="deletingAccount" class="loading-spinner-small"></span>
              {{ deletingAccount ? 'Suppression...' : 'Supprimer définitivement' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import authService from '../services/auth.js'
import paymentService from '../services/paymentService.js'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    
    // Reactive data
    const userProfile = ref({})
    const loading = ref(true)
    const error = ref(null)
    const saving = ref(false)
    const changingPassword = ref(false)
    const deletingAccount = ref(false)
    
    // Edit states
    const editingPersonalInfo = ref(false)
    const editingPassword = ref(false)
    const showDeleteAccountModal = ref(false)
    
    // Forms
    const editForm = ref({
      full_name: '',
      email: '',
      phone: ''
    })
    
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // Errors
    const errors = ref({})
    const passwordErrors = ref({})

    // Computed properties
    const userInitials = computed(() => {
      if (!userProfile.value.full_name) return 'U'
      return userProfile.value.full_name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    })

    const userActivity = computed(() => {
      // Récupérer les réservations depuis la même source que Reservations.vue
      const restaurantReservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]')
      
      // Récupérer les données de l'utilisateur connecté
      const currentUser = authService.getCurrentUser()
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const userEmail = currentUser?.email || userData?.email
      
      // Filtrer les réservations de l'utilisateur actuel
      const userReservations = restaurantReservations.filter(reservation => {
        // Vérifier par email ou user_id
        return reservation.user_email === userEmail || 
               reservation.customer_email === userEmail ||
               reservation.user_id === currentUser?.id ||
               reservation.user_id === userData?.id
      })
      

      
      // Calculer les statistiques
      const totalReservations = userReservations.length
      const confirmedReservations = userReservations.filter(r => r.status === 'confirmed').length
      const cancelledReservations = userReservations.filter(r => r.status === 'cancelled').length
      const pendingReservations = userReservations.filter(r => r.status === 'pending').length
      const completedReservations = userReservations.filter(r => r.status === 'completed').length
      
      // Restaurants uniques
      const uniqueRestaurants = new Set(userReservations.map(r => r.restaurant_name)).size
      
      // Total dépensé (utiliser la même logique que paymentService.getPaymentStats())
      const paymentTransactions = JSON.parse(localStorage.getItem('paymentTransactions') || '[]')
      
      // Filtrer les transactions de l'utilisateur actuel
      const userPaymentTransactions = paymentTransactions.filter(transaction => {
        return transaction.customerEmail === userEmail || 
               transaction.customerName === userData?.full_name ||
               transaction.customerName === currentUser?.full_name
      })
      
      // Utiliser la même logique que getPaymentStats()
      const totalTransactions = userPaymentTransactions.filter(t => t.status === 'succeeded' && !t.transactionId)
      const totalRefunds = userPaymentTransactions.filter(t => t.transactionId) // Les remboursements ont un transactionId
      
      const totalAmount = totalTransactions.reduce((sum, t) => sum + t.amount, 0)
      const totalRefunded = totalRefunds.reduce((sum, r) => sum + r.amount, 0)
      
      const totalSpent = totalAmount - totalRefunded
      
      
      
      // Emails reçus
      const emailHistory = JSON.parse(localStorage.getItem('emailHistory') || '[]')
      const userEmails = emailHistory.filter(email => 
        email.to === userEmail || email.customerEmail === userEmail
      )
      const totalEmails = userEmails.length
      
      
      
      return {
        totalReservations,
        confirmedReservations,
        cancelledReservations,
        uniqueRestaurants,
        totalSpent: formatAmount(totalSpent),
        totalEmails
      }
    })

    const formatAmount = (amount) => {
      return paymentService.formatAmount(amount)
    }

    // Methods
    const loadProfile = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Try to get from auth service first
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          userProfile.value = {
            id: currentUser.id || 1,
            full_name: currentUser.full_name || `${currentUser.first_name} ${currentUser.last_name}`,
            email: currentUser.email,
            phone: currentUser.phone || '',
            created_at: currentUser.created_at || new Date().toISOString()
          }
        } else {
          // Fallback to sample data
          userProfile.value = getSampleProfile()
        }
        
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err)
        error.value = t('profile.error')
      } finally {
        loading.value = false
      }
    }

    const getSampleProfile = () => {
      // Try to get user data from localStorage first
      const userData = localStorage.getItem('userData')
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          return {
            id: parsedData.id || 1,
            full_name: parsedData.full_name || parsedData.firstName + ' ' + parsedData.lastName,
            email: parsedData.email,
            phone: parsedData.phone || '',
            created_at: parsedData.created_at || new Date().toISOString()
          }
        } catch (e) {
          console.error('Erreur parsing localStorage:', e)
        }
      }
      
      // Fallback to sample data
      return {
        id: 1,
        full_name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        phone: '01 23 45 67 89',
        created_at: '2023-06-15T10:30:00Z'
      }
    }

    const startEditPersonalInfo = () => {
      editForm.value = {
        full_name: userProfile.value.full_name,
        email: userProfile.value.email,
        phone: userProfile.value.phone || ''
      }
      errors.value = {}
      editingPersonalInfo.value = true
    }

    const cancelEditPersonalInfo = () => {
      editingPersonalInfo.value = false
      errors.value = {}
    }

    const validatePersonalInfo = () => {
      errors.value = {}
      
      if (!editForm.value.full_name.trim()) {
        errors.value.full_name = t('profile.personalInfo.errors.nameRequired')
      } else if (editForm.value.full_name.trim().length < 2) {
        errors.value.full_name = t('profile.personalInfo.errors.nameMin')
      }
      
      if (!editForm.value.email.trim()) {
        errors.value.email = t('profile.personalInfo.errors.emailRequired')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.value.email)) {
        errors.value.email = t('profile.personalInfo.errors.emailInvalid')
      }
      
      if (editForm.value.phone && !/^0[1-9](\d{8})$/.test(editForm.value.phone.replace(/\s/g, ''))) {
        errors.value.phone = t('profile.personalInfo.errors.phoneInvalid')
      }
      
      return Object.keys(errors.value).length === 0
    }

    const savePersonalInfo = async () => {
      if (!validatePersonalInfo()) return
      
      try {
        saving.value = true
        
        // For now, just update locally
        userProfile.value = {
          ...userProfile.value,
          ...editForm.value
        }
        
        editingPersonalInfo.value = false
        alert(t('profile.personalInfo.success'))
        
      } catch (err) {
        console.error('Erreur lors de la sauvegarde:', err)
        alert(t('profile.personalInfo.errors.profile_update_error'))
      } finally {
        saving.value = false
      }
    }

    const startEditPassword = () => {
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      passwordErrors.value = {}
      editingPassword.value = true
    }

    const cancelEditPassword = () => {
      editingPassword.value = false
      passwordErrors.value = {}
    }

    const validatePassword = () => {
      passwordErrors.value = {}
      
      if (!passwordForm.value.currentPassword) {
        passwordErrors.value.currentPassword = t('profile.password.errors.currentRequired')
      }
      
      if (!passwordForm.value.newPassword) {
        passwordErrors.value.newPassword = t('profile.password.errors.newRequired')
      } else if (passwordForm.value.newPassword.length < 6) {
        passwordErrors.value.newPassword = t('profile.password.errors.newMin')
      }
      
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordErrors.value.confirmPassword = t('profile.password.errors.confirmMatch')
      }
      
      return Object.keys(passwordErrors.value).length === 0
    }

    const changePassword = async () => {
      if (!validatePassword()) return
      
      try {
        changingPassword.value = true
        
        // For now, just show success message
        alert(t('profile.password.success'))
        editingPassword.value = false
        
      } catch (err) {
        console.error('Erreur lors du changement de mot de passe:', err)
        alert(t('profile.password.errors.currentIncorrect'))
      } finally {
        changingPassword.value = false
      }
    }

    const exportData = () => {
      // For now, just show a message
      alert('Fonctionnalité d\'export à implémenter')
    }

    const deleteAccount = async () => {
      try {
        deletingAccount.value = true
        
        // For now, just redirect to logout
        alert('Compte supprimé avec succès')
        router.push('/login')
        
      } catch (err) {
        console.error('Erreur lors de la suppression du compte:', err)
        alert('Erreur lors de la suppression du compte')
      } finally {
        deletingAccount.value = false
        showDeleteAccountModal.value = false
      }
    }




    // Lifecycle
    onMounted(() => {
      loadProfile()
      
      // Écouter les changements dans localStorage pour mettre à jour les stats
      const handleStorageChange = (event) => {
        if (event.key === 'restaurantReservations' || event.key === 'emailHistory') {
    
          // Forcer la recalcul en touchant une propriété réactive
          userProfile.value = { ...userProfile.value }
        }
      }
      
          // Écouter les changements de langue
    const handleLanguageChange = () => {
      // Le composant se mettra à jour automatiquement grâce aux $t()
    }
      
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('languageChanged', handleLanguageChange)
      
      // Nettoyer les écouteurs lors du démontage
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('languageChanged', handleLanguageChange)
      }
    })

    return {
      userProfile,
      loading,
      error,
      saving,
      changingPassword,
      deletingAccount,
      editingPersonalInfo,
      editingPassword,
      showDeleteAccountModal,
      editForm,
      passwordForm,
      errors,
      passwordErrors,
      userInitials,
      userActivity,
      loadProfile,
      startEditPersonalInfo,
      cancelEditPersonalInfo,
      savePersonalInfo,
      startEditPassword,
      cancelEditPassword,
              changePassword,
        exportData,
        deleteAccount
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--surface-color);
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  color: white;
  padding: 60px 0 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
}

.page-subtitle {
  font-size: 1.1rem;
  color: white;
  margin: 0;
}

.user-avatar {
  display: flex;
  align-items: center;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar-initial {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

/* Main Content */
.main-content {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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

/* Profile Content */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Mon Activité Section */
.activity-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #2c3e50;
  font-family: 'Playfair Display', serif;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.activity-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #333;
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.activity-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
}

.activity-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.activity-label {
  font-size: 0.9rem;
  color: #e0e0e0;
  margin-top: 5px;
}

/* Info Sections */
.info-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid #dee2e6;
  color: #2c3e50;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-outline:hover {
  border-color: #d4af37;
  color: #d4af37;
  background-color: #f8f9fa;
}

/* Info Card */
.info-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #333;
}

.info-display {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #333;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: white;
  min-width: 120px;
}

.info-value {
  color: #e0e0e0;
  text-align: right;
}

.info-note {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin: 0;
  font-style: italic;
}

/* Forms */
.info-form {
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
  color: white;
  font-size: 0.9rem;
}

.form-input {
  padding: 12px 15px;
  border: 2px solid #333;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #2a2a2a;
  color: white;
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.form-actions .btn-outline,
.form-actions .btn-primary {
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

.form-actions .btn-primary {
  background-color: #d4af37;
  border: 2px solid #d4af37;
  color: white;
}

.form-actions .btn-primary:hover {
  background-color: #b8941f;
  border-color: #b8941f;
  color: white;
}

/* Actions Section */
.actions-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.action-card.danger {
  border-color: #fee2e2;
  background: #fef2f2;
}

.action-card.danger:hover {
  border-color: #ef4444;
  background: #fef2f2;
}



.action-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
}

.action-card.danger .action-icon {
  background: #ef4444;
}



.action-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #2c3e50;
}

.action-content p {
  font-size: 0.9rem;
  color: #5a6c7d;
  margin: 0;
}

/* Modal Styles */
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
  color: var(--text-primary);
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

.warning-message {
  text-align: center;
  margin-bottom: 30px;
}

.warning-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.warning-message h4 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.warning-message p {
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.warning-message ul {
  text-align: left;
  margin: 15px 0;
  padding-left: 20px;
}

.warning-message li {
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.modal-actions .btn-outline,
.modal-actions .btn-danger {
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

.btn-danger {
  background: #ef4444;
  border: 2px solid #ef4444;
  color: white;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #dc2626;
  border-color: #dc2626;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-value {
    text-align: left;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .modal-content {
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 40px 0 30px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .info-section,
  .stats-section,
  .actions-section {
    padding: 20px;
  }
  
  .modal-header,
  .modal-body {
    padding: 20px;
  }
}
</style>
