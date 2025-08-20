<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Système de Réservation en Ligne</h1>
        <p class="hero-subtitle">
          Réservez votre table dans les meilleurs restaurants en quelques clics
        </p>
        <div class="hero-actions">
          <router-link to="/register" class="btn btn-primary btn-large">
            Commencer
          </router-link>
          <router-link to="/restaurants" class="btn btn-outline btn-large" v-if="isAuthenticated">
            Voir les Restaurants
          </router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title">Fonctionnalités</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🍽️</div>
            <h3>Réservations Simples</h3>
            <p>Réservez votre table en quelques clics, 24h/24</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>Sécurisé</h3>
            <p>Authentification JWT et données protégées</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌍</div>
            <h3>Multilingue</h3>
            <p>Interface disponible en français et anglais</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Responsive</h3>
            <p>Interface adaptée à tous les appareils</p>
          </div>
        </div>
      </div>
    </section>

    <section class="tech-stack">
      <div class="container">
        <h2 class="section-title">Technologies Utilisées</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <h4>Frontend</h4>
            <ul>
              <li>Vue.js 3 (Composition API)</li>
              <li>Vue Router</li>
              <li>Axios</li>
              <li>i18next</li>
            </ul>
          </div>
          <div class="tech-item">
            <h4>Backend</h4>
            <ul>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>MySQL</li>
              <li>JWT</li>
            </ul>
          </div>
          <div class="tech-item">
            <h4>Outils</h4>
            <ul>
              <li>Vite</li>
              <li>Nodemon</li>
              <li>Git</li>
              <li>npm</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'Home',
  setup() {
    const isAuthenticated = ref(false)

    onMounted(() => {
      const token = localStorage.getItem('token')
      isAuthenticated.value = !!token
    })

    return {
      isAuthenticated
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.features {
  padding: 5rem 0;
  background: #f8f9fa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.tech-stack {
  padding: 5rem 0;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.tech-item {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.tech-item h4 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
}

.tech-item ul {
  list-style: none;
  padding: 0;
}

.tech-item li {
  padding: 0.5rem 0;
  color: #666;
  border-bottom: 1px solid #e9ecef;
}

.tech-item li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .features-grid,
  .tech-grid {
    grid-template-columns: 1fr;
  }
}
</style>
