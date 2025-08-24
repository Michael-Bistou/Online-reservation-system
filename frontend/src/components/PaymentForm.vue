<template>
  <div class="payment-form">
    <div class="payment-header">
      <h3>💳 Paiement sécurisé</h3>
      <p class="payment-subtitle">Acompte pour confirmer votre réservation</p>
    </div>

    <div class="payment-summary">
      <div class="summary-item">
        <span>Montant de l'acompte :</span>
        <span class="amount">{{ formatAmount(depositAmount) }}</span>
      </div>
      <div class="summary-item">
        <span>Restaurant :</span>
        <span>{{ restaurantName }}</span>
      </div>
      <div class="summary-item">
        <span>Date :</span>
        <span>{{ formatDate(reservationDate) }}</span>
      </div>
      <div class="summary-item">
        <span>Heure :</span>
        <span>{{ reservationTime }}</span>
      </div>
      <div class="summary-item">
        <span>Nombre de personnes :</span>
        <span>{{ partySize }}</span>
      </div>
    </div>

    <form @submit.prevent="handlePayment" class="payment-form-content">
      <!-- Informations personnelles -->
      <div class="form-section">
        <h4>Informations personnelles</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="customerName">Nom complet *</label>
            <input
              id="customerName"
              v-model="paymentData.customerName"
              type="text"
              required
              placeholder="Votre nom complet"
              :class="{ 'error': errors.customerName }"
            />
            <span v-if="errors.customerName" class="error-message">{{ errors.customerName }}</span>
          </div>
          <div class="form-group">
            <label for="customerEmail">Email *</label>
            <input
              id="customerEmail"
              v-model="paymentData.customerEmail"
              type="email"
              required
              placeholder="votre@email.com"
              :class="{ 'error': errors.customerEmail }"
            />
            <span v-if="errors.customerEmail" class="error-message">{{ errors.customerEmail }}</span>
          </div>
        </div>
      </div>

      <!-- Informations de paiement -->
      <div class="form-section">
        <h4>Informations de paiement</h4>
        
        <div class="form-group">
          <label for="cardNumber">Numéro de carte *</label>
          <div class="card-input-wrapper">
            <input
              id="cardNumber"
              v-model="paymentData.cardNumber"
              type="text"
              required
              placeholder="1234 5678 9012 3456"
              maxlength="19"
              @input="formatCardNumber"
              :class="{ 'error': errors.cardNumber }"
            />
            <div class="card-icons">
              <span class="card-icon">💳</span>
            </div>
          </div>
          <span v-if="errors.cardNumber" class="error-message">{{ errors.cardNumber }}</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="expiryMonth">Mois d'expiration *</label>
            <select
              id="expiryMonth"
              v-model="paymentData.expiryMonth"
              required
              :class="{ 'error': errors.expiryMonth }"
            >
              <option value="">Mois</option>
              <option v-for="month in 12" :key="month" :value="month.toString().padStart(2, '0')">
                {{ month.toString().padStart(2, '0') }}
              </option>
            </select>
            <span v-if="errors.expiryMonth" class="error-message">{{ errors.expiryMonth }}</span>
          </div>
          
          <div class="form-group">
            <label for="expiryYear">Année d'expiration *</label>
            <select
              id="expiryYear"
              v-model="paymentData.expiryYear"
              required
              :class="{ 'error': errors.expiryYear }"
            >
              <option value="">Année</option>
              <option v-for="year in 10" :key="year" :value="(new Date().getFullYear() + 1 + year).toString()">
                {{ new Date().getFullYear() + 1 + year }}
              </option>
            </select>
            <span v-if="errors.expiryYear" class="error-message">{{ errors.expiryYear }}</span>
          </div>
          
          <div class="form-group">
            <label for="cvc">CVC *</label>
            <input
              id="cvc"
              v-model="paymentData.cvc"
              type="text"
              required
              placeholder="123"
              maxlength="4"
              @input="formatCVC"
              :class="{ 'error': errors.cvc }"
            />
            <span v-if="errors.cvc" class="error-message">{{ errors.cvc }}</span>
          </div>
        </div>
      </div>

      <!-- Conditions -->
      <div class="form-section">
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="paymentData.acceptTerms"
              type="checkbox"
              required
            />
            <span class="checkmark"></span>
            J'accepte les <a href="#" @click.prevent="showTerms">conditions générales</a> et la 
            <a href="#" @click.prevent="showPrivacy">politique de confidentialité</a>
          </label>
        </div>
      </div>

      <!-- Bouton de paiement -->
      <div class="payment-actions">
        <button
          type="submit"
          :disabled="processing || !paymentData.acceptTerms"
          class="btn btn-primary btn-large"
        >
          <span v-if="processing" class="loading-spinner"></span>
          {{ processing ? 'Traitement en cours...' : `Payer ${formatAmount(depositAmount)}` }}
        </button>
        
        <button
          type="button"
          @click="$emit('cancel')"
          class="btn btn-outline"
          :disabled="processing"
        >
          Annuler
        </button>
      </div>
    </form>

    <!-- Messages d'erreur/succès -->
    <div v-if="errorMessage" class="error-alert">
      <div class="alert-icon">❌</div>
      <div class="alert-content">
        <strong>Erreur de paiement</strong>
        <p>{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Sécurité -->
    <div class="security-info">
      <div class="security-icon">🔒</div>
      <div class="security-text">
        <strong>Paiement sécurisé</strong>
        <p>Vos informations de paiement sont chiffrées et sécurisées</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import paymentService from '../services/paymentService.js'

export default {
  name: 'PaymentForm',
  props: {
    reservationId: {
      type: String,
      required: true
    },
    restaurantName: {
      type: String,
      required: true
    },
    restaurantPriceRange: {
      type: String,
      default: '€€'
    },
    reservationDate: {
      type: String,
      required: true
    },
    reservationTime: {
      type: String,
      required: true
    },
    partySize: {
      type: Number,
      required: true
    }
  },
  emits: ['success', 'cancel'],
  setup(props, { emit }) {
    const processing = ref(false)
    const errorMessage = ref('')
    const errors = ref({})

    const paymentData = ref({
      customerName: '',
      customerEmail: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      acceptTerms: false
    })

    // Calculer le montant de l'acompte
    const depositAmount = computed(() => {
      return paymentService.calculateDeposit(props.partySize, props.restaurantPriceRange) * 100 // En centimes
    })

    // Formater le numéro de carte
    const formatCardNumber = () => {
      let value = paymentData.value.cardNumber.replace(/\D/g, '')
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
      paymentData.value.cardNumber = value
    }

    // Formater le CVC
    const formatCVC = () => {
      paymentData.value.cvc = paymentData.value.cvc.replace(/\D/g, '')
    }

    // Valider le formulaire
    const validateForm = () => {
      errors.value = {}

      if (!paymentData.value.customerName.trim()) {
        errors.value.customerName = 'Le nom est requis'
      }

      if (!paymentData.value.customerEmail.trim()) {
        errors.value.customerEmail = 'L\'email est requis'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.value.customerEmail)) {
        errors.value.customerEmail = 'Format d\'email invalide'
      }

      const cardNumber = paymentData.value.cardNumber.replace(/\s/g, '')
      if (!cardNumber) {
        errors.value.cardNumber = 'Le numéro de carte est requis'
      } else if (!paymentService.validateCardNumber(cardNumber)) {
        errors.value.cardNumber = 'Numéro de carte invalide'
      }

      if (!paymentData.value.expiryMonth) {
        errors.value.expiryMonth = 'Le mois d\'expiration est requis'
      }

      if (!paymentData.value.expiryYear) {
        errors.value.expiryYear = 'L\'année d\'expiration est requise'
      }

      if (!paymentData.value.cvc) {
        errors.value.cvc = 'Le CVC est requis'
      } else if (paymentData.value.cvc.length < 3) {
        errors.value.cvc = 'Le CVC doit contenir 3 ou 4 chiffres'
      }

      return Object.keys(errors.value).length === 0
    }

    // Traiter le paiement
    const handlePayment = async () => {
      if (!validateForm()) {
        return
      }

      processing.value = true
      errorMessage.value = ''

      try {
        const paymentResult = await paymentService.processPayment({
          reservationId: props.reservationId,
          amount: depositAmount.value,
          cardNumber: paymentData.value.cardNumber.replace(/\s/g, ''),
          expiryMonth: paymentData.value.expiryMonth,
          expiryYear: paymentData.value.expiryYear,
          cvc: paymentData.value.cvc,
          customerEmail: paymentData.value.customerEmail,
          customerName: paymentData.value.customerName,
          restaurantName: props.restaurantName,
          partySize: props.partySize,
          reservationDate: props.reservationDate,
          reservationTime: props.reservationTime
        })

        if (paymentResult.success) {
          emit('success', paymentResult)
        } else {
          errorMessage.value = paymentResult.error
        }
      } catch (error) {
        errorMessage.value = 'Une erreur inattendue s\'est produite'
        console.error('Erreur lors du paiement:', error)
      } finally {
        processing.value = false
      }
    }

    // Formater un montant
    const formatAmount = (amount) => {
      return paymentService.formatAmount(amount)
    }

    // Formater une date
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('fr-FR')
    }

    // Afficher les conditions
    const showTerms = () => {
      alert('Conditions générales - À implémenter')
    }

    // Afficher la politique de confidentialité
    const showPrivacy = () => {
      alert('Politique de confidentialité - À implémenter')
    }

    return {
      processing,
      errorMessage,
      errors,
      paymentData,
      depositAmount,
      formatCardNumber,
      formatCVC,
      handlePayment,
      formatAmount,
      formatDate,
      showTerms,
      showPrivacy
    }
  }
}
</script>

