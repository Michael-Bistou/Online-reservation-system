<template>
  <div class="payment-history-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Historique des Paiements</h1>
        <p class="page-subtitle">Consultez tous vos paiements et remboursements</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- Statistiques -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">💳</div>
              <div class="stat-content">
                <div class="stat-number">{{ paymentStats.totalTransactions }}</div>
                <div class="stat-label">Total transactions</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <div class="stat-number">{{ formatAmount(paymentStats.totalAmount) }}</div>
                <div class="stat-label">Montant total</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔄</div>
              <div class="stat-content">
                <div class="stat-number">{{ paymentStats.totalRefunds }}</div>
                <div class="stat-label">Remboursements</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-number">{{ formatAmount(paymentStats.netAmount) }}</div>
                <div class="stat-label">Montant net</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtres -->
        <div class="filters-section">
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">Type</label>
              <select v-model="selectedType" class="filter-select">
                <option value="">Tous les types</option>
                <option value="payment">Paiements</option>
                <option value="refund">Remboursements</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Statut</label>
              <select v-model="selectedStatus" class="filter-select">
                <option value="">Tous les statuts</option>
                <option value="succeeded">Réussi</option>
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
                placeholder="Rechercher par restaurant ou description..."
              />
            </div>
          </div>
        </div>

        <!-- Liste des transactions -->
        <div class="transactions-section">
          <div class="section-header">
            <h2>Transactions</h2>
            <button @click="refreshTransactions" class="btn btn-outline btn-sm">
              🔄 Actualiser
            </button>
          </div>

          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Chargement des transactions...</p>
          </div>

          <div v-else-if="filteredTransactions.length === 0" class="empty-state">
            <div class="empty-icon">💳</div>
            <h3>Aucune transaction trouvée</h3>
            <p>Aucune transaction ne correspond à vos critères de recherche.</p>
          </div>

          <div v-else class="transactions-list">
            <div 
              v-for="transaction in paginatedTransactions" 
              :key="transaction.id" 
              class="transaction-card"
              :class="{ 'refund': transaction.transactionId }"
            >
              <div class="transaction-header">
                <div class="transaction-info">
                  <div class="transaction-type" :class="`type-${transaction.transactionId ? 'refund' : 'payment'}`">
                    {{ transaction.transactionId ? '🔄 Remboursement' : '💳 Paiement' }}
                  </div>
                  <div class="transaction-status" :class="`status-${transaction.status}`">
                    {{ getStatusLabel(transaction.status) }}
                  </div>
                </div>
                <div class="transaction-amount">
                  <span :class="{ 'refund-amount': transaction.transactionId }">
                    {{ transaction.transactionId ? '-' : '+' }}{{ formatAmount(transaction.amount) }}
                  </span>
                </div>
              </div>
              
              <div class="transaction-content">
                <div class="transaction-details">
                  <div class="detail-row">
                    <strong>ID :</strong> {{ transaction.id }}
                  </div>
                  <div class="detail-row">
                    <strong>Restaurant :</strong> {{ transaction.restaurantName }}
                  </div>
                  <div class="detail-row">
                    <strong>Description :</strong> {{ transaction.description }}
                  </div>
                  <div class="detail-row">
                    <strong>Date :</strong> {{ formatDate(transaction.createdAt) }}
                  </div>
                  <div v-if="transaction.cardLast4" class="detail-row">
                    <strong>Carte :</strong> **** **** **** {{ transaction.cardLast4 }}
                  </div>
                  <div v-if="transaction.transactionId" class="detail-row">
                    <strong>Transaction originale :</strong> {{ transaction.transactionId }}
                  </div>
                  <div v-if="transaction.reason" class="detail-row">
                    <strong>Raison :</strong> {{ transaction.reason }}
                  </div>
                </div>
              </div>

              <div class="transaction-actions">
                <button @click="viewTransactionDetails(transaction)" class="btn btn-outline btn-sm">
                  👁️ Détails
                </button>
                <button 
                  v-if="!transaction.transactionId && transaction.status === 'succeeded'"
                  @click="requestRefund(transaction)" 
                  class="btn btn-outline btn-sm"
                >
                  🔄 Demander remboursement
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

    <!-- Modal pour voir les détails de la transaction -->
    <div v-if="showTransactionModal" class="modal-overlay" @click="closeTransactionModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Détails de la transaction</h3>
          <button @click="closeTransactionModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedTransaction" class="transaction-details-full">
            <div class="detail-section">
              <h4>Informations générales</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <strong>ID :</strong> {{ selectedTransaction.id }}
                </div>
                <div class="detail-item">
                  <strong>Type :</strong> {{ selectedTransaction.transactionId ? 'Remboursement' : 'Paiement' }}
                </div>
                <div class="detail-item">
                  <strong>Statut :</strong> {{ getStatusLabel(selectedTransaction.status) }}
                </div>
                <div class="detail-item">
                  <strong>Montant :</strong> {{ formatAmount(selectedTransaction.amount) }}
                </div>
                <div class="detail-item">
                  <strong>Date :</strong> {{ formatDate(selectedTransaction.createdAt) }}
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Informations de réservation</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <strong>Restaurant :</strong> {{ selectedTransaction.restaurantName }}
                </div>
                <div class="detail-item">
                  <strong>Description :</strong> {{ selectedTransaction.description }}
                </div>
                <div v-if="selectedTransaction.metadata" class="detail-item">
                  <strong>Date de réservation :</strong> {{ formatDate(selectedTransaction.metadata.reservationDate) }}
                </div>
                <div v-if="selectedTransaction.metadata" class="detail-item">
                  <strong>Heure :</strong> {{ selectedTransaction.metadata.reservationTime }}
                </div>
                <div v-if="selectedTransaction.metadata" class="detail-item">
                  <strong>Nombre de personnes :</strong> {{ selectedTransaction.metadata.partySize }}
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Informations client</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <strong>Nom :</strong> {{ selectedTransaction.customerName }}
                </div>
                <div class="detail-item">
                  <strong>Email :</strong> {{ selectedTransaction.customerEmail }}
                </div>
                <div v-if="selectedTransaction.cardLast4" class="detail-item">
                  <strong>Carte :</strong> **** **** **** {{ selectedTransaction.cardLast4 }}
                </div>
              </div>
            </div>

            <div v-if="selectedTransaction.transactionId" class="detail-section">
              <h4>Informations de remboursement</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <strong>Transaction originale :</strong> {{ selectedTransaction.transactionId }}
                </div>
                <div class="detail-item">
                  <strong>Raison :</strong> {{ selectedTransaction.reason }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeTransactionModal" class="btn btn-outline">Fermer</button>
          <button 
            v-if="!selectedTransaction?.transactionId && selectedTransaction?.status === 'succeeded'"
            @click="requestRefund(selectedTransaction)" 
            class="btn btn-primary"
          >
            🔄 Demander remboursement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import paymentService from '../services/paymentService.js'

export default {
  name: 'PaymentHistory',
  setup() {
    const transactions = ref([])
    const loading = ref(false)
    const selectedType = ref('')
    const selectedStatus = ref('')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const showTransactionModal = ref(false)
    const selectedTransaction = ref(null)

    // Computed properties
    const filteredTransactions = computed(() => {
      let filtered = transactions.value

      if (selectedType.value) {
        if (selectedType.value === 'payment') {
          filtered = filtered.filter(t => !t.transactionId)
        } else if (selectedType.value === 'refund') {
          filtered = filtered.filter(t => t.transactionId)
        }
      }

      if (selectedStatus.value) {
        filtered = filtered.filter(t => t.status === selectedStatus.value)
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(t => 
          t.restaurantName?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.customerName?.toLowerCase().includes(query)
        )
      }

      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredTransactions.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / itemsPerPage)
    })

    const paymentStats = computed(() => {
      return paymentService.getPaymentStats()
    })

    // Methods
    const loadTransactions = () => {
      loading.value = true
      try {
        transactions.value = paymentService.getTransactions()
      } catch (error) {
        console.error('Erreur lors du chargement des transactions:', error)
        transactions.value = []
      }
      loading.value = false
    }

    const refreshTransactions = () => {
      loadTransactions()
    }

    const getStatusLabel = (status) => {
      const labels = {
        succeeded: 'Réussi',
        failed: 'Échec',
        pending: 'En attente'
      }
      return labels[status] || status
    }

    const formatAmount = (amount) => {
      return paymentService.formatAmount(amount)
    }

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleString('fr-FR')
    }

    const viewTransactionDetails = (transaction) => {
      selectedTransaction.value = transaction
      showTransactionModal.value = true
    }

    const closeTransactionModal = () => {
      showTransactionModal.value = false
      selectedTransaction.value = null
    }

    const requestRefund = async (transaction) => {
      if (confirm(`Êtes-vous sûr de vouloir demander un remboursement de ${formatAmount(transaction.amount)} ?`)) {
        try {
          const result = await paymentService.processRefund(transaction.id)
          if (result.success) {
            alert('Remboursement traité avec succès !')
            loadTransactions() // Recharger les transactions
            closeTransactionModal()
          } else {
            alert(`Erreur lors du remboursement : ${result.error}`)
          }
        } catch (error) {
          alert('Erreur lors du traitement du remboursement')
          console.error('Erreur remboursement:', error)
        }
      }
    }

    // Lifecycle
    onMounted(() => {
      loadTransactions()
    })

    return {
      transactions,
      loading,
      selectedType,
      selectedStatus,
      searchQuery,
      currentPage,
      showTransactionModal,
      selectedTransaction,
      filteredTransactions,
      paginatedTransactions,
      totalPages,
      paymentStats,
      loadTransactions,
      refreshTransactions,
      getStatusLabel,
      formatAmount,
      formatDate,
      viewTransactionDetails,
      closeTransactionModal,
      requestRefund
    }
  }
}
</script>

