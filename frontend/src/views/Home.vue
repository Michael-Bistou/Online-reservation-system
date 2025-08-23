<template>
  <div class="home">
    <!-- Hero Section avec Vidéo -->
    <section class="hero">
      <!-- Vidéo de fond -->
      <div class="hero-video">
        <video autoplay muted loop playsinline class="background-video">
          <source src="/videos/restaurant-hero.mp4" type="video/mp4">
          <!-- Fallback pour les navigateurs qui ne supportent pas la vidéo -->
          <div class="video-fallback"></div>
        </video>
        <div class="video-overlay"></div>
      </div>
      
             <div class="hero-content">

          
          <h1 class="hero-title">
            <span class="title-line">Découvrez</span>
            <span class="title-highlight">l'Art Culinaire</span>
            <span class="title-line">en Quelques Clics</span>
          </h1>
          
          <p class="hero-subtitle">
            Réservez votre table dans les meilleurs restaurants de votre région. 
            Une expérience gastronomique unique vous attend.
          </p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">Restaurants</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">10k+</div>
              <div class="stat-label">Réservations</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">4.8★</div>
              <div class="stat-label">Note moyenne</div>
            </div>
          </div>
          
                     <div class="hero-actions">
             <router-link to="/register" class="btn btn-primary btn-lg hero-btn">
               <span class="btn-text">Commencer maintenant</span>
               <span class="btn-arrow">→</span>
             </router-link>
             <router-link to="/restaurants" class="btn btn-outline btn-lg hero-btn" v-if="isAuthenticated">
               <span class="btn-text">Explorer les restaurants</span>
             </router-link>
           </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features dark-bg">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">
            <span class="badge badge-primary" style="background: #d4af37; color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.875rem; font-weight: 600;">Fonctionnalités</span>
          </div>
          <h2 class="section-title">Une Expérience Unique</h2>
          <p class="section-subtitle">Découvrez les fonctionnalités qui font de notre plateforme la solution idéale pour vos réservations gastronomiques</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card card">
                         <div class="feature-icon-wrapper">
               <div class="feature-icon">R</div>
             </div>
            <h3 class="feature-title">Réservations Instantanées</h3>
            <p class="feature-description">Réservez votre table en quelques clics, 24h/24 et 7j/7. Interface intuitive et processus simplifié pour une expérience fluide.</p>
            <div class="feature-link">
              <span>En savoir plus</span>
              <span class="arrow">→</span>
            </div>
          </div>
          
          <div class="feature-card card">
                         <div class="feature-icon-wrapper">
               <div class="feature-icon">S</div>
             </div>
            <h3 class="feature-title">Sécurité Maximale</h3>
            <p class="feature-description">Authentification JWT, données chiffrées et protection complète de vos informations personnelles. Votre sécurité est notre priorité.</p>
            <div class="feature-link">
              <span>En savoir plus</span>
              <span class="arrow">→</span>
            </div>
          </div>
          
          <div class="feature-card card">
                         <div class="feature-icon-wrapper">
               <div class="feature-icon">M</div>
             </div>
            <h3 class="feature-title">Multilingue & Accessible</h3>
            <p class="feature-description">Interface disponible en français et anglais. Support complet pour l'internationalisation et accessibilité universelle.</p>
            <div class="feature-link">
              <span>En savoir plus</span>
              <span class="arrow">→</span>
            </div>
          </div>
          
          <div class="feature-card card">
                         <div class="feature-icon-wrapper">
               <div class="feature-icon">D</div>
             </div>
            <h3 class="feature-title">Design Responsive</h3>
            <p class="feature-description">Interface parfaitement adaptée à tous les appareils : desktop, tablette et mobile. Une expérience optimale partout.</p>
            <div class="feature-link">
              <span>En savoir plus</span>
              <span class="arrow">→</span>
            </div>
          </div>
          
          <div class="feature-card card">
                         <div class="feature-icon-wrapper">
               <div class="feature-icon">P</div>
             </div>
            <h3 class="feature-title">Performance Optimale</h3>
            <p class="feature-description">Application optimisée avec Vite et Vue.js 3 pour des temps de chargement ultra-rapides et une expérience fluide.</p>
            <div class="feature-link">
              <span>En savoir plus</span>
              <span class="arrow">→</span>
            </div>
          </div>
          
          <div class="feature-card card">
                         <div class="feature-icon-wrapper">
               <div class="feature-icon">A</div>
             </div>
            <h3 class="feature-title">Architecture Moderne</h3>
            <p class="feature-description">Backend API REST, frontend SPA et base de données MySQL pour une solution évolutive et maintenable.</p>
            <div class="feature-link">
              <span>En savoir plus</span>
              <span class="arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Restaurants Section -->
    <section class="featured-restaurants light-bg">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">
            <span class="badge badge-primary" style="background: #d4af37; color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.875rem; font-weight: 600;">Restaurants</span>
          </div>
          <h2 class="section-title">Restaurants Vedettes</h2>
          <p class="section-subtitle">Découvrez nos restaurants les plus populaires et réservez votre table dès maintenant</p>
        </div>
        
        <div class="restaurants-grid">
          <div class="restaurant-card featured-card" v-for="restaurant in featuredRestaurants" :key="restaurant.id">
            <div class="restaurant-image">
              <img :src="restaurant.image" :alt="restaurant.name" class="restaurant-img">
              <div class="restaurant-overlay">
                <div class="restaurant-badges">
                  <span class="badge badge-featured">Vedette</span>
                  <span class="badge badge-rating">{{ restaurant.rating }}★</span>
                </div>
              </div>
            </div>
            <div class="restaurant-info">
              <div class="restaurant-header">
                <h3 class="restaurant-name">{{ restaurant.name }}</h3>
                <div class="restaurant-rating">
                  <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                  <span class="rating-number">{{ restaurant.rating }}</span>
                </div>
              </div>
              <div class="restaurant-details">
                <p class="restaurant-cuisine">{{ restaurant.cuisine_type }}</p>
                <p class="restaurant-price">{{ restaurant.price_range }}</p>
                <p class="restaurant-address">{{ restaurant.address }}</p>
              </div>
              <div class="restaurant-actions">
                <router-link :to="`/restaurants/${restaurant.id}`" class="btn btn-primary btn-sm">
                  Voir détails
                </router-link>
                <router-link :to="`/restaurants/${restaurant.id}`" class="btn btn-outline btn-sm">
                  Réserver
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section-actions">
          <router-link to="/restaurants" class="btn btn-primary btn-lg">
            Voir tous les restaurants
            <span class="btn-arrow">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="tech-stack dark-bg">
      <div class="container">
        <div class="section-header">
                               <div class="section-badge">
            <span class="badge badge-primary" style="background: #d4af37; color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.875rem; font-weight: 600;">Technologies</span>
          </div>
          <h2 class="section-title">Stack Technique Moderne</h2>
          <p class="section-subtitle">Technologies de pointe utilisées pour développer cette application de nouvelle génération</p>
        </div>
        
        <div class="tech-grid">
          <div class="tech-card card">
            <div class="tech-header">
                             <div class="tech-icon-wrapper">
                 <div class="tech-icon">F</div>
               </div>
              <h3 class="tech-title">Frontend</h3>
            </div>
            <ul class="tech-list">
              <li><span class="tech-badge badge badge-primary">Vue.js 3</span> Composition API</li>
              <li><span class="tech-badge badge badge-primary">Vue Router</span> Navigation SPA</li>
              <li><span class="tech-badge badge badge-primary">Axios</span> Client HTTP</li>
              <li><span class="tech-badge badge badge-primary">i18next</span> Internationalisation</li>
              <li><span class="tech-badge badge badge-primary">Vite</span> Build tool</li>
            </ul>
          </div>
          
          <div class="tech-card card">
            <div class="tech-header">
                             <div class="tech-icon-wrapper">
                 <div class="tech-icon">B</div>
               </div>
              <h3 class="tech-title">Backend</h3>
            </div>
            <ul class="tech-list">
                             <li><span class="tech-badge badge badge-primary">Node.js</span> Runtime JavaScript</li>
               <li><span class="tech-badge badge badge-primary">Express.js</span> Framework web</li>
               <li><span class="tech-badge badge badge-primary">MySQL</span> Base de données</li>
               <li><span class="tech-badge badge badge-primary">JWT</span> Authentification</li>
               <li><span class="tech-badge badge badge-primary">bcryptjs</span> Chiffrement</li>
            </ul>
          </div>
          
          <div class="tech-card card">
            <div class="tech-header">
                             <div class="tech-icon-wrapper">
                 <div class="tech-icon">T</div>
               </div>
              <h3 class="tech-title">Outils & DevOps</h3>
            </div>
            <ul class="tech-list">
                             <li><span class="tech-badge badge badge-primary">Git</span> Version control</li>
               <li><span class="tech-badge badge badge-primary">npm</span> Package manager</li>
               <li><span class="tech-badge badge badge-primary">Nodemon</span> Auto-reload</li>
               <li><span class="tech-badge badge badge-primary">Helmet</span> Sécurité</li>
               <li><span class="tech-badge badge badge-primary">CORS</span> Cross-origin</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <div class="cta-badge">
            <span class="badge badge-primary" style="background: rgba(255, 255, 255, 0.2); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.875rem; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.3);">Prêt ?</span>
          </div>
          <h2 class="cta-title">Prêt à vivre l'expérience ?</h2>
          <p class="cta-subtitle">Rejoignez notre plateforme et découvrez une nouvelle façon de réserver vos restaurants préférés</p>
          <div class="cta-actions">
                         <router-link to="/register" class="btn btn-primary btn-lg cta-btn">
               <span class="btn-text">Créer un compte</span>
               <span class="btn-arrow">→</span>
             </router-link>
                           <router-link to="/login" class="btn btn-secondary btn-lg cta-btn">
                <span class="btn-text">Se connecter</span>
              </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import authService from '../services/auth.js'