<style scoped>
.payment-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.payment-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
}

.payment-header h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
}

.payment-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.payment-summary {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.amount {
  font-weight: bold;
  color: #28a745;
  font-size: 1.1rem;
}

.payment-form-content {
  padding: 30px;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  color: #333;
  background-color: white;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  color: #333;
  background-color: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error,
.form-group select.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.card-input-wrapper {
  position: relative;
}

.card-icons {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.card-icon {
  font-size: 1.2rem;
}

.checkbox-group {
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 10px;
  margin-top: 2px;
}

.checkbox-label a {
  color: #667eea;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.payment-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-alert {
  display: flex;
  align-items: flex-start;
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin: 20px;
  border: 1px solid #f5c6cb;
}

.alert-icon {
  font-size: 1.2rem;
  margin-right: 10px;
  margin-top: 2px;
}

.alert-content strong {
  display: block;
  margin-bottom: 5px;
}

.alert-content p {
  margin: 0;
  font-size: 0.9rem;
}

.security-info {
  display: flex;
  align-items: center;
  background: #e8f5e8;
  padding: 15px;
  margin: 20px;
  border-radius: 8px;
  border: 1px solid #c3e6c3;
}

.security-icon {
  font-size: 1.5rem;
  margin-right: 15px;
}

.security-text strong {
  display: block;
  color: #155724;
  margin-bottom: 5px;
}

.security-text p {
  margin: 0;
  color: #155724;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .payment-actions {
    flex-direction: column;
  }
  
  .btn-large {
    width: 100%;
  }
}
</style>
