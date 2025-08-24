/**
 * Tests du Système d'Annulation de Réservations
 * TFE - Système de Réservation en Ligne
 * 
 * Ce fichier contient les tests pour valider le bon fonctionnement
 * du système d'annulation de réservations.
 */

import cancellationService from '../services/cancellationService.js'

// Données de test
const testReservations = {
  // Réservation dans plus de 24h (100% remboursement)
  futureReservation: {
    id: 1,
    restaurant_name: 'Restaurant Test',
    date: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString().split('T')[0], // +25h
    time: '19:00',
    party_size: 4,
    status: 'confirmed',
    deposit_amount: 2000, // 20€
    customer_email: 'test@example.com'
  },

  // Réservation dans 12h (50% remboursement)
  soonReservation: {
    id: 2,
    restaurant_name: 'Restaurant Test',
    date: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString().split('T')[0], // +12h
    time: '20:00',
    party_size: 2,
    status: 'confirmed',
    deposit_amount: 1500, // 15€
    customer_email: 'test@example.com'
  },

  // Réservation dans 1h (pas de remboursement)
  urgentReservation: {
    id: 3,
    restaurant_name: 'Restaurant Test',
    date: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString().split('T')[0], // +1h
    time: '21:00',
    party_size: 6,
    status: 'confirmed',
    deposit_amount: 3000, // 30€
    customer_email: 'test@example.com'
  },

  // Réservation déjà annulée
  cancelledReservation: {
    id: 4,
    restaurant_name: 'Restaurant Test',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '19:30',
    party_size: 3,
    status: 'cancelled',
    deposit_amount: 2000,
    customer_email: 'test@example.com'
  }
}

/**
 * Test 1: Vérification des conditions d'annulation
 */
function testCancellationConditions() {
  console.log('🧪 Test 1: Conditions d\'annulation')
  
  const results = {
    future: cancellationService.canCancelReservation(testReservations.futureReservation),
    soon: cancellationService.canCancelReservation(testReservations.soonReservation),
    urgent: cancellationService.canCancelReservation(testReservations.urgentReservation),
    cancelled: cancellationService.canCancelReservation(testReservations.cancelledReservation)
  }

  console.log('✅ Réservation future (>24h):', results.future ? 'PASS' : 'FAIL')
  console.log('✅ Réservation proche (12h):', results.soon ? 'PASS' : 'FAIL')
  console.log('✅ Réservation urgente (1h):', results.urgent ? 'FAIL' : 'PASS')
  console.log('✅ Réservation annulée:', results.cancelled ? 'FAIL' : 'PASS')

  return results
}

/**
 * Test 2: Calcul des montants de remboursement
 */
function testRefundCalculation() {
  console.log('\n🧪 Test 2: Calcul des remboursements')
  
  const results = {
    future: cancellationService.calculateRefundAmount(testReservations.futureReservation),
    soon: cancellationService.calculateRefundAmount(testReservations.soonReservation),
    urgent: cancellationService.calculateRefundAmount(testReservations.urgentReservation)
  }

  console.log('💰 Remboursement future (>24h):', results.future, 'centimes (attendu: 2000)')
  console.log('💰 Remboursement proche (12h):', results.soon, 'centimes (attendu: 750)')
  console.log('💰 Remboursement urgent (1h):', results.urgent, 'centimes (attendu: 0)')

  const expected = {
    future: 2000,
    soon: 750,
    urgent: 0
  }

  const passed = Object.keys(results).every(key => results[key] === expected[key])
  console.log('✅ Test remboursements:', passed ? 'PASS' : 'FAIL')

  return { results, passed }
}

/**
 * Test 3: Raisons d'annulation
 */
