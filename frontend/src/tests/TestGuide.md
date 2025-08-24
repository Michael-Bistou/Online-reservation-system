# 🧪 Guide de Test - Système d'Annulation de Réservations

## 📋 **Objectif du Test**
Valider que le système d'annulation de réservations fonctionne correctement dans toutes les situations.

## 🎯 **Scénarios de Test**

### **Test 1 : Conditions d'Annulation**
**Objectif :** Vérifier que seules les réservations annulables peuvent être annulées.

**Étapes :**
1. Allez dans "Mes réservations"
2. Identifiez différentes réservations :
   - ✅ Réservation future (>24h) → Doit avoir bouton "Annuler"
   - ✅ Réservation proche (2-24h) → Doit avoir bouton "Annuler"  
   - ❌ Réservation urgente (<2h) → Ne doit PAS avoir bouton "Annuler"
   - ❌ Réservation déjà annulée → Ne doit PAS avoir bouton "Annuler"

**Résultat attendu :** Seules les réservations annulables affichent le bouton "Annuler".

---

### **Test 2 : Calcul des Remboursements**
**Objectif :** Vérifier que les remboursements sont calculés correctement selon la politique.

**Étapes :**
1. Cliquez sur "Annuler" pour une réservation future (>24h)
2. Vérifiez dans le modal : "Remboursement : 100% de l'acompte"
3. Faites de même pour une réservation proche (2-24h)
4. Vérifiez : "Remboursement : 50% de l'acompte"
5. Faites de même pour une réservation urgente (<2h)
6. Vérifiez : "Remboursement : 0€"

**Résultat attendu :** Les montants de remboursement correspondent à la politique définie.

---

### **Test 3 : Raisons d'Annulation**
**Objectif :** Vérifier que toutes les raisons d'annulation sont disponibles.

**Étapes :**
1. Cliquez sur "Annuler" pour une réservation
2. Dans le modal, vérifiez la liste des raisons :
   - ✅ Changement de plans
   - ✅ Indisponibilité
   - ✅ Autre restaurant trouvé
   - ✅ Urgence personnelle
   - ✅ Conditions météo
   - ✅ Autre raison
3. Sélectionnez "Autre raison"
4. Vérifiez qu'un champ texte apparaît

**Résultat attendu :** Toutes les raisons sont présentes et le champ personnalisé fonctionne.

---

### **Test 4 : Processus d'Annulation Complet**
**Objectif :** Tester le processus complet d'annulation.

**Étapes :**
1. Cliquez sur "Annuler" pour une réservation
2. Sélectionnez une raison d'annulation
3. Cliquez sur "Confirmer l'annulation"
4. Vérifiez :
   - ✅ Message de succès s'affiche
   - ✅ Le statut change à "Annulée"
   - ✅ L'email d'annulation apparaît dans "Emails"
   - ✅ Notification push apparaît (si autorisée)

**Résultat attendu :** L'annulation se déroule sans erreur et toutes les notifications sont envoyées.

---

### **Test 5 : Notifications**
**Objectif :** Vérifier que les notifications sont envoyées correctement.

**Étapes :**
1. Annulez une réservation
2. Allez dans "Emails"
3. Vérifiez qu'un email "Réservation annulée" apparaît
4. Cliquez sur "Voir" pour lire le contenu
5. Vérifiez que l'email contient :
   - ✅ Détails de la réservation
   - ✅ Raison de l'annulation
   - ✅ Informations de remboursement

**Résultat attendu :** Les emails sont envoyés avec le bon contenu.

---

## 🚀 **Tests Automatiques**

Pour lancer les tests automatiques :

1. Ouvrez la console du navigateur (F12)
2. Tapez : `window.cancellationTests.runAll()`
3. Vérifiez les résultats dans la console

**Commandes disponibles :**
- `window.cancellationTests.runAll()` - Tous les tests
- `window.cancellationTests.testConditions()` - Test des conditions
- `window.cancellationTests.testRefunds()` - Test des remboursements
- `window.cancellationTests.testReasons()` - Test des raisons
- `window.cancellationTests.testFormatting()` - Test du formatage
- `window.cancellationTests.testFull()` - Test complet

---

## 📊 **Documentation des Résultats**

Pour votre TFE, documentez vos résultats :

### **Tableau de Résultats**
| Test | Statut | Observations |
|------|--------|--------------|
| Conditions d'annulation | ✅/❌ | |
| Calcul des remboursements | ✅/❌ | |
| Raisons d'annulation | ✅/❌ | |
| Processus complet | ✅/❌ | |
| Notifications | ✅/❌ | |

### **Problèmes Découverts**
- [ ] Problème 1 : Description
- [ ] Problème 2 : Description

### **Améliorations Suggérées**
- [ ] Amélioration 1 : Description
- [ ] Amélioration 2 : Description

---

## 🎓 **Pour votre TFE**

**Points à mentionner dans votre rapport :**
1. **Méthodologie de test** : Tests manuels + tests automatiques
2. **Couverture de test** : Tous les scénarios critiques testés
3. **Résultats** : Taux de réussite des tests
4. **Limitations** : Tests en environnement de développement
5. **Améliorations futures** : Tests automatisés plus poussés

**Niveau adapté étudiant :** Ces tests sont simples mais complets, montrant une approche professionnelle tout en restant accessible.
