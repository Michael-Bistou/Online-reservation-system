<template>
  <div class="restaurant-stats">
    <!-- Barre de navigation restaurant -->
    <div class="restaurant-nav">
      <div class="container">
        <div class="nav-content">
          <div class="nav-brand">
            <router-link to="/restaurant-dashboard" class="nav-logo">
              {{ $t('restaurant_dashboard.nav.dashboard') }}
            </router-link>
          </div>
          <div class="nav-links">
            <router-link to="/restaurant-dashboard" class="nav-link">
              📊 {{ $t('restaurant_dashboard.nav.dashboard').replace('🏪 ', '') }}
            </router-link>
            <router-link to="/restaurant-reservations" class="nav-link">
              {{ $t('restaurant_dashboard.nav.reservations') }}
            </router-link>
            <router-link to="/restaurant-stats" class="nav-link active">
              {{ $t('restaurant_dashboard.nav.statistics') }}
            </router-link>
            <router-link to="/restaurant-menu" class="nav-link">
              {{ $t('restaurant_dashboard.nav.menu') }}
            </router-link>
            <router-link to="/restaurant-profile" class="nav-link">
              {{ $t('restaurant_dashboard.nav.profile') }}
            </router-link>
          </div>
          <div class="nav-actions">
            <router-link to="/" class="btn btn-outline btn-sm">
              {{ $t('restaurant_dashboard.nav.main_site') }}
            </router-link>
            <button @click="logout" class="btn btn-outline btn-sm">
              {{ $t('restaurant_dashboard.nav.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="page-header">
      <div class="container">
        <h1 class="page-title">{{ $t('restaurant_stats.title') }}</h1>
        <p class="page-subtitle">{{ $t('restaurant_stats.subtitle') }}</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- Filtres de période -->
        <div class="filters-section">
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">{{ $t('restaurant_stats.filters.period') }}</label>
              <select v-model="selectedPeriod" class="filter-select" @change="updateStats">
                <option value="7">{{ $t('restaurant_stats.filters.last_7_days') }}</option>
                <option value="30">{{ $t('restaurant_stats.filters.last_30_days') }}</option>
                <option value="90">{{ $t('restaurant_stats.filters.last_3_months') }}</option>
                <option value="365">{{ $t('restaurant_stats.filters.last_year') }}</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">{{ $t('restaurant_stats.filters.start_date') }}</label>
              <input v-model="startDate" type="date" class="filter-input" @change="updateStats" />
            </div>
            <div class="filter-group">
              <label class="filter-label">{{ $t('restaurant_stats.filters.end_date') }}</label>
              <input v-model="endDate" type="date" class="filter-input" @change="updateStats" />
            </div>
          </div>
        </div>

        <!-- Métriques principales -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-number">{{ totalReservations }}</div>
              <div class="metric-label">{{ $t('restaurant_stats.metrics.total_reservations') }}</div>
              <div class="metric-change" :class="getChangeClass(reservationChange)">
                {{ reservationChange > 0 ? '+' : '' }}{{ reservationChange }}% {{ $t('restaurant_stats.metrics.vs_previous_period') }}
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-number">{{ averagePartySize }}</div>
              <div class="metric-label">{{ $t('restaurant_stats.metrics.average_party_size') }}</div>
              <div class="metric-change" :class="getChangeClass(partySizeChange)">
                {{ partySizeChange > 0 ? '+' : '' }}{{ partySizeChange }}% {{ $t('restaurant_stats.metrics.vs_previous_period') }}
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">✅</div>
            <div class="metric-content">
              <div class="metric-number">{{ confirmationRate }}%</div>
              <div class="metric-label">{{ $t('restaurant_stats.metrics.confirmation_rate') }}</div>
              <div class="metric-change" :class="getChangeClass(confirmationChange)">
                {{ confirmationChange > 0 ? '+' : '' }}{{ confirmationChange }}% {{ $t('restaurant_stats.metrics.vs_previous_period') }}
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">📅</div>
            <div class="metric-content">
              <div class="metric-number">{{ averageReservationsPerDay }}</div>
              <div class="metric-label">{{ $t('restaurant_stats.metrics.reservations_per_day') }}</div>
              <div class="metric-change" :class="getChangeClass(dailyChange)">
                {{ dailyChange > 0 ? '+' : '' }}{{ dailyChange }}% {{ $t('restaurant_stats.metrics.vs_previous_period') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Graphiques -->
        <div class="charts-section">
          <div class="chart-grid">
            <!-- Réservations par jour -->
            <div class="chart-card">
              <h3 class="chart-title">{{ $t('restaurant_stats.charts.daily_reservations') }}</h3>
              <div class="chart-container">
                <div class="chart-placeholder">
                  <div class="chart-bars">
                    <div 
                      v-for="(day, index) in dailyStats" 
                      :key="index"
                      class="chart-bar"
                      :style="{ height: `${(day.count / maxDailyReservations) * 100}%` }"
                    >
                      <div class="bar-tooltip">{{ day.count }} {{ $t('restaurant_stats.charts.reservations') }}</div>
                    </div>
                  </div>
                  <div class="chart-labels">
                    <span v-for="(day, index) in dailyStats" :key="index" class="chart-label">
                      {{ formatDayLabel(day.date) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

                         <!-- Répartition par statut -->
             <div class="chart-card">
               <h3 class="chart-title">{{ $t('restaurant_stats.charts.status_distribution') }}</h3>
               <div class="chart-container">
                 <div class="pie-chart-container">
                   <div class="pie-chart">
                     <div v-if="pieSegments.length === 0" class="pie-empty">
                       <div class="empty-text">{{ $t('restaurant_stats.charts.no_reservations') }}</div>
                     </div>
                     <div 
                       v-for="(segment, index) in pieSegments" 
                       :key="index"
                       class="pie-segment"
                       :class="segment.status"
                       :style="{ 
                         transform: `rotate(${segment.startAngle}deg)`,
                         '--segment-angle': `${segment.angle}deg`
                       }"
                     ></div>
                   </div>
                   <div class="pie-legend">
                     <div class="legend-item">
                       <span class="legend-color pending"></span>
                       <span class="legend-text">{{ $t('restaurant_stats.charts.pending') }}: {{ statusStats.pending }}</span>
                     </div>
                     <div class="legend-item">
                       <span class="legend-color confirmed"></span>
                       <span class="legend-text">{{ $t('restaurant_stats.charts.confirmed') }}: {{ statusStats.confirmed }}</span>
                     </div>
                     <div class="legend-item">
                       <span class="legend-color completed"></span>
                       <span class="legend-text">{{ $t('restaurant_stats.charts.completed') }}: {{ statusStats.completed }}</span>
                     </div>
                     <div class="legend-item">
                       <span class="legend-color cancelled"></span>
                       <span class="legend-text">{{ $t('restaurant_stats.charts.cancelled') }}: {{ statusStats.cancelled }}</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <!-- Tableau des heures de pointe -->
        <div class="peak-hours-section">
          <h3 class="section-title">{{ $t('restaurant_stats.peak_hours.title') }}</h3>
          <div class="peak-hours-grid">
            <div 
              v-for="(hour, index) in peakHours" 
              :key="index"
              class="peak-hour-card"
              :class="getPeakClass(hour.count)"
            >
              <div class="hour-time">{{ hour.time }}</div>
              <div class="hour-count">{{ hour.count }} {{ $t('restaurant_stats.peak_hours.reservations') }}</div>
              <div class="hour-bar" :style="{ width: `${(hour.count / maxPeakReservations) * 100}%` }"></div>
            </div>
          </div>
        </div>

        <!-- Tendances -->
        <div class="trends-section">
          <h3 class="section-title">Tendances</h3>
          <div class="trends-grid">
            <div class="trend-card">
              <div class="trend-icon">📈</div>
              <div class="trend-content">
                <h4>{{ $t('restaurant_stats.peak_hours.increasing_reservations') }}</h4>
                <p>{{ $t('restaurant_stats.peak_hours.increasing_text', { percent: reservationChange }) }}</p>
              </div>
            </div>
            <div class="trend-card">
              <div class="trend-icon">⏰</div>
              <div class="trend-content">
                <h4>{{ $t('restaurant_stats.peak_hours.most_popular_hour', { hour: mostPopularHour, count: mostPopularHourCount }) }}</h4>
                <p>{{ mostPopularHour }} avec {{ mostPopularHourCount }} {{ $t('restaurant_stats.peak_hours.reservations') }}</p>
              </div>
            </div>
            <div class="trend-card">
              <div class="trend-icon">👥</div>
              <div class="trend-content">
                <h4>{{ $t('restaurant_stats.metrics.average_party_size') }}</h4>
                <p>{{ averagePartySize }} {{ $t('restaurant_stats.charts.reservations') }} par réservation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onActivated, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'RestaurantStats',
  setup() {
    const { t } = useI18n()
    
    // Function to handle language changes
    const handleLanguageChange = () => {
      // Force re-render when language changes
      nextTick(() => {
        // The component will automatically re-render with new translations
      })
    }
    
    // Reactive data
    const selectedPeriod = ref('30')
    const startDate = ref('')
    const endDate = ref('')
    const reservations = ref([])
    const loading = ref(false)

    // Métriques principales
    const totalReservations = ref(0)
    const averagePartySize = ref(0)
    const confirmationRate = ref(0)
    const averageReservationsPerDay = ref(0)
    const reservationChange = ref(0)
    const partySizeChange = ref(0)
    const confirmationChange = ref(0)
    const dailyChange = ref(0)

    // Données pour les graphiques
    const dailyStats = ref([])
    const statusStats = ref({
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    })
    const peakHours = ref([])
    const maxDailyReservations = ref(0)
    const maxPeakReservations = ref(0)
    const mostPopularHour = ref('')
    const mostPopularHourCount = ref(0)

    // Segments pour le graphique circulaire
    const pieSegments = computed(() => {
      const pending = statusStats.value.pending
      const confirmed = statusStats.value.confirmed
      const completed = statusStats.value.completed
      const cancelled = statusStats.value.cancelled
      
      const total = pending + confirmed + completed + cancelled

      console.log('📊 Calcul des segments du graphique:')
      console.log(`   - Total réservations: ${total}`)
      console.log(`   - En attente: ${pending}`)
      console.log(`   - Confirmées: ${confirmed}`)
      console.log(`   - Terminées: ${completed}`)
      console.log(`   - Annulées: ${cancelled}`)

      // Si aucune réservation, afficher un cercle vide
      if (total === 0) {
        return []
      }

      let currentAngle = 0
      const segments = []

      // Ajouter les segments seulement s'il y a des données
      if (pending > 0) {
        const angle = (pending / total) * 360
        segments.push({
          status: 'pending',
          startAngle: currentAngle,
          angle: angle
        })
        currentAngle += angle
        console.log(`   - Segment pending: ${angle.toFixed(1)}° (depuis ${currentAngle - angle}°)`)
      }

      if (confirmed > 0) {
        const angle = (confirmed / total) * 360
        segments.push({
          status: 'confirmed',
          startAngle: currentAngle,
          angle: angle
        })
        currentAngle += angle
        console.log(`   - Segment confirmed: ${angle.toFixed(1)}° (depuis ${currentAngle - angle}°)`)
      }

      if (completed > 0) {
        const angle = (completed / total) * 360
        segments.push({
          status: 'completed',
          startAngle: currentAngle,
          angle: angle
        })
        currentAngle += angle
        console.log(`   - Segment completed: ${angle.toFixed(1)}° (depuis ${currentAngle - angle}°)`)
      }

      if (cancelled > 0) {
        const angle = (cancelled / total) * 360
        segments.push({
          status: 'cancelled',
          startAngle: currentAngle,
          angle: angle
        })
        console.log(`   - Segment cancelled: ${angle.toFixed(1)}° (depuis ${currentAngle}°)`)
      }

      console.log(`   - Total angles: ${currentAngle}°`)
      return segments
    })

    const loadReservations = () => {
      loading.value = true
      
      try {
        // Récupérer toutes les réservations
        const storedReservations = localStorage.getItem('restaurantReservations')
        let allReservations = []
        
        if (storedReservations) {
          allReservations = JSON.parse(storedReservations)
        }
        
        // Récupérer le restaurant actuel
        const currentRestaurant = JSON.parse(localStorage.getItem('currentRestaurant') || '{}')
        const restaurantData = JSON.parse(localStorage.getItem('restaurantData') || '{}')
        
        // Utiliser le restaurant connecté ou les données du restaurant
        const restaurantName = currentRestaurant.restaurant_name || restaurantData.restaurant_name
        
        // Debug: Afficher les informations (commenté pour production)
        // console.log('=== DEBUG RESTAURANT STATS ===')
        // console.log('Toutes les réservations:', allReservations)
        // console.log('Restaurant actuel:', currentRestaurant)
        // console.log('Données restaurant:', restaurantData)
        // console.log('Nom du restaurant recherché:', restaurantName)
        
        if (restaurantName) {
          // Filtrer les réservations pour ce restaurant (comparaison insensible à la casse)
          reservations.value = allReservations.filter(reservation => {
            const reservationName = reservation.restaurant_name?.trim().toLowerCase()
            const currentName = restaurantName.trim().toLowerCase()
            const matches = reservationName === currentName
            // console.log(`Comparaison: "${reservationName}" === "${currentName}" = ${matches}`)
            return matches
          })
          
          // console.log('Réservations filtrées:', reservations.value)
        } else {
          reservations.value = []
          // console.log('Aucun nom de restaurant trouvé')
        }
        
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err)
        reservations.value = []
      }
      
      loading.value = false
      calculateStats()
    }

    const calculateChanges = (currentPeriodReservations) => {
      try {
        const days = parseInt(selectedPeriod.value)
        const currentEnd = new Date()
        const currentStart = new Date()
        currentStart.setDate(currentStart.getDate() - days)
        
        const previousEnd = new Date(currentStart)
        const previousStart = new Date()
        previousStart.setDate(previousStart.getDate() - (days * 2))
        
        // Réservations de la période précédente
        const previousPeriodReservations = reservations.value.filter(r => {
          const reservationDate = new Date(r.date)
          return reservationDate >= previousStart && reservationDate < currentStart
        })
        
        // Calculer les changements
        const currentCount = currentPeriodReservations.length
        const previousCount = previousPeriodReservations.length
        
        if (previousCount > 0) {
          reservationChange.value = Math.round(((currentCount - previousCount) / previousCount) * 100)
        } else {
          reservationChange.value = currentCount > 0 ? 100 : 0
        }
        
        // Changement de la taille moyenne des groupes
        const currentAvgParty = currentPeriodReservations.length > 0 
          ? currentPeriodReservations.reduce((sum, r) => sum + r.party_size, 0) / currentPeriodReservations.length 
          : 0
        const previousAvgParty = previousPeriodReservations.length > 0 
          ? previousPeriodReservations.reduce((sum, r) => sum + r.party_size, 0) / previousPeriodReservations.length 
          : 0
        
        if (previousAvgParty > 0) {
          partySizeChange.value = Math.round(((currentAvgParty - previousAvgParty) / previousAvgParty) * 100)
        } else {
          partySizeChange.value = currentAvgParty > 0 ? 100 : 0
        }
        
        // Changement du taux de confirmation
        const currentConfirmed = currentPeriodReservations.filter(r => r.status === 'confirmed').length
        const previousConfirmed = previousPeriodReservations.filter(r => r.status === 'confirmed').length
        
        const currentConfRate = currentPeriodReservations.length > 0 ? (currentConfirmed / currentPeriodReservations.length) * 100 : 0
        const previousConfRate = previousPeriodReservations.length > 0 ? (previousConfirmed / previousPeriodReservations.length) * 100 : 0
        
        if (previousConfRate > 0) {
          confirmationChange.value = Math.round(currentConfRate - previousConfRate)
        } else {
          confirmationChange.value = currentConfRate > 0 ? 100 : 0
        }
        
        // Changement des réservations par jour
        const currentDaily = days > 0 ? currentCount / days : 0
        const previousDaily = days > 0 ? previousCount / days : 0
        
        if (previousDaily > 0) {
          dailyChange.value = Math.round(((currentDaily - previousDaily) / previousDaily) * 100)
        } else {
          dailyChange.value = currentDaily > 0 ? 100 : 0
        }
        
      } catch (error) {
        console.error('Erreur lors du calcul des changements:', error)
        reservationChange.value = 0
        partySizeChange.value = 0
        confirmationChange.value = 0
        dailyChange.value = 0
      }
    }

    const calculateStats = () => {
      const filteredReservations = getFilteredReservations()
      
      // Métriques principales
      totalReservations.value = filteredReservations.length
      
      if (totalReservations.value > 0) {
        const totalPartySize = filteredReservations.reduce((sum, r) => sum + r.party_size, 0)
        averagePartySize.value = Math.round((totalPartySize / totalReservations.value) * 10) / 10
        
        const confirmedCount = filteredReservations.filter(r => r.status === 'confirmed').length
        confirmationRate.value = Math.round((confirmedCount / totalReservations.value) * 100)
        
        const daysDiff = getDaysDifference()
        averageReservationsPerDay.value = Math.round((totalReservations.value / daysDiff) * 10) / 10
      }

      // Calculer les changements par rapport à la période précédente
      calculateChanges(filteredReservations)

      // Statistiques par jour
      calculateDailyStats(filteredReservations)
      
      // Statistiques par statut
      calculateStatusStats(filteredReservations)
      
      // Heures de pointe
      calculatePeakHours(filteredReservations)
    }

    const getFilteredReservations = () => {
      let filtered = reservations.value
      
      // console.log('=== FILTRAGE PAR DATE ===')
      // console.log('Réservations avant filtrage:', filtered)
      // console.log('Date de début:', startDate.value)
      // console.log('Date de fin:', endDate.value)
      // console.log('Période sélectionnée:', selectedPeriod.value)
      
              if (startDate.value && endDate.value) {
          filtered = filtered.filter(r => {
            const reservationDate = new Date(r.date)
            const start = new Date(startDate.value)
            const end = new Date(endDate.value)
            const isInRange = reservationDate >= start && reservationDate <= end
            // console.log(`Réservation ${r.date}: ${reservationDate} >= ${start} && ${reservationDate} <= ${end} = ${isInRange}`)
            return isInRange
          })
      } else {
        // Utiliser la période sélectionnée - inclure les réservations futures
        const days = parseInt(selectedPeriod.value)
        const end = new Date()
        end.setDate(end.getDate() + 30) // Inclure 30 jours dans le futur
        const start = new Date()
        start.setDate(start.getDate() - days)
        
        // console.log('Période calculée:', { start: start.toISOString(), end: end.toISOString() })
        
        filtered = filtered.filter(r => {
          const reservationDate = new Date(r.date)
          const isInRange = reservationDate >= start && reservationDate <= end
          // console.log(`Réservation ${r.date}: ${reservationDate} >= ${start} && ${reservationDate} <= ${end} = ${isInRange}`)
          return isInRange
        })
      }
      
      // console.log('Réservations après filtrage par date:', filtered)
      return filtered
    }

    const calculateDailyStats = (filteredReservations) => {
      const dailyMap = new Map()
      
      filteredReservations.forEach(reservation => {
        const date = new Date(reservation.date).toISOString().split('T')[0]
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
      })
      
      dailyStats.value = Array.from(dailyMap.entries()).map(([date, count]) => ({
        date,
        count
      })).sort((a, b) => new Date(a.date) - new Date(b.date))
      
      maxDailyReservations.value = Math.max(...dailyStats.value.map(d => d.count), 1)
    }

    const calculateStatusStats = (filteredReservations) => {
      const pending = filteredReservations.filter(r => r.status === 'pending').length
      const confirmed = filteredReservations.filter(r => r.status === 'confirmed').length
      const completed = filteredReservations.filter(r => r.status === 'completed').length
      const cancelled = filteredReservations.filter(r => r.status === 'cancelled').length
      
      statusStats.value = {
        pending,
        confirmed,
        completed,
        cancelled
      }
      
      console.log('📊 Calcul des statistiques par statut:')
      console.log('   - Réservations filtrées:', filteredReservations.length)
      console.log('   - En attente:', pending)
      console.log('   - Confirmées:', confirmed)
      console.log('   - Terminées:', completed)
      console.log('   - Annulées:', cancelled)
      console.log('   - Total:', pending + confirmed + completed + cancelled)
    }

    const calculatePeakHours = (filteredReservations) => {
      const hourMap = new Map()
      
      filteredReservations.forEach(reservation => {
        const hour = reservation.time
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1)
      })
      
      peakHours.value = Array.from(hourMap.entries()).map(([time, count]) => ({
        time,
        count
      })).sort((a, b) => b.count - a.count)
      
      maxPeakReservations.value = Math.max(...peakHours.value.map(h => h.count), 1)
      
      if (peakHours.value.length > 0) {
        mostPopularHour.value = peakHours.value[0].time
        mostPopularHourCount.value = peakHours.value[0].count
      }
    }

    const getDaysDifference = () => {
      if (startDate.value && endDate.value) {
        const start = new Date(startDate.value)
        const end = new Date(endDate.value)
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
      }
      return parseInt(selectedPeriod.value)
    }

    const updateStats = () => {
      calculateStats()
    }

    const getChangeClass = (change) => {
      return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
    }

    const formatDayLabel = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }

    const getPeakClass = (count) => {
      const percentage = (count / maxPeakReservations.value) * 100
      if (percentage >= 80) return 'very-high'
      if (percentage >= 60) return 'high'
      if (percentage >= 40) return 'medium'
      return 'low'
    }

    onMounted(() => {
      // Initialiser les dates - inclure les réservations futures
      const end = new Date()
      end.setDate(end.getDate() + 30) // Inclure 30 jours dans le futur
      const start = new Date()
      start.setDate(start.getDate() - parseInt(selectedPeriod.value))
      
      startDate.value = start.toISOString().split('T')[0]
      endDate.value = end.toISOString().split('T')[0]
      
      loadReservations()
      
      // Listen for language changes
      window.addEventListener('languageChanged', handleLanguageChange)
    })

    // Recharger les données quand on revient sur la page
    onActivated(() => {
      loadReservations()
    })

    onUnmounted(() => {
      // Clean up event listener
      window.removeEventListener('languageChanged', handleLanguageChange)
    })

    // Fonction de debug pour forcer le rechargement
    const debugReload = () => {
      console.log('=== FORCE RELOAD ===')
      loadReservations()
    }

    const logout = () => {
      localStorage.removeItem('restaurantLoggedIn')
      localStorage.removeItem('currentRestaurant')
      window.location.href = '/restaurant-login'
    }

    return {
      selectedPeriod,
      startDate,
      endDate,
      loading,
      totalReservations,
      averagePartySize,
      confirmationRate,
      averageReservationsPerDay,
      reservationChange,
      partySizeChange,
      confirmationChange,
      dailyChange,
      dailyStats,
      statusStats,
      peakHours,
      maxDailyReservations,
      maxPeakReservations,
      mostPopularHour,
      mostPopularHourCount,
      pieSegments,
      updateStats,
      getChangeClass,
      formatDayLabel,
      getPeakClass,
      debugReload,
      logout
    }
  }
}
</script>

<style scoped>
.restaurant-stats {
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 80px; /* Espace pour la barre de navigation fixe */
}



.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0 40px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.page-content {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filters-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.metric-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.metric-content {
  flex: 1;
}

.metric-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
}

.metric-label {
  font-size: 0.9rem;
  color: #5a6c7d;
  margin-bottom: 8px;
}

.metric-change {
  font-size: 0.8rem;
  font-weight: 600;
}

.metric-change.positive {
  color: #28a745;
}

.metric-change.negative {
  color: #dc3545;
}

.metric-change.neutral {
  color: #6c757d;
}

.charts-section {
  margin-bottom: 30px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.chart-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: end;
  gap: 8px;
  padding: 20px 0;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  transition: all 0.3s ease;
}

.chart-bar:hover {
  transform: scaleY(1.05);
}

.bar-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.chart-bar:hover .bar-tooltip {
  opacity: 1;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
}

.chart-label {
  font-size: 0.8rem;
  color: #5a6c7d;
  transform: rotate(-45deg);
  transform-origin: center;
}

 .pie-chart-container {
   display: flex;
   align-items: center;
   gap: 30px;
   justify-content: center;
   flex-wrap: wrap;
 }

 .pie-chart {
   width: 200px;
   height: 200px;
   border-radius: 50%;
   position: relative;
   background: conic-gradient(
     #ffc107 0deg 90deg,
     #28a745 90deg 180deg,
     #6c757d 180deg 270deg,
     #dc3545 270deg 360deg
   );
   flex-shrink: 0;
 }

 .pie-segment {
   position: absolute;
   width: 100%;
   height: 100%;
   border-radius: 50%;
   transform-origin: 50% 50%;
 }

 .pie-segment.pending {
   background: conic-gradient(from 0deg, #ffc107 0deg, #ffc107 var(--segment-angle), transparent var(--segment-angle));
 }

 .pie-segment.confirmed {
   background: conic-gradient(from 0deg, #28a745 0deg, #28a745 var(--segment-angle), transparent var(--segment-angle));
 }

 .pie-segment.completed {
   background: conic-gradient(from 0deg, #6c757d 0deg, #6c757d var(--segment-angle), transparent var(--segment-angle));
 }

 .pie-segment.cancelled {
   background: conic-gradient(from 0deg, #dc3545 0deg, #dc3545 var(--segment-angle), transparent var(--segment-angle));
 }

 .pie-empty {
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   text-align: center;
   color: #6c757d;
   font-size: 0.9rem;
 }

 .empty-text {
   background: #f8f9fa;
   padding: 10px;
   border-radius: 8px;
   border: 2px dashed #dee2e6;
 }

 .pie-legend {
   display: flex;
   flex-direction: column;
   gap: 12px;
   min-width: 200px;
 }

 .legend-item {
   display: flex;
   align-items: center;
   gap: 10px;
   font-size: 0.9rem;
   color: #2c3e50;
 }

 .legend-color {
   width: 16px;
   height: 16px;
   border-radius: 50%;
   flex-shrink: 0;
 }

 .legend-color.pending {
   background: #ffc107;
 }

 .legend-color.confirmed {
   background: #28a745;
 }

 .legend-color.completed {
   background: #6c757d;
 }

 .legend-color.cancelled {
   background: #dc3545;
 }

 .legend-text {
   font-weight: 500;
 }

.peak-hours-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
}

.peak-hours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.peak-hour-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  position: relative;
  overflow: hidden;
}

.peak-hour-card.very-high {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
}

.peak-hour-card.high {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
  color: white;
}

.peak-hour-card.medium {
  background: linear-gradient(135deg, #17a2b8, #6f42c1);
  color: white;
}

.peak-hour-card.low {
  background: #e9ecef;
  color: #2c3e50;
}

.hour-time {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.hour-count {
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.hour-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.trends-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.trend-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.trend-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
}

.trend-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.trend-content p {
  font-size: 0.9rem;
  color: #5a6c7d;
  margin: 0;
}

 @media (max-width: 768px) {
   .page-title {
     font-size: 2rem;
   }
   
   .metrics-grid {
     grid-template-columns: 1fr;
   }
   
   .chart-grid {
     grid-template-columns: 1fr;
   }
   
   .filter-row {
     flex-direction: column;
     align-items: stretch;
   }
   
   .filter-group {
     min-width: auto;
   }
   
   .trends-grid {
     grid-template-columns: 1fr;
   }
   
   .pie-chart-container {
     flex-direction: column;
     gap: 20px;
   }
   
   .pie-chart {
     width: 150px;
     height: 150px;
   }
   
   .pie-legend {
     min-width: auto;
   }
 }

@media (max-width: 480px) {
  .page-header {
    padding: 40px 0 30px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .metric-card {
    flex-direction: column;
    text-align: center;
  }
  
  .chart-bars {
    gap: 4px;
  }
  
  .chart-label {
    font-size: 0.7rem;
  }
}
</style>
