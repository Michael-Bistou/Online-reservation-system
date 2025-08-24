# 📖 Guide d'Utilisation - Système de Réservation de Restaurants

## 🎯 Introduction

Ce guide vous accompagne dans l'utilisation du système de réservation de restaurants. Il couvre toutes les fonctionnalités disponibles pour les différents types d'utilisateurs.

## 👥 Types d'Utilisateurs

### 👤 Utilisateur Standard
- Recherche et réservation de tables
- Gestion de son profil
- Historique des réservations

### 🏪 Restaurant
- Gestion des réservations
- Configuration des tables
- Statistiques et rapports

### 🔧 Administrateur
- Gestion complète du système
- Supervision des utilisateurs et restaurants
- Logs d'audit et sauvegardes

## 🏠 Interface Utilisateur Standard

### Page d'Accueil

#### Navigation
- **Logo** : Retour à l'accueil
- **Menu** : Navigation entre les pages
- **Sélecteur de langue** : FR/EN
- **Connexion/Inscription** : Accès aux comptes

#### Sections Principales
1. **Hero Section** : Présentation du service
2. **Fonctionnalités** : Avantages du système
3. **Restaurants Vedettes** : Carrousel de 3 restaurants
4. **Témoignages** : Avis clients

#### Carrousel des Restaurants
- **Navigation** : Flèches gauche/droite
- **Indicateurs** : Points de navigation
- **Affichage** : 3 restaurants simultanément
- **Transition** : Glissement fluide

### Recherche de Restaurants

#### Filtres Disponibles
- **Recherche textuelle** : Nom du restaurant
- **Type de cuisine** : Française, Japonaise, Italienne, etc.
- **Fourchette de prix** : €, €€, €€€, €€€€
- **Note minimum** : 3.0, 3.5, 4.0, 4.5 étoiles

#### Affichage des Résultats
- **Cartes restaurants** : Image, nom, note, prix
- **Informations** : Adresse, type de cuisine, nombre d'avis
- **Actions** : Voir détails, Réserver

#### Tri et Pagination
- **Tri par** : Popularité, Note, Prix
- **Pagination** : Navigation entre les pages

### Détails d'un Restaurant

#### Informations Générales
- **Photos** : Images du restaurant
- **Description** : Présentation détaillée
- **Note et avis** : Évaluation clients
- **Informations pratiques** : Adresse, téléphone, email

#### Horaires et Services
- **Horaires d'ouverture** : Jours et heures
- **Équipements** : WiFi, Parking, Terrasse, etc.
- **Services** : Livraison, Emporter, etc.

#### Réservation
- **Sélection de date** : Calendrier interactif
- **Sélection d'heure** : Créneaux disponibles
- **Nombre de personnes** : 1 à 20 personnes
- **Demandes spéciales** : Champ de texte libre

### Processus de Réservation

#### Étape 1 : Sélection
1. Choisir la date
2. Sélectionner l'heure
3. Indiquer le nombre de personnes
4. Ajouter des demandes spéciales

#### Étape 2 : Confirmation
- **Récapitulatif** : Détails de la réservation
- **Acompte** : Calcul automatique selon le restaurant
- **Conditions** : Politique d'annulation

#### Étape 3 : Paiement
- **Méthode** : Carte bancaire (simulation Stripe)
- **Sécurité** : Paiement sécurisé
- **Confirmation** : Email de confirmation

### Gestion des Réservations

#### Mes Réservations
- **Liste** : Toutes les réservations
- **Statut** : Confirmée, En attente, Annulée
- **Actions** : Modifier, Annuler, Voir détails

#### Modification
- **Changements possibles** : Date, heure, nombre de personnes
- **Limitations** : Selon la politique du restaurant
- **Frais** : Possibles selon les conditions

#### Annulation
- **Délai** : Selon la politique du restaurant
- **Remboursement** : Automatique si applicable
- **Confirmation** : Email de confirmation

### Profil Utilisateur

#### Informations Personnelles
- **Données** : Nom, prénom, email, téléphone
- **Modification** : Mise à jour des informations
- **Sécurité** : Changement de mot de passe

