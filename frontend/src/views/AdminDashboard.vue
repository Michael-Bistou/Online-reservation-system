<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="admin-header">
      <div class="container">
        <h1>🔧 Tableau de Bord Administrateur</h1>
        <p>Gestion complète du système de réservation</p>
      </div>
    </div>

    <!-- Navigation Admin -->
    <div class="admin-nav">
      <div class="container">
        <nav class="admin-nav-menu">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="switchTab(tab.id)"
            :class="{ active: activeTab === tab.id }"
            class="admin-nav-btn"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="admin-content">
      <div class="container">
        <!-- Dashboard -->
        <div v-if="activeTab === 'dashboard'" class="admin-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <h3>{{ stats.total_users || 0 }}</h3>
                <p>Utilisateurs</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🍽️</div>
              <div class="stat-content">
                <h3>{{ stats.total_restaurants || 0 }}</h3>
                <p>Restaurants</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-content">
                <h3>{{ stats.total_reservations || 0 }}</h3>
                <p>Réservations</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <h3>{{ stats.confirmed_reservations || 0 }}</h3>
                <p>Confirmées</p>
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="dashboard-card">
              <h3>Activité Récente</h3>
              <div class="activity-list">
                <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                  <div class="activity-icon">🔍</div>
                  <div class="activity-content">
                    <p><strong>{{ activity.first_name }} {{ activity.last_name }}</strong> - {{ activity.action }}</p>
                    <small>{{ formatDate(activity.created_at) }}</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="dashboard-card">
              <h3>Réservations Récentes</h3>
              <div class="reservation-list">
                <div v-for="reservation in recentReservations" :key="reservation.id" class="reservation-item">
                  <div class="reservation-info">
                    <p><strong>{{ reservation.restaurant_name }}</strong></p>
                    <p>{{ reservation.first_name }} {{ reservation.last_name }} - {{ reservation.number_of_guests }} personnes</p>
                    <small>{{ formatDate(reservation.created_at) }}</small>
                  </div>
                  <div class="reservation-status" :class="reservation.status">
                    {{ reservation.status }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Utilisateurs -->
        <div v-if="activeTab === 'users'" class="admin-section">
          <div class="section-header">
            <h2>Gestion des Utilisateurs</h2>
            <div class="filters">
              <input 
                v-model="userFilters.search" 
                placeholder="Rechercher un utilisateur..."
                class="search-input"
              />
              <select v-model="userFilters.role" class="filter-select">
                <option value="">Tous les rôles</option>
                <option value="user">Utilisateur</option>
                <option value="restaurant">Restaurant</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>

          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Date création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.first_name }} {{ user.last_name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="role-badge" :class="user.role">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" :class="{ active: user.is_active, inactive: !user.is_active }">
                      {{ user.is_active ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.created_at) }}</td>
                  <td>
                    <button @click="viewUser(user.id)" class="btn btn-sm btn-primary">Voir</button>
                    <button @click="editUser(user.id)" class="btn btn-sm btn-secondary">Modifier</button>
                    <button 
                      v-if="user.role !== 'admin'" 
                      @click="disableUser(user.id)" 
                      class="btn btn-sm btn-danger"
                    >
                      Désactiver
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Restaurants -->
        <div v-if="activeTab === 'restaurants'" class="admin-section">
          <div class="section-header">
            <h2>Gestion des Restaurants</h2>
            <div class="filters">
              <input 
                v-model="restaurantFilters.search" 
                placeholder="Rechercher un restaurant..."
                class="search-input"
              />
              <select v-model="restaurantFilters.cuisine_type" class="filter-select">
                <option value="">Tous les types</option>
                <option value="Française">Française</option>
                <option value="Italienne">Italienne</option>
                <option value="Japonaise">Japonaise</option>
                <option value="Chinoise">Chinoise</option>
                <option value="Mexicaine">Mexicaine</option>
              </select>
            </div>
          </div>

          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Adresse</th>
                  <th>Type</th>
                  <th>Prix</th>
                  <th>Note</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="restaurant in restaurants" :key="restaurant.id">
                  <td>{{ restaurant.id }}</td>
                  <td>{{ restaurant.name }}</td>
                  <td>{{ restaurant.address }}</td>
                  <td>{{ restaurant.cuisine_type }}</td>
                  <td>{{ restaurant.price_range }}</td>
                  <td>{{ restaurant.rating }}★</td>
                  <td>
                    <span class="status-badge" :class="{ active: restaurant.is_active, inactive: !restaurant.is_active }">
                      {{ restaurant.is_active ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td>
                    <button @click="viewRestaurant(restaurant.id)" class="btn btn-sm btn-primary">Voir</button>
                    <button @click="editRestaurant(restaurant.id)" class="btn btn-sm btn-secondary">Modifier</button>
                    <button @click="disableRestaurant(restaurant.id)" class="btn btn-sm btn-danger">Désactiver</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Réservations -->
        <div v-if="activeTab === 'reservations'" class="admin-section">
          <div class="section-header">
            <h2>Gestion des Réservations</h2>
            <div class="filters">
              <select v-model="reservationFilters.status" class="filter-select">
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="cancelled">Annulée</option>
                <option value="completed">Terminée</option>
              </select>
            </div>
          </div>

          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Restaurant</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Personnes</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reservation in reservations" :key="reservation.id">
                  <td>{{ reservation.id }}</td>
                  <td>{{ reservation.first_name }} {{ reservation.last_name }}</td>
                  <td>{{ reservation.restaurant_name }}</td>
                  <td>{{ formatDate(reservation.reservation_date) }}</td>
                  <td>{{ reservation.reservation_time }}</td>
                  <td>{{ reservation.number_of_guests }}</td>
                  <td>
                    <span class="status-badge" :class="reservation.status">
                      {{ reservation.status }}
                    </span>
                  </td>
                  <td>
                    <button @click="viewReservation(reservation.id)" class="btn btn-sm btn-primary">Voir</button>
                    <button @click="editReservation(reservation.id)" class="btn btn-sm btn-secondary">Modifier</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Logs -->
        <div v-if="activeTab === 'logs'" class="admin-section">
          <div class="section-header">
            <h2>Logs d'Audit d'Activité</h2>
            <div class="filters">
              <select v-model="logFilters.action" class="filter-select">
                <option value="">Toutes les actions</option>
                <option value="view_users">Voir utilisateurs</option>
                <option value="update_user">Modifier utilisateur</option>
                <option value="disable_user">Désactiver utilisateur</option>
                <option value="view_restaurants">Voir restaurants</option>
                <option value="update_restaurant">Modifier restaurant</option>
                <option value="disable_restaurant">Désactiver restaurant</option>
              </select>
            </div>
          </div>

          <div class="logs-container">
            <div v-for="log in logs" :key="log.id" class="log-item">
              <div class="log-header">
                <span class="log-action">{{ log.action }}</span>
                <span class="log-admin">{{ log.first_name }} {{ log.last_name }}</span>
                <span class="log-date">{{ formatDate(log.created_at) }}</span>
              </div>
              <div class="log-details">
                <p v-if="log.target_type">Type: {{ log.target_type }} (ID: {{ log.target_id }})</p>
                <p v-if="log.ip_address">IP: {{ log.ip_address }}</p>
                <details v-if="log.details && log.details !== '{}'">
                  <summary>Détails</summary>
                  <pre>{{ typeof log.details === 'string' ? JSON.parse(log.details) : log.details }}</pre>
                </details>
                <div v-if="!log.details || log.details === '{}'" class="log-no-details">
                  <small>Aucun détail supplémentaire disponible</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div v-if="activeTab === 'stats'" class="admin-section">
          <div class="section-header">
            <h2>Statistiques du Système</h2>
            <button @click="createBackup" class="btn btn-primary">Créer une sauvegarde</button>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <h3>Utilisateurs</h3>
              <p class="stat-number">{{ systemStats.general?.total_users || 0 }}</p>
              <small>Utilisateurs totaux</small>
            </div>
            <div class="stat-card">
              <h3>Restaurants</h3>
              <p class="stat-number">{{ systemStats.general?.active_restaurants || 0 }}</p>
              <small>Restaurants actifs</small>
            </div>
            <div class="stat-card">
              <h3>Réservations</h3>
              <p class="stat-number">{{ systemStats.general?.total_reservations || 0 }}</p>
              <small>Réservations totales</small>
            </div>
            <div class="stat-card">
              <h3>Actions Admin</h3>
              <p class="stat-number">{{ systemStats.general?.total_admin_actions || 0 }}</p>
              <small>Actions d'administration</small>
            </div>
          </div>

          <div class="stats-charts">
            <div class="chart-card">
              <h3>Top 10 Restaurants</h3>
              <div class="restaurant-stats">
                <div v-for="restaurant in systemStats.topRestaurants" :key="restaurant.name" class="restaurant-stat">
                  <span class="restaurant-name">{{ restaurant.name }}</span>
                  <span class="restaurant-count">{{ restaurant.reservation_count }} réservations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale de modification de réservation -->
    <div v-if="showEditModal" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Modifier la réservation</h3>
          <button @click="cancelEdit" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Client:</label>
            <input type="text" :value="editingReservation?.first_name + ' ' + editingReservation?.last_name" disabled class="form-control" />
          </div>
          <div class="form-group">
            <label>Restaurant:</label>
            <input type="text" :value="editingReservation?.restaurant_name" disabled class="form-control" />
          </div>
          <div class="form-group">
            <label>Date de réservation:</label>
            <input type="date" v-model="editForm.reservation_date" class="form-control" />
          </div>
          <div class="form-group">
            <label>Heure de réservation:</label>
            <input type="time" v-model="editForm.reservation_time" class="form-control" />
          </div>
          <div class="form-group">
            <label>Nombre de personnes:</label>
            <input type="number" v-model="editForm.number_of_guests" min="1" max="20" class="form-control" />
          </div>
          <div class="form-group">
            <label>Statut:</label>
            <select v-model="editForm.status" class="form-control">
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
          <div class="form-group">
            <label>Demandes spéciales:</label>
            <textarea v-model="editForm.special_requests" class="form-control" rows="3" placeholder="Aucune demande spéciale"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="cancelEdit" class="btn btn-secondary">Annuler</button>
          <button @click="saveReservation" class="btn btn-primary">Sauvegarder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'

// Configuration axios pour le dashboard admin
const API_BASE_URL = 'http://localhost:5000/api'

// Configuration des intercepteurs pour l'authentification
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.url?.startsWith(API_BASE_URL)) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default {
  name: 'AdminDashboard',
  setup() {
    const activeTab = ref('dashboard')
    const stats = ref({})
    const recentActivity = ref([])
    const recentReservations = ref([])
    const users = ref([])
    const restaurants = ref([])
    const reservations = ref([])
    const logs = ref([])
    const systemStats = ref({})
    
    // États pour les modales
    const showEditModal = ref(false)
    const editingReservation = ref(null)
    const editForm = ref({
      reservation_date: '',
      reservation_time: '',
      number_of_guests: 0,
      status: '',
      special_requests: ''
    })

    const userFilters = ref({
      search: '',
      role: ''
    })

    const restaurantFilters = ref({
      search: '',
      cuisine_type: ''
    })

    const reservationFilters = ref({
      status: ''
    })

    const logFilters = ref({
      action: ''
    })

    const tabs = [
      { id: 'dashboard', label: '📊 Tableau de bord' },
      { id: 'users', label: '👥 Utilisateurs' },
      { id: 'restaurants', label: '🍽️ Restaurants' },
      { id: 'reservations', label: '📅 Réservations' },
      { id: 'logs', label: '📋 Logs d\'audit' },
      { id: 'stats', label: '📈 Statistiques' }
    ]

    const switchTab = (tabId) => {
      activeTab.value = tabId
      console.log('Onglet actif:', tabId)
      
      // Charger les données appropriées selon l'onglet
      switch (tabId) {
        case 'dashboard':
          loadDashboard()
          break
        case 'users':
          loadUsers()
          break
        case 'restaurants':
          loadRestaurants()
          break
        case 'reservations':
          loadReservations()
          break
        case 'logs':
          loadLogs()
          break
        case 'stats':
          loadStats()
          break
      }
    }

    const loadDashboard = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard`)
        stats.value = response.data.stats
        recentActivity.value = response.data.recentActivity
        recentReservations.value = response.data.recentReservations
        console.log('Dashboard data loaded:', response.data)
      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
      }
    }

    const loadUsers = async () => {
      try {
        const params = {}
        if (userFilters.value.search) params.search = userFilters.value.search
        if (userFilters.value.role) params.role = userFilters.value.role

        const response = await axios.get(`${API_BASE_URL}/admin/users`, { params })
        users.value = response.data.users
        console.log('Users data loaded:', response.data)
      } catch (error) {
        console.error('Erreur chargement utilisateurs:', error)
      }
    }

    const loadRestaurants = async () => {
      try {
        const params = {}
        if (restaurantFilters.value.search) params.search = restaurantFilters.value.search
        if (restaurantFilters.value.cuisine_type) params.cuisine_type = restaurantFilters.value.cuisine_type

        const response = await axios.get(`${API_BASE_URL}/admin/restaurants`, { params })
        restaurants.value = response.data.restaurants
        console.log('Restaurants data loaded:', response.data)
      } catch (error) {
        console.error('Erreur chargement restaurants:', error)
      }
    }

    const loadReservations = async () => {
      try {
        const params = {}
        if (reservationFilters.value.status) params.status = reservationFilters.value.status

        const response = await axios.get(`${API_BASE_URL}/admin/reservations`, { params })
        reservations.value = response.data.reservations
        console.log('Reservations data loaded:', response.data)
      } catch (error) {
        console.error('Erreur chargement réservations:', error)
      }
    }

    const loadLogs = async () => {
      try {
        const params = {}
        if (logFilters.value.action) params.action = logFilters.value.action

        const response = await axios.get(`${API_BASE_URL}/admin/logs`, { params })
        logs.value = response.data.logs
        console.log('Logs data loaded:', response.data)
      } catch (error) {
        console.error('Erreur chargement logs:', error)
      }
    }

    const loadStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/stats`)
        systemStats.value = response.data
        console.log('Stats data loaded:', response.data)
      } catch (error) {
        console.error('Erreur chargement statistiques:', error)
      }
    }

    const createBackup = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/backup`)
        alert('Sauvegarde créée avec succès !')
      } catch (error) {
        console.error('Erreur création sauvegarde:', error)
        alert('Erreur lors de la création de la sauvegarde')
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const viewUser = (id) => {
      const user = users.value.find(u => u.id === id)
      if (user) {
        alert(`Détails de l'utilisateur:\n\nNom: ${user.first_name} ${user.last_name}\nEmail: ${user.email}\nRôle: ${user.role}\nStatut: ${user.is_active ? 'Actif' : 'Inactif'}\nDate de création: ${formatDate(user.created_at)}`)
      }
    }

    const editUser = (id) => {
      const user = users.value.find(u => u.id === id)
      if (user) {
        const newFirstName = prompt('Prénom:', user.first_name)
        if (newFirstName !== null) {
          const newLastName = prompt('Nom:', user.last_name)
          if (newLastName !== null) {
            const newEmail = prompt('Email:', user.email)
            if (newEmail !== null) {
              const newRole = prompt('Rôle (user/admin/restaurant):', user.role)
              if (newRole !== null) {
                // Appel API pour mettre à jour
                updateUser(id, {
                  first_name: newFirstName,
                  last_name: newLastName,
                  email: newEmail,
                  role: newRole
                })
              }
            }
          }
        }
      }
    }

    const updateUser = async (id, userData) => {
      try {
        // Récupérer les données actuelles de l'utilisateur
        const currentUser = users.value.find(u => u.id === id)
        const updateData = {
          ...currentUser,
          ...userData,
          is_active: currentUser.is_active ? 1 : 0
        }
        
        await axios.put(`${API_BASE_URL}/admin/users/${id}`, updateData)
        alert('Utilisateur mis à jour avec succès!')
        loadUsers() // Recharger les données
      } catch (error) {
        console.error('Erreur mise à jour utilisateur:', error)
        alert('Erreur lors de la mise à jour de l\'utilisateur')
      }
    }

    const disableUser = async (id) => {
      if (confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
        try {
          await axios.delete(`${API_BASE_URL}/admin/users/${id}`)
          await loadUsers()
          alert('Utilisateur désactivé avec succès')
        } catch (error) {
          console.error('Erreur désactivation utilisateur:', error)
          alert('Erreur lors de la désactivation')
        }
      }
    }

    const viewRestaurant = (id) => {
      const restaurant = restaurants.value.find(r => r.id === id)
      if (restaurant) {
        alert(`Détails du restaurant:\n\nNom: ${restaurant.name}\nAdresse: ${restaurant.address}\nType: ${restaurant.cuisine_type}\nEmail: ${restaurant.email}\nTéléphone: ${restaurant.phone}\nStatut: ${restaurant.is_active ? 'Actif' : 'Inactif'}`)
      }
    }

    const editRestaurant = (id) => {
      const restaurant = restaurants.value.find(r => r.id === id)
      if (restaurant) {
        const newName = prompt('Nom du restaurant:', restaurant.name)
        if (newName !== null) {
          const newAddress = prompt('Adresse:', restaurant.address)
          if (newAddress !== null) {
            const newCuisineType = prompt('Type de cuisine:', restaurant.cuisine_type)
            if (newCuisineType !== null) {
              const newPriceRange = prompt('Fourchette de prix (€, €€, €€€):', restaurant.price_range)
              if (newPriceRange !== null) {
                // Appel API pour mettre à jour
                updateRestaurant(id, {
                  name: newName,
                  address: newAddress,
                  cuisine_type: newCuisineType,
                  price_range: newPriceRange
                })
              }
            }
          }
        }
      }
    }

    const updateRestaurant = async (id, restaurantData) => {
      try {
        // Récupérer les données actuelles du restaurant
        const currentRestaurant = restaurants.value.find(r => r.id === id)
        const updateData = {
          ...currentRestaurant,
          ...restaurantData,
          is_active: currentRestaurant.is_active ? 1 : 0
        }
        
        await axios.put(`${API_BASE_URL}/admin/restaurants/${id}`, updateData)
        alert('Restaurant mis à jour avec succès!')
        loadRestaurants() // Recharger les données
      } catch (error) {
        console.error('Erreur mise à jour restaurant:', error)
        alert('Erreur lors de la mise à jour du restaurant')
      }
    }

    const disableRestaurant = async (id) => {
      if (confirm('Êtes-vous sûr de vouloir désactiver ce restaurant ?')) {
        try {
          await axios.delete(`${API_BASE_URL}/admin/restaurants/${id}`)
          await loadRestaurants()
          alert('Restaurant désactivé avec succès')
        } catch (error) {
          console.error('Erreur désactivation restaurant:', error)
          alert('Erreur lors de la désactivation')
        }
      }
    }

    const viewReservation = (id) => {
      const reservation = reservations.value.find(r => r.id === id)
      if (reservation) {
        alert(`Détails de la réservation:\n\nClient: ${reservation.first_name} ${reservation.last_name}\nRestaurant: ${reservation.restaurant_name}\nDate: ${formatDate(reservation.reservation_date)}\nHeure: ${reservation.reservation_time}\nPersonnes: ${reservation.number_of_guests}\nStatut: ${reservation.status}`)
      }
    }

    const editReservation = (id) => {
      const reservation = reservations.value.find(r => r.id === id)
      if (reservation) {
        editingReservation.value = reservation
        editForm.value = {
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          number_of_guests: reservation.number_of_guests,
          status: reservation.status,
          special_requests: reservation.special_requests || ''
        }
        showEditModal.value = true
      }
    }

    const saveReservation = async () => {
      try {
        await updateReservation(editingReservation.value.id, editForm.value)
        showEditModal.value = false
        editingReservation.value = null
      } catch (error) {
        console.error('Erreur sauvegarde:', error)
      }
    }

    const cancelEdit = () => {
      showEditModal.value = false
      editingReservation.value = null
      editForm.value = {
        reservation_date: '',
        reservation_time: '',
        number_of_guests: 0,
        status: '',
        special_requests: ''
      }
    }

    const updateReservation = async (id, reservationData) => {
      try {
        // Récupérer les données actuelles de la réservation
        const currentReservation = reservations.value.find(r => r.id === id)
        const updateData = {
          ...currentReservation,
          ...reservationData
        }
        
        await axios.put(`${API_BASE_URL}/admin/reservations/${id}`, updateData)
        alert('Réservation mise à jour avec succès!')
        loadReservations() // Recharger les données
      } catch (error) {
        console.error('Erreur mise à jour réservation:', error)
        alert('Erreur lors de la mise à jour de la réservation')
      }
    }

    onMounted(() => {
      loadDashboard()
    })

    // Watchers pour les filtres
    watch(userFilters, () => {
      if (activeTab.value === 'users') {
        loadUsers()
      }
    }, { deep: true })

    watch(restaurantFilters, () => {
      if (activeTab.value === 'restaurants') {
        loadRestaurants()
      }
    }, { deep: true })

    watch(reservationFilters, () => {
      if (activeTab.value === 'reservations') {
        loadReservations()
      }
    }, { deep: true })

    watch(logFilters, () => {
      if (activeTab.value === 'logs') {
        loadLogs()
      }
    }, { deep: true })

    return {
      activeTab,
      stats,
      recentActivity,
      recentReservations,
      users,
      restaurants,
      reservations,
      logs,
      systemStats,
      userFilters,
      restaurantFilters,
      reservationFilters,
      logFilters,
      tabs,
      switchTab,
      loadDashboard,
      loadUsers,
      loadRestaurants,
      loadReservations,
      loadLogs,
      loadStats,
      createBackup,
      formatDate,
      viewUser,
      editUser,
      disableUser,
      viewRestaurant,
      editRestaurant,
      disableRestaurant,
      viewReservation,
      editReservation,
      updateReservation,
      saveReservation,
      cancelEdit,
      viewUser,
      editUser,
      updateUser,
      viewRestaurant,
      editRestaurant,
      updateRestaurant,
      showEditModal,
      editingReservation,
      editForm
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #ffffff;
}

