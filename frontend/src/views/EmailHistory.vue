<template>
  <div class="email-history-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Historique des Emails</h1>
        <p class="page-subtitle">Consultez tous les emails envoyés par le système</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- Filtres -->
        <div class="filters-section">
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">Type d'email</label>
              <select v-model="selectedType" class="filter-select">
                <option value="">Tous les types</option>
                <option value="confirmation">Confirmation</option>
                <option value="new_reservation">Nouvelle réservation</option>
                <option value="reminder">Rappel</option>
                <option value="cancellation">Annulation</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Statut</label>
              <select v-model="selectedStatus" class="filter-select">
                <option value="">Tous les statuts</option>
                <option value="sent">Envoyé</option>
                <option value="failed">Échec</option>
                <option value="pending">En attente</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Recherche</label>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="filter-input" 
                placeholder="Rechercher par destinataire ou sujet..."
              />
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ totalEmails }}</div>
              <div class="stat-label">Total emails</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ sentEmails }}</div>
              <div class="stat-label">Envoyés</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ confirmationEmails }}</div>
              <div class="stat-label">Confirmations</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ reminderEmails }}</div>
              <div class="stat-label">Rappels</div>
            </div>
          </div>
        </div>

        <!-- Liste des emails -->
        <div class="emails-section">
          <div class="section-header">
            <h2>Emails envoyés</h2>
            <button @click="refreshEmails" class="btn btn-outline btn-sm">
              🔄 Actualiser
            </button>
          </div>

          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Chargement des emails...</p>
          </div>

          <div v-else-if="filteredEmails.length === 0" class="empty-state">
            <div class="empty-icon">📧</div>
            <h3>Aucun email trouvé</h3>
            <p>Aucun email ne correspond à vos critères de recherche.</p>
          </div>

          <div v-else class="emails-list">
            <div 
              v-for="email in paginatedEmails" 
              :key="email.id" 
              class="email-card"
              :class="{ 'email-read': email.read }"
            >
              <div class="email-header">
                <div class="email-info">
                  <div class="email-type" :class="`type-${email.type}`">
                    {{ getTypeLabel(email.type) }}
                  </div>
                  <div class="email-status" :class="`status-${email.status}`">
                    {{ getStatusLabel(email.status) }}
                  </div>
                </div>
                <div class="email-date">
                  {{ formatDate(email.timestamp) }}
                </div>
              </div>
              
              <div class="email-content">
                <div class="email-to">
                  <strong>À :</strong> {{ email.to }}
                </div>
                <div class="email-subject">
                  <strong>Sujet :</strong> {{ email.subject }}
                </div>
                <div class="email-preview">
                  {{ truncateContent(email.content) }}
                </div>
              </div>

              <div class="email-actions">
                <button @click="viewEmail(email)" class="btn btn-outline btn-sm">
                  👁️ Voir
                </button>
                <button @click="resendEmail(email)" class="btn btn-outline btn-sm">
                  📤 Renvoyer
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="btn btn-outline btn-sm"
            >
              ← Précédent
            </button>
            
            <span class="page-info">
              Page {{ currentPage }} sur {{ totalPages }}
            </span>
            
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="btn btn-outline btn-sm"
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour voir l'email complet -->
    <div v-if="showEmailModal" class="modal-overlay" @click="closeEmailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Détails de l'email</h3>
          <button @click="closeEmailModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="email-details">
            <div class="detail-row">
              <strong>Destinataire :</strong> {{ selectedEmail?.to }}
            </div>
            <div class="detail-row">
              <strong>Sujet :</strong> {{ selectedEmail?.subject }}
            </div>
            <div class="detail-row">
              <strong>Type :</strong> {{ getTypeLabel(selectedEmail?.type) }}
            </div>
            <div class="detail-row">
              <strong>Statut :</strong> {{ getStatusLabel(selectedEmail?.status) }}
            </div>
            <div class="detail-row">
              <strong>Date :</strong> {{ formatDate(selectedEmail?.timestamp) }}
            </div>
            <div class="detail-row">
              <strong>Contenu :</strong>
            </div>
            <div class="email-content-full">
              <pre>{{ selectedEmail?.content }}</pre>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeEmailModal" class="btn btn-outline">Fermer</button>
          <button @click="resendEmail(selectedEmail)" class="btn btn-primary">
            📤 Renvoyer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'EmailHistory',
  setup() {
    const emails = ref([])
    const loading = ref(false)
    const selectedType = ref('')
    const selectedStatus = ref('')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const showEmailModal = ref(false)
    const selectedEmail = ref(null)

    // Computed properties
    const filteredEmails = computed(() => {
      let filtered = emails.value

      if (selectedType.value) {
        filtered = filtered.filter(email => email.type === selectedType.value)
      }

      if (selectedStatus.value) {
        filtered = filtered.filter(email => email.status === selectedStatus.value)
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(email => 
          email.to.toLowerCase().includes(query) ||
          email.subject.toLowerCase().includes(query) ||
          email.content.toLowerCase().includes(query)
        )
      }

      return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    })

    const paginatedEmails = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredEmails.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredEmails.value.length / itemsPerPage)
    })

    const totalEmails = computed(() => emails.value.length)
    const sentEmails = computed(() => emails.value.filter(e => e.status === 'sent').length)
    const confirmationEmails = computed(() => emails.value.filter(e => e.type === 'confirmation').length)
    const reminderEmails = computed(() => emails.value.filter(e => e.type === 'reminder').length)

    // Methods
    const loadEmails = () => {
      loading.value = true
      try {
        const stored = localStorage.getItem('emailHistory')
        emails.value = stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error('Erreur lors du chargement des emails:', error)
        emails.value = []
      }
      loading.value = false
    }

    const refreshEmails = () => {
      loadEmails()
    }

    const getTypeLabel = (type) => {
      const labels = {
        confirmation: 'Confirmation',
        new_reservation: 'Nouvelle réservation',
        reminder: 'Rappel',
        cancellation: 'Annulation'
      }
      return labels[type] || type
    }

    const getStatusLabel = (status) => {
      const labels = {
        sent: 'Envoyé',
        failed: 'Échec',
        pending: 'En attente'
      }
      return labels[status] || status
    }

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleString('fr-FR')
    }

    const truncateContent = (content) => {
      return content.length > 100 ? content.substring(0, 100) + '...' : content
    }

    const viewEmail = (email) => {
      selectedEmail.value = email
      showEmailModal.value = true
    }

    const closeEmailModal = () => {
      showEmailModal.value = false
      selectedEmail.value = null
    }

    const resendEmail = (email) => {
      // Simuler le renvoi
      console.log(`📧 Renvoi de l'email à ${email.to}`)
      alert(`Email renvoyé à ${email.to}`)
    }

    // Lifecycle
    onMounted(() => {
      loadEmails()
    })

    return {
      emails,
      loading,
      selectedType,
      selectedStatus,
      searchQuery,
      currentPage,
      showEmailModal,
      selectedEmail,
      filteredEmails,
      paginatedEmails,
      totalPages,
      totalEmails,
      sentEmails,
      confirmationEmails,
      reminderEmails,
      loadEmails,
      refreshEmails,
      getTypeLabel,
      getStatusLabel,
      formatDate,
      truncateContent,
      viewEmail,
      closeEmailModal,
      resendEmail
    }
  }
}
</script>