function testCancellationReasons() {
  console.log('\n🧪 Test 3: Raisons d\'annulation')
  
  const reasons = cancellationService.getCancellationReasons()
  const expectedReasons = [
    'change_of_plans',
    'unavailable', 
    'found_alternative',
    'emergency',
    'weather',
    'other'
  ]

  console.log('📝 Raisons disponibles:', Object.keys(reasons))
  
  const allReasonsPresent = expectedReasons.every(reason => reasons[reason])
  console.log('✅ Toutes les raisons présentes:', allReasonsPresent ? 'PASS' : 'FAIL')

  // Test du texte des raisons
  console.log('📝 Texte des raisons:')
  expectedReasons.forEach(reason => {
    console.log(`   - ${reason}: "${cancellationService.getReasonText(reason)}"`)
  })

  return { reasons, allReasonsPresent }
}

/**
 * Test 4: Formatage des montants
 */
function testAmountFormatting() {
  console.log('\n🧪 Test 4: Formatage des montants')
  
  const testAmounts = [2000, 1500, 0, 100]
  const formatted = testAmounts.map(amount => cancellationService.formatAmount(amount))
  
  console.log('💶 Montants formatés:')
  testAmounts.forEach((amount, index) => {
    console.log(`   - ${amount} centimes → ${formatted[index]}`)
  })

  return formatted
}

/**
 * Test 5: Simulation d'annulation complète
 */
async function testFullCancellation() {
  console.log('\n🧪 Test 5: Simulation d\'annulation complète')
  
  try {
    const reservation = testReservations.futureReservation
    const reason = 'change_of_plans'
    
    console.log('🔄 Simulation annulation...')
    const result = await cancellationService.processCancellation(reservation, reason)
    
    if (result.success) {
      console.log('✅ Annulation réussie')
      console.log('📊 Détails:')
      console.log(`   - Statut: ${result.reservation.status}`)
      console.log(`   - Raison: ${result.reservation.cancellation_reason}`)
      console.log(`   - Remboursement: ${result.refundAmount} centimes`)
      console.log(`   - Date annulation: ${result.reservation.cancelled_at}`)
    } else {
      console.log('❌ Échec annulation:', result.error)
    }

    return result
  } catch (error) {
    console.log('❌ Erreur test:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Exécution de tous les tests
 */
async function runAllTests() {
  console.log('🚀 Démarrage des tests du système d\'annulation')
  console.log('=' .repeat(50))
  
  const results = {
    conditions: testCancellationConditions(),
    refunds: testRefundCalculation(),
    reasons: testCancellationReasons(),
    formatting: testAmountFormatting(),
    fullCancellation: await testFullCancellation()
  }

  console.log('\n' + '=' .repeat(50))
  console.log('📊 RÉSUMÉ DES TESTS')
  console.log('=' .repeat(50))
  
  const passed = [
    results.conditions.future && results.conditions.soon && !results.conditions.urgent && !results.conditions.cancelled,
    results.refunds.passed,
    results.reasons.allReasonsPresent,
    results.fullCancellation.success
  ].filter(Boolean).length

  const total = 4
  console.log(`✅ Tests réussis: ${passed}/${total}`)
  console.log(`📈 Taux de réussite: ${Math.round((passed/total) * 100)}%`)
  
  if (passed === total) {
    console.log('🎉 Tous les tests sont passés ! Le système d\'annulation fonctionne correctement.')
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez les détails ci-dessus.')
  }

  return results
}

// Export pour utilisation dans d'autres fichiers
export {
  runAllTests,
  testCancellationConditions,
  testRefundCalculation,
  testCancellationReasons,
  testAmountFormatting,
  testFullCancellation
}

// Exécution automatique si le fichier est lancé directement
if (typeof window !== 'undefined') {
  // Dans le navigateur, on peut lancer les tests via la console
  window.cancellationTests = {
    runAll: runAllTests,
    testConditions: testCancellationConditions,
    testRefunds: testRefundCalculation,
    testReasons: testCancellationReasons,
    testFormatting: testAmountFormatting,
    testFull: testFullCancellation
  }
  
  console.log('🧪 Tests d\'annulation disponibles. Utilisez:')
  console.log('   - window.cancellationTests.runAll() pour tous les tests')
  console.log('   - window.cancellationTests.testConditions() pour les conditions')
  console.log('   - etc...')
}