export default {
  name: 'Home',
  setup() {
    const isAuthenticated = ref(false)
    
    // Données des restaurants vedettes
    const featuredRestaurants = ref([
      {
        id: 1,
        name: "Le Petit Bistrot",
        cuisine_type: "Française",
        price_range: "€€",
        rating: 4.8,
        address: "123 Rue de la Paix, Paris",
        image: "/img/restaurants/restaurant1.jpg"
      },
      {
        id: 2,
        name: "Sakura Sushi",
        cuisine_type: "Japonaise",
        price_range: "€€€",
        rating: 4.9,
        address: "456 Avenue des Champs, Paris",
        image: "/img/restaurants/restaurant2.jpg"
      },
      {
        id: 3,
        name: "Trattoria Bella",
        cuisine_type: "Italienne",
        price_range: "€€",
        rating: 4.7,
        address: "789 Boulevard Saint-Germain, Paris",
        image: "/img/restaurants/restaurant3.jpg"
      }
    ])

    onMounted(() => {
      isAuthenticated.value = authService.isAuthenticated()
    })

    return {
      isAuthenticated,
      featuredRestaurants
    }
  }
}
</script>

<style scoped>
        .home {
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100vw;
          max-width: 100vw;
        }

        /* Hero Section avec Vidéo */
        .hero {
          position: relative;
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: white;
          margin: 0;
          padding: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1;
        }

        .background-video {
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          object-position: center;
        }

        .video-fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
}

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  margin: 0 auto;
}

