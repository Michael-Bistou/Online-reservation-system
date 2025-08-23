<template>
  <div class="restaurant-stats">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Statistiques Détaillées</h1>
        <p class="page-subtitle">Analysez les performances de votre restaurant</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- Filtres de période -->
        <div class="filters-section">
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">Période</label>
              <select v-model="selectedPeriod" class="filter-select" @change="updateStats">
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
                <option value="90">3 derniers mois</option>
                <option value="365">1 an</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Date de début</label>
              <input v-model="startDate" type="date" class="filter-input" @change="updateStats" />
            </div>
            <div class="filter-group">
              <label class="filter-label">Date de fin</label>
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
              <div class="metric-label">Total Réservations</div>
              <div class="metric-change" :class="getChangeClass(reservationChange)">
                {{ reservationChange > 0 ? '+' : '' }}{{ reservationChange }}% vs période précédente
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-number">{{ averagePartySize }}</div>
              <div class="metric-label">Taille moyenne groupe</div>
              <div class="metric-change" :class="getChangeClass(partySizeChange)">
                {{ partySizeChange > 0 ? '+' : '' }}{{ partySizeChange }}% vs période précédente
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">✅</div>
            <div class="metric-content">
              <div class="metric-number">{{ confirmationRate }}%</div>
              <div class="metric-label">Taux de confirmation</div>
              <div class="metric-change" :class="getChangeClass(confirmationChange)">
                {{ confirmationChange > 0 ? '+' : '' }}{{ confirmationChange }}% vs période précédente
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">📅</div>
            <div class="metric-content">
              <div class="metric-number">{{ averageReservationsPerDay }}</div>
              <div class="metric-label">Réservations/jour</div>
              <div class="metric-change" :class="getChangeClass(dailyChange)">
                {{ dailyChange > 0 ? '+' : '' }}{{ dailyChange }}% vs période précédente
              </div>
            </div>
          </div>
        </div>

        <!-- Graphiques -->
        <div class="charts-section">
          <div class="chart-grid">
            <!-- Réservations par jour -->
            <div class="chart-card">
              <h3 class="chart-title">Réservations par jour</h3>
              <div class="chart-container">
                <div class="chart-placeholder">
                  <div class="chart-bars">
                    <div 
                      v-for="(day, index) in dailyStats" 
                      :key="index"
                      class="chart-bar"
                      :style="{ height: `${(day.count / maxDailyReservations) * 100}%` }"
                    >
                      <div class="bar-tooltip">{{ day.count }} réservations</div>
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
              <h3 class="chart-title">Répartition par statut</h3>
              <div class="chart-container">
                <div class="pie-chart">
                  <div class="pie-segment pending" :style="{ transform: `rotate(${pendingAngle}deg)` }">
                    <span class="segment-label">En attente: {{ statusStats.pending }}</span>
                  </div>
                  <div class="pie-segment confirmed" :style="{ transform: `rotate(${confirmedAngle}deg)` }">
                    <span class="segment-label">Confirmées: {{ statusStats.confirmed }}</span>
                  </div>
                  <div class="pie-segment completed" :style="{ transform: `rotate(${completedAngle}deg)` }">
                    <span class="segment-label">Terminées: {{ statusStats.completed }}</span>
                  </div>
                  <div class="pie-segment cancelled" :style="{ transform: `rotate(${cancelledAngle}deg)` }">
                    <span class="segment-label">Annulées: {{ statusStats.cancelled }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau des heures de pointe -->
        <div class="peak-hours-section">
          <h3 class="section-title">Heures de pointe</h3>
          <div class="peak-hours-grid">
            <div 
              v-for="(hour, index) in peakHours" 
              :key="index"
              class="peak-hour-card"
              :class="getPeakClass(hour.count)"
            >
              <div class="hour-time">{{ hour.time }}</div>
              <div class="hour-count">{{ hour.count }} réservations</div>
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
                <h4>Réservations en hausse</h4>
                <p>Vos réservations ont augmenté de {{ reservationChange }}% cette période</p>
              </div>
            </div>
            <div class="trend-card">
              <div class="trend-icon">⏰</div>
              <div class="trend-content">
                <h4>Heure la plus populaire</h4>
                <p>{{ mostPopularHour }} avec {{ mostPopularHourCount }} réservations</p>
              </div>
            </div>
            <div class="trend-card">
              <div class="trend-icon">👥</div>
              <div class="trend-content">
                <h4>Groupe moyen</h4>
                <p>{{ averagePartySize }} personnes par réservation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'RestaurantStats',
  setup() {
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

    // Angles pour le graphique circulaire
    const pendingAngle = computed(() => 0)
    const confirmedAngle = computed(() => (statusStats.value.pending / totalReservations.value) * 360)
    const completedAngle = computed(() => ((statusStats.value.pending + statusStats.value.confirmed) / totalReservations.value) * 360)
    const cancelledAngle = computed(() => ((statusStats.value.pending + statusStats.value.confirmed + statusStats.value.completed) / totalReservations.value) * 360)

    const loadReservations = () => {
      loading.value = true
      
      try {
        const storedReservations = localStorage.getItem('restaurantReservations')
        if (storedReservations) {
          const allReservations = JSON.parse(storedReservations)
          const currentRestaurant = JSON.parse(localStorage.getItem('currentRestaurant') || '{}')
          
          // Filtrer les réservations pour ce restaurant
          reservations.value = allReservations.filter(reservation => 
            reservation.restaurant_name === currentRestaurant.restaurant_name
          )
        }
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err)
        reservations.value = []
      }
      
      loading.value = false
      calculateStats()
    }

    const calculateStats = () => {
      const filteredReservations = getFilteredReservations()
      
      // Métriques principales
      totalReservations.value = filteredReservations.length
      
      if (totalReservations.value > 0) {
        const totalPartySize = filteredReservations.reduce((sum, r) => sum + r.partySize, 0)
        averagePartySize.value = Math.round((totalPartySize / totalReservations.value) * 10) / 10
        
        const confirmedCount = filteredReservations.filter(r => r.status === 'confirmed').length
        confirmationRate.value = Math.round((confirmedCount / totalReservations.value) * 100)
        
        const daysDiff = getDaysDifference()
        averageReservationsPerDay.value = Math.round((totalReservations.value / daysDiff) * 10) / 10
      }

      // Calculer les changements (simulation)
      reservationChange.value = Math.floor(Math.random() * 20) - 10
      partySizeChange.value = Math.floor(Math.random() * 15) - 7
      confirmationChange.value = Math.floor(Math.random() * 25) - 12
      dailyChange.value = Math.floor(Math.random() * 18) - 9

      // Statistiques par jour
      calculateDailyStats(filteredReservations)
      
      // Statistiques par statut
      calculateStatusStats(filteredReservations)
      
      // Heures de pointe
      calculatePeakHours(filteredReservations)
    }

    const getFilteredReservations = () => {
      let filtered = reservations.value
      
      if (startDate.value && endDate.value) {
        filtered = filtered.filter(r => {
          const reservationDate = new Date(r.date)
          const start = new Date(startDate.value)
          const end = new Date(endDate.value)
          return reservationDate >= start && reservationDate <= end
        })
      } else {
        // Utiliser la période sélectionnée
        const days = parseInt(selectedPeriod.value)
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - days)
        
        filtered = filtered.filter(r => {
          const reservationDate = new Date(r.date)
          return reservationDate >= start && reservationDate <= end
        })
      }
      
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
      statusStats.value = {
        pending: filteredReservations.filter(r => r.status === 'pending').length,
        confirmed: filteredReservations.filter(r => r.status === 'confirmed').length,
        completed: filteredReservations.filter(r => r.status === 'completed').length,
        cancelled: filteredReservations.filter(r => r.status === 'cancelled').length
      }
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
      // Initialiser les dates
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - parseInt(selectedPeriod.value))
      
      startDate.value = start.toISOString().split('T')[0]
      endDate.value = end.toISOString().split('T')[0]
      
      loadReservations()
    })

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
      pendingAngle,
      confirmedAngle,
      completedAngle,
      cancelledAngle,
      updateStats,
      getChangeClass,
      formatDayLabel,
      getPeakClass
    }
  }
}
</script>

<style scoped>
.restaurant-stats {
  min-height: 100vh;
  background: #f8f9fa;
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

.pie-chart {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
  background: conic-gradient(
    #ffc107 0deg 90deg,
    #28a745 90deg 180deg,
    #6c757d 180deg 270deg,
    #dc3545 270deg 360deg
  );
}

.pie-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.segment-label {
  position: absolute;
  font-size: 0.8rem;
  color: #2c3e50;
  font-weight: 600;
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