<style scoped>
.email-history-page {
  min-height: 100vh;
  background: var(--surface-color);
  padding-top: 80px;
}

.page-header {
  background: var(--primary-color);
  color: white;
  padding: 40px 0;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 1;
  color: #f0f0f0;
}

.page-content {
  padding: 40px 0;
}

/* Filtres */
.filters-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  background-color: white;
}

/* Statistiques */
.stats-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* Liste des emails */
.emails-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header .btn {
  color: #333;
  border-color: #ddd;
}

.section-header .btn:hover {
  background-color: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

.section-header h2 {
  margin: 0;
  color: #333;
}

.email-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  background: white;
}

.email-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.email-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.email-info {
  display: flex;
  gap: 10px;
}

.email-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.type-confirmation { background: #e3f2fd; color: #1976d2; }
.type-new_reservation { background: #f3e5f5; color: #7b1fa2; }
.type-reminder { background: #fff3e0; color: #f57c00; }
.type-cancellation { background: #ffebee; color: #d32f2f; }

.email-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-sent { background: #e8f5e8; color: #2e7d32; }
.status-failed { background: #ffebee; color: #d32f2f; }
.status-pending { background: #fff3e0; color: #f57c00; }

.email-date {
  font-size: 0.9rem;
  color: #666;
}

.email-content {
  margin-bottom: 15px;
}

.email-to,
.email-subject {
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #333;
}

.email-preview {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
}

.email-actions {
  display: flex;
  gap: 10px;
}

.email-actions .btn {
  color: #333;
  border-color: #ddd;
}

.email-actions .btn:hover {
  background-color: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.pagination .btn {
  color: #333;
  border-color: #ddd;
}

.pagination .btn:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

.pagination .btn:disabled {
  color: #999;
  border-color: #eee;
  background-color: #f5f5f5;
}

.page-info {
  font-weight: 500;
  color: #333;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.email-details {
  line-height: 1.6;
  color: #333;
}

.detail-row {
  margin-bottom: 10px;
  color: #333;
}

.email-content-full {
  margin-top: 15px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  color: #333;
}

.email-content-full pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #ddd;
}

.modal-footer .btn {
  color: #333;
  border-color: #ddd;
}

.modal-footer .btn:hover {
  background-color: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

.modal-footer .btn-primary {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
}

.modal-footer .btn-primary:hover {
  background-color: #5a6fd8;
  border-color: #5a6fd8;
}

/* États vides et chargement */
.loading-container,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #333;
}

.loading-container p {
  color: #333;
  margin-top: 10px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ddd;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin-bottom: 10px;
  color: #333;
}

.empty-state p {
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .email-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .email-actions {
    flex-direction: column;
  }
}
</style>