.hero-badge {
  margin-bottom: 2rem;
}

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 2rem;
          text-shadow: 0 4px 8px rgba(0,0,0,0.3);
          letter-spacing: -0.02em;
          font-family: 'Playfair Display', serif;
        }

        .title-line {
          display: block;
          margin-bottom: 0.5rem;
        }

                 .title-highlight {
           background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
           display: inline-block;
           margin: 0.5rem 0;
           font-weight: 400;
           text-shadow: 0 0 20px var(--primary-color);
         }

        .hero-subtitle {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          margin-bottom: 3rem;
          opacity: 0.95;
          line-height: 1.6;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 300;
          letter-spacing: 0.01em;
          font-family: 'Inter', sans-serif;
        }

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

                 .stat-number {
           font-size: 2.5rem;
           font-weight: 300;
           color: var(--primary-color);
           display: block;
           margin-bottom: 0.5rem;
           font-family: 'Playfair Display', serif;
           text-shadow: 0 0 15px var(--primary-color);
         }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
        }

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
}

        .hero-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 50px;
          font-weight: 500;
          letter-spacing: 0.02em;
          font-family: 'Inter', sans-serif;
          text-transform: none;
          padding: 1rem 2.5rem;
          min-width: 200px;
        }

                 .hero-btn:hover {
           transform: translateY(-3px);
           box-shadow: 0 20px 40px rgba(0,0,0,0.15);
         }

         

                 .btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border: none;
  color: white;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #b8941f 0%, #d4af37 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  transform: translateY(-2px);
}

                 .btn-outline {
  background: transparent;
  border: 2px solid #d4af37;
  color: #d4af37;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #d4af37;
  border-color: #d4af37;
  color: white;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

          .btn-secondary {
            background: var(--surface-dark);
            border: 2px solid var(--surface-dark);
            color: var(--primary-color);
            backdrop-filter: blur(10px);
            transition: var(--transition-slow);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }

          .btn-secondary:hover {
            background: var(--surface-color);
            border-color: var(--primary-color);
            color: var(--primary-color);
            box-shadow: var(--shadow-gold);
            transform: translateY(-2px);
          }



        .btn-arrow {
          margin-left: 0.75rem;
          transition: transform 0.3s ease;
          font-weight: 600;
        }

        .hero-btn:hover .btn-arrow {
          transform: translateX(6px);
        }



/* Features Section */
.features {
  padding: 8rem 0;
  background: #1a1a1a;
  position: relative;
  color: white;
}

.features::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, #1a1a1a, transparent);
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-badge {
  margin-bottom: 1rem;
}

        .section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  margin-bottom: 1.5rem;
  font-family: 'Playfair Display', serif;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 300;
  font-family: 'Inter', sans-serif;
}

