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
            @click="activeTab = tab.id"
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
                <details v-if="log.details">
                  <summary>Détails</summary>
                  <pre>{{ log.details }}</pre>
                </details>
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
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

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

    const loadDashboard = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard')
        stats.value = response.data.stats
        recentActivity.value = response.data.recentActivity
        recentReservations.value = response.data.recentReservations
      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
      }
    }

    const loadUsers = async () => {
      try {
        const params = {}
        if (userFilters.value.search) params.search = userFilters.value.search
        if (userFilters.value.role) params.role = userFilters.value.role

        const response = await axios.get('/api/admin/users', { params })
        users.value = response.data.users
      } catch (error) {
        console.error('Erreur chargement utilisateurs:', error)
      }
    }

    const loadRestaurants = async () => {
      try {
        const params = {}
        if (restaurantFilters.value.search) params.search = restaurantFilters.value.search
        if (restaurantFilters.value.cuisine_type) params.cuisine_type = restaurantFilters.value.cuisine_type

        const response = await axios.get('/api/admin/restaurants', { params })
        restaurants.value = response.data.restaurants
      } catch (error) {
        console.error('Erreur chargement restaurants:', error)
      }
    }

    const loadReservations = async () => {
      try {
        const params = {}
        if (reservationFilters.value.status) params.status = reservationFilters.value.status

        const response = await axios.get('/api/admin/reservations', { params })
        reservations.value = response.data.reservations
      } catch (error) {
        console.error('Erreur chargement réservations:', error)
      }
    }

    const loadLogs = async () => {
      try {
        const params = {}
        if (logFilters.value.action) params.action = logFilters.value.action

        const response = await axios.get('/api/admin/logs', { params })
        logs.value = response.data.logs
      } catch (error) {
        console.error('Erreur chargement logs:', error)
      }
    }

    const loadStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats')
        systemStats.value = response.data
      } catch (error) {
        console.error('Erreur chargement statistiques:', error)
      }
    }

    const createBackup = async () => {
      try {
        const response = await axios.post('/api/admin/backup')
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
      // Implémenter la vue détaillée d'un utilisateur
      console.log('Voir utilisateur:', id)
    }

    const editUser = (id) => {
      // Implémenter l'édition d'un utilisateur
      console.log('Modifier utilisateur:', id)
    }

    const disableUser = async (id) => {
      if (confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
        try {
          await axios.delete(`/api/admin/users/${id}`)
          await loadUsers()
          alert('Utilisateur désactivé avec succès')
        } catch (error) {
          console.error('Erreur désactivation utilisateur:', error)
          alert('Erreur lors de la désactivation')
        }
      }
    }

    const viewRestaurant = (id) => {
      console.log('Voir restaurant:', id)
    }

    const editRestaurant = (id) => {
      console.log('Modifier restaurant:', id)
    }

    const disableRestaurant = async (id) => {
      if (confirm('Êtes-vous sûr de vouloir désactiver ce restaurant ?')) {
        try {
          await axios.delete(`/api/admin/restaurants/${id}`)
          await loadRestaurants()
          alert('Restaurant désactivé avec succès')
        } catch (error) {
          console.error('Erreur désactivation restaurant:', error)
          alert('Erreur lors de la désactivation')
        }
      }
    }

    const viewReservation = (id) => {
      console.log('Voir réservation:', id)
    }

    const editReservation = (id) => {
      console.log('Modifier réservation:', id)
    }

    onMounted(() => {
      loadDashboard()
    })

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
      editReservation
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
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
  color: #495057;
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
  color: #495057;
}

.activity-content small, .reservation-info small {
  color: #6c757d;
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
  color: #495057;
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
}

.admin-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
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
  color: #495057;
}

.log-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.log-details {
  color: #6c757d;
  font-size: 0.9rem;
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
  color: #495057;
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
  color: #495057;
}

.restaurant-count {
  color: #6c757d;
  font-size: 0.9rem;
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