<style scoped>
.payment-history-page {
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

/* Statistiques */
.stats-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
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

/* Transactions */
.transactions-section {
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

.section-header h2 {
  margin: 0;
  color: #333;
}

.transaction-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  background: white;
}

.transaction-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.transaction-card.refund {
  border-left: 4px solid #ff6b6b;
  background: #fff5f5;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.transaction-info {
  display: flex;
  gap: 10px;
}

.transaction-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.type-payment { background: #e3f2fd; color: #1976d2; }
.type-refund { background: #ffebee; color: #d32f2f; }

.transaction-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-succeeded { background: #e8f5e8; color: #2e7d32; }
.status-failed { background: #ffebee; color: #d32f2f; }
.status-pending { background: #fff3e0; color: #f57c00; }

.transaction-amount {
  font-size: 1.2rem;
  font-weight: bold;
  color: #28a745;
}

.refund-amount {
  color: #dc3545;
}

.transaction-content {
  margin-bottom: 15px;
}

.transaction-details {
  line-height: 1.6;
}

.detail-row {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #333;
}

.transaction-actions {
  display: flex;
  gap: 10px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
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
  font-size: 1.3rem;
  font-weight: 700;
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

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  gap: 10px;
}

.detail-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.5;
}

.detail-item strong {
  color: #333;
  font-weight: 600;
}

.detail-item:last-child {
  border-bottom: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #f8f9fa;
}

/* États vides et chargement */
.loading-container,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #333;
}

.loading-container p {
  color: #666;
  margin-top: 15px;
  font-size: 0.95rem;
}

.empty-state h3 {
  color: #333;
  margin: 15px 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.empty-state p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
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
  
  .transaction-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .transaction-actions {
    flex-direction: column;
  }
}
</style>