/* Couleurs pour fonds sombres */
.features .section-title,
.tech-stack .section-title {
  color: white;
}

.features .section-subtitle,
.tech-stack .section-subtitle {
  color: #e0e0e0;
}

/* Couleurs pour fonds clairs */
.featured-restaurants .section-title {
  color: #2c3e50;
}

.featured-restaurants .section-subtitle {
  color: #5a6c7d;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  text-align: center;
  padding: 3rem 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: #2a2a2a;
  border-radius: 15px;
  border: 1px solid #333;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-12px);
}

                 .feature-icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

                 .feature-card:hover .feature-icon-wrapper {
           transform: scale(1.1);
           box-shadow: 0 12px 35px rgba(200, 162, 125, 0.4);
         }

        .feature-icon {
          font-size: 2rem;
        }

        .feature-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
}

.feature-description {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 300;
}

/* Couleurs pour cartes sur fond sombre */
.features .feature-title {
  color: white;
}

.features .feature-description {
  color: #e0e0e0;
}

.feature-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #d4af37;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-link:hover {
  gap: 0.75rem;
}

.arrow {
  transition: transform 0.3s ease;
}

.feature-link:hover .arrow {
  transform: translateX(4px);
}



/* Tech Stack Section */
.tech-stack {
  padding: 8rem 0;
  background: #1a1a1a;
  position: relative;
  color: white;
}

.tech-stack::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, #1a1a1a, transparent);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
}