#### Activité
- **Statistiques** : Nombre de réservations, montant total
- **Historique** : Réservations passées
- **Préférences** : Restaurants favoris

#### Actions
- **Export données** : Téléchargement des données personnelles
- **Suppression compte** : Fermeture définitive du compte

## 🏪 Interface Restaurant

### Dashboard Restaurant

#### Vue d'Ensemble
- **Réservations du jour** : Nombre et statuts
- **Revenus** : Chiffre d'affaires du jour/mois
- **Occupation** : Taux d'occupation des tables
- **Graphiques** : Évolution des réservations

#### Actions Rapides
- **Nouvelle réservation** : Création manuelle
- **Gestion tables** : Configuration des disponibilités
- **Messages** : Communication avec les clients

### Gestion des Réservations

#### Liste des Réservations
- **Filtres** : Date, statut, nombre de personnes
- **Recherche** : Par nom client ou numéro de réservation
- **Actions** : Confirmer, modifier, annuler

#### Détails d'une Réservation
- **Informations client** : Nom, téléphone, email
- **Détails réservation** : Date, heure, nombre de personnes
- **Paiement** : Statut de l'acompte
- **Historique** : Modifications précédentes

#### Actions Disponibles
- **Confirmation** : Accepter la réservation
- **Modification** : Changer les détails
- **Annulation** : Annuler avec motif
- **Contact** : Envoyer un message au client

### Gestion des Tables

#### Configuration
- **Ajout de tables** : Nombre et capacité
- **Disponibilités** : Horaires d'ouverture
- **Fermetures** : Jours de fermeture
- **Capacité** : Nombre maximum de personnes

#### Plan de Salle
- **Visualisation** : Disposition des tables
- **Statuts** : Libre, Réservée, Occupée
- **Optimisation** : Suggestions d'aménagement

### Statistiques et Rapports

#### Métriques Clés
- **Taux d'occupation** : Pourcentage d'utilisation
- **Revenus** : Chiffre d'affaires par période
- **Popularité** : Heures et jours les plus demandés
- **Satisfaction** : Notes et commentaires clients

#### Graphiques
- **Évolution temporelle** : Réservations par jour/semaine/mois
- **Répartition** : Par heure, par jour de la semaine
- **Comparaison** : Périodes similaires

#### Export
- **Rapports** : PDF, Excel, CSV
- **Périodes** : Journalier, hebdomadaire, mensuel
- **Données** : Réservations, revenus, statistiques

### Communication

#### Emails Automatiques
- **Confirmations** : Réservations confirmées
- **Rappels** : 24h avant la réservation
- **Annulations** : Confirmations d'annulation
- **Personnalisation** : Messages personnalisés

#### Historique des Communications
- **Envois** : Tous les emails envoyés
- **Statuts** : Livré, ouvert, cliqué
- **Templates** : Modèles de messages

## 🔧 Interface Administration

### Dashboard Administrateur

#### Vue d'Ensemble
- **Utilisateurs** : Nombre total et nouveaux
- **Restaurants** : Nombre total et actifs
- **Réservations** : Total et du jour
- **Activité récente** : Dernières actions

#### Graphiques
- **Évolution** : Croissance des utilisateurs
- **Répartition** : Utilisateurs par type
- **Performance** : Taux de conversion

### Gestion des Utilisateurs

#### Liste des Utilisateurs
- **Filtres** : Type, statut, date d'inscription
- **Recherche** : Par nom, email, téléphone
- **Actions** : Voir, modifier, désactiver

#### Détails Utilisateur
- **Informations** : Données personnelles
- **Activité** : Réservations et paiements
- **Statistiques** : Fréquence d'utilisation
- **Actions** : Modification, désactivation

#### Actions Disponibles
- **Modification** : Changer les informations
- **Désactivation** : Suspendre le compte
- **Réactivation** : Réactiver un compte
- **Suppression** : Supprimer définitivement

### Gestion des Restaurants

#### Liste des Restaurants
- **Filtres** : Statut, type de cuisine, note
- **Recherche** : Par nom, adresse
- **Actions** : Voir, modifier, désactiver

#### Détails Restaurant
- **Informations** : Données du restaurant
- **Configuration** : Tables et horaires
- **Statistiques** : Réservations et revenus
- **Actions** : Modification, désactivation