.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
}

.admin-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.admin-header p {
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.admin-nav {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0;
}

.admin-nav-menu {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}

.admin-nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #f8f9fa;
  color: #6c757d;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.admin-nav-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.admin-nav-btn.active {
  background: #007bff;
  color: white;
}

.admin-content {
  padding: 2rem 0;
  background: #ffffff;
}

.admin-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.stat-content p {
  margin: 0;
  opacity: 0.9;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.dashboard-card h3 {
  margin: 0 0 1rem 0;
  color: #212529;
}

.activity-item, .reservation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.activity-item:last-child, .reservation-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.2rem;
}

.activity-content p, .reservation-info p {
  margin: 0;
  color: #212529;
}

.activity-content small, .reservation-info small {
  color: #495057;
}

.reservation-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.reservation-status.pending {
  background: #fff3cd;
  color: #856404;
}

.reservation-status.confirmed {
  background: #d4edda;
  color: #155724;
}

.reservation-status.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
  color: #212529;
}

.filters {
  display: flex;
  gap: 1rem;
}

.search-input, .filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
}

.table-container {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.admin-table th,
.admin-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  color: #212529;
}

.admin-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #212529;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-badge.admin {
  background: #dc3545;
  color: white;
}

.role-badge.restaurant {
  background: #fd7e14;
  color: white;
}

.role-badge.user {
  background: #6c757d;
  color: white;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.logs-container {
  max-height: 600px;
  overflow-y: auto;
}

.log-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #007bff;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.log-action {
  font-weight: 600;
  color: #007bff;
}

.log-admin {
  color: #212529;
}

.log-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.log-details {
  color: #495057;
  font-size: 0.9rem;
}

.log-no-details {
  color: #6c757d;
  font-style: italic;
  padding: 5px 0;
}

.log-details pre {
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  overflow-x: auto;
}

.stats-charts {
  margin-top: 2rem;
}

.chart-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.chart-card h3 {
  margin: 0 0 1rem 0;
  color: #212529;
}

.restaurant-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.restaurant-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.restaurant-name {
  font-weight: 500;
  color: #212529;
}

.restaurant-count {
  color: #495057;
  font-size: 0.9rem;
}

/* Styles pour la modale */
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
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  color: #212529;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #dc3545;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #212529;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-control:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
}

@media (max-width: 768px) {
  .admin-nav-menu {
    flex-wrap: wrap;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