.tech-card {
  padding: 3rem;
  position: relative;
  overflow: hidden;
  background: #2a2a2a;
  border-radius: 15px;
  border: 1px solid #333;
}

.tech-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tech-card:hover::before {
  transform: scaleX(1);
}

.tech-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #333;
}

.tech-icon-wrapper {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.tech-card:hover .tech-icon-wrapper {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(200, 162, 125, 0.4);
}

.tech-icon {
  font-size: 1.5rem;
}

.tech-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

/* Couleurs pour cartes sur fond sombre */
.tech-stack .tech-title {
  color: white;
}

.tech-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tech-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  transition: all 0.3s ease;
}

.tech-list li:hover {
  padding-left: 0.5rem;
}

/* Couleurs pour listes sur fond sombre */
.tech-stack .tech-list li {
  border-bottom: 1px solid #333;
  color: #e0e0e0;
}

.tech-stack .tech-list li:hover {
  color: white;
}

.tech-list li:last-child {
  border-bottom: none;
}

.tech-badge {
  font-size: 0.625rem;
  padding: 0.25rem 0.75rem;
  min-width: 80px;
  text-align: center;
  background: #d4af37;
  color: white;
  border-radius: 4px;
  font-weight: 600;
}

                 /* CTA Section */
         .cta {
  padding: 8rem 0;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.cta-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: 0 auto;
}

.cta-badge {
  margin-bottom: 1rem;
}

        .cta-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  margin-bottom: 1.5rem;
  font-family: 'Playfair Display', serif;
  letter-spacing: -0.02em;
  color: white;
}

        .cta-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  color: white;
  line-height: 1.6;
  font-weight: 300;
  font-family: 'Inter', sans-serif;
}

.cta-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

/* Featured Restaurants Section */
.featured-restaurants {
  padding: 6rem 0;
  background: #f8f9fa;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.featured-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.featured-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.restaurant-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.restaurant-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-card:hover .restaurant-img {
  transform: scale(1.05);
}

.restaurant-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3));
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 15px;
}

.restaurant-badges {
  display: flex;
  gap: 8px;
}

.badge-featured {
  background: #d4af37;
  color: white;
}

.badge-rating {
  background: #28a745;
  color: white;
}

.restaurant-info {
  padding: 25px;
}

.restaurant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.restaurant-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Playfair Display', serif;
  color: #2c3e50;
}

.restaurant-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rating-stars {
  font-size: 0.9rem;
}

.rating-number {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 600;
}

.restaurant-details {
  margin-bottom: 20px;
}

.restaurant-cuisine {
  color: #d4af37;
  font-weight: 600;
  margin: 0 0 5px 0;
  font-size: 0.9rem;
}

.restaurant-price {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0 0 5px 0;
}

.restaurant-address {
  color: #5a6c7d;
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
}

.restaurant-actions {
  display: flex;
  gap: 10px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: 20px;
}

.section-actions {
  text-align: center;
  margin-top: 3rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    height: 100vh;
    padding: 2rem 0;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .hero-actions,
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .tech-list li {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .features,
  .tech-stack,
  .cta {
    padding: 6rem 0;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 1rem 0;
  }
  
  .hero-stats {
    gap: 1.5rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .features,
  .tech-stack,
  .cta {
    padding: 4rem 0;
  }
  
  .feature-card,
  .tech-card {
    padding: 2rem 1.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Animation pour les cartes au scroll */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card,
.tech-card {
  animation: slideInUp 0.6s ease-out;
}

.feature-card:nth-child(2) { animation-delay: 0.1s; }
.feature-card:nth-child(3) { animation-delay: 0.2s; }
.feature-card:nth-child(4) { animation-delay: 0.3s; }
.feature-card:nth-child(5) { animation-delay: 0.4s; }
.feature-card:nth-child(6) { animation-delay: 0.5s; }

.tech-card:nth-child(2) { animation-delay: 0.1s; }
.tech-card:nth-child(3) { animation-delay: 0.2s; }
</style>