#### Actions Disponibles
- **Modification** : Changer les informations
- **Désactivation** : Suspendre le restaurant
- **Réactivation** : Réactiver un restaurant
- **Suppression** : Supprimer définitivement

### Gestion des Réservations

#### Liste des Réservations
- **Filtres** : Restaurant, statut, date
- **Recherche** : Par client ou restaurant
- **Actions** : Voir, modifier, annuler

#### Détails Réservation
- **Informations** : Client et restaurant
- **Détails** : Date, heure, nombre de personnes
- **Paiement** : Statut et montant
- **Historique** : Modifications

#### Actions Disponibles
- **Modification** : Changer les détails
- **Annulation** : Annuler avec motif
- **Contact** : Contacter client ou restaurant

### Logs d'Audit

#### Types de Logs
- **Connexions** : Tentatives de connexion
- **Actions** : Modifications de données
- **Erreurs** : Problèmes système
- **Sécurité** : Actions sensibles

#### Filtres
- **Type** : Connexion, action, erreur, sécurité
- **Utilisateur** : Par utilisateur
- **Date** : Période spécifique
- **Niveau** : Info, Warning, Error

#### Détails d'un Log
- **Timestamp** : Date et heure exacte
- **Utilisateur** : Qui a effectué l'action
- **Action** : Description détaillée
- **Données** : Informations complémentaires

### Sauvegarde et Maintenance

#### Sauvegarde de Base de Données
- **Automatique** : Quotidienne
- **Manuelle** : À la demande
- **Format** : SQLite, SQL, JSON
- **Stockage** : Local ou cloud

#### Maintenance
- **Nettoyage** : Suppression des anciens logs
- **Optimisation** : Défragmentation de la base
- **Vérification** : Intégrité des données
- **Mise à jour** : Schéma de base de données

## 🌐 Fonctionnalités Multilingues

### Changement de Langue
- **Sélecteur** : Dans le header
- **Langues** : Français (FR) et Anglais (EN)
- **Persistance** : Sauvegarde du choix
- **Traduction** : Interface complète

### Contenu Traduit
- **Interface** : Boutons, menus, messages
- **Contenu** : Descriptions, informations
- **Emails** : Templates multilingues
- **Erreurs** : Messages d'erreur

## 🔐 Sécurité et Confidentialité

### Authentification
- **Connexion sécurisée** : JWT tokens
- **Mots de passe** : Hachage bcrypt
- **Sessions** : Gestion sécurisée
- **Déconnexion** : Invalidation des tokens

### Protection des Données
- **Chiffrement** : Données sensibles
- **Accès** : Contrôle d'accès par rôle
- **Audit** : Traçabilité des actions
- **Conformité** : RGPD

### Sécurité du Paiement
- **Stripe** : Paiement sécurisé
- **Chiffrement** : Données de carte
- **Validation** : Vérification des transactions
- **Remboursement** : Processus sécurisé

## 📱 Responsive Design

### Adaptation Mobile
- **Interface** : Optimisée pour mobile
- **Navigation** : Menu hamburger
- **Formulaires** : Champs adaptés
- **Images** : Redimensionnement automatique

### Tablettes
- **Layout** : Adaptation intermédiaire
- **Interactions** : Touch-friendly
- **Performance** : Optimisée

### Desktop
- **Interface complète** : Toutes les fonctionnalités
- **Navigation** : Menu complet
- **Productivité** : Raccourcis clavier

## 🆘 Support et Aide

### Centre d'Aide
- **FAQ** : Questions fréquentes
- **Tutoriels** : Guides vidéo
- **Documentation** : Guides détaillés
- **Contact** : Support technique

### Contact Support
- **Email** : support@gastroreserve.com
- **Téléphone** : +33 1 23 45 67 89
- **Chat** : Support en ligne
- **Tickets** : Système de tickets

### Problèmes Courants
- **Connexion** : Mot de passe oublié
- **Réservation** : Problèmes de paiement
- **Technique** : Erreurs système
- **Facturation** : Questions de paiement

---

**Ce guide couvre toutes les fonctionnalités du système. Pour plus d'informations, contactez le support technique.**
