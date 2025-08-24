<template>
          <header class="header">
    <div class="container">
      <nav class="nav">
        <div class="nav-brand">
                                <router-link :to="isRestaurantAuthenticated ? '/restaurant-dashboard' : '/'" class="nav-logo">
                        <span class="logo-icon">G</span>
                        <span class="logo-text">GastroReserve</span>
                      </router-link>
        </div>
        
        <div class="nav-menu" :class="{ 'nav-menu-open': isMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMenu">
            {{ $t('navigation.home') }}
          </router-link>
          <router-link to="/restaurants" class="nav-link" v-if="isAuthenticated" @click="closeMenu">
            {{ $t('navigation.restaurants') }}
          </router-link>
          <router-link to="/reservations" class="nav-link" v-if="isAuthenticated" @click="closeMenu">
            {{ $t('navigation.reservations') }}
          </router-link>
          <router-link to="/email-history" class="nav-link" v-if="isAuthenticated" @click="closeMenu">
            📧 Emails
          </router-link>
        </div>
        
        <div class="nav-auth">
          <LanguageSelector />
          
          <template v-if="isRestaurantAuthenticated">
            <div class="user-menu">
              <router-link to="/restaurant-dashboard" class="nav-link user-link">
                <span class="user-avatar">🏪</span>
                <span class="user-name">{{ $t('navigation.restaurant_dashboard') }}</span>
              </router-link>
              <button @click="logoutRestaurant" class="btn btn-outline btn-sm">
                {{ $t('navigation.logout') }}
              </button>
            </div>
          </template>
          
          <template v-else-if="isAuthenticated">
            <div class="user-menu">
              <NotificationCenter />
              <router-link to="/profile" class="nav-link user-link">
                <span class="user-avatar">👤</span>
                <span class="user-name">{{ currentUser?.first_name || $t('navigation.profile') }}</span>
              </router-link>
              <button @click="logout" class="btn btn-outline btn-sm">
                {{ $t('navigation.logout') }}
              </button>
            </div>
          </template>
          
          <template v-else>
            <router-link to="/login" class="nav-link">{{ $t('navigation.login') }}</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm">{{ $t('navigation.register') }}</router-link>
            <router-link to="/restaurant-register" class="btn btn-outline btn-sm">{{ $t('navigation.restaurant_register') }}</router-link>
          </template>
          
          <button class="nav-toggle" @click="toggleMenu" :class="{ 'nav-toggle-open': isMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '../services/auth.js'
import LanguageSelector from './LanguageSelector.vue'
import NotificationCenter from './NotificationCenter.vue'

        export default {
          name: 'Header',
          setup() {
            const router = useRouter()
            const route = useRoute()
            const isAuthenticated = ref(false)
            const currentUser = ref(null)
            const isRestaurantAuthenticated = ref(false)
            const isMenuOpen = ref(false)

            const checkAuth = () => {
              isAuthenticated.value = authService.isAuthenticated()
              currentUser.value = authService.getCurrentUser()
              isRestaurantAuthenticated.value = localStorage.getItem('restaurantLoggedIn') === 'true'
            }

            const logout = () => {
              authService.logout()
              isAuthenticated.value = false
              currentUser.value = null
              router.push('/')
            }

            const logoutRestaurant = () => {
              localStorage.removeItem('restaurantLoggedIn')
              localStorage.removeItem('currentRestaurant')
              isRestaurantAuthenticated.value = false
              router.push('/')
            }

            const toggleMenu = () => {
              isMenuOpen.value = !isMenuOpen.value
            }

            const closeMenu = () => {
              isMenuOpen.value = false
            }

            // Surveiller les changements de route pour mettre à jour l'état d'authentification
            watch(route, () => {
              checkAuth()
              closeMenu()
            })

            onMounted(() => {
              checkAuth()
            })

            return {
              isAuthenticated,
              currentUser,
              isRestaurantAuthenticated,
              isMenuOpen,
              logout,
              logoutRestaurant,
              toggleMenu,
              closeMenu
            }
          },
          components: {
            LanguageSelector,
            NotificationCenter
          }
        }
</script>

<style scoped>
        .header {
          background: var(--surface-color);
          box-shadow: var(--shadow-md);
          border-bottom: 1px solid var(--border-gold);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
          background: rgba(26, 26, 26, 0.95);
        }

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 2rem;
}

.nav-brand {
  flex-shrink: 0;
}

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.25rem;
          transition: var(--transition);
          outline: none !important;
          box-shadow: none !important;
        }

        .nav-logo:focus,
        .nav-logo:focus-visible {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* Suppression globale pour tous les éléments de navigation */
        .header *:focus,
        .header *:focus-visible,
        .nav *:focus,
        .nav *:focus-visible {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }

        .nav-logo:hover {
          color: var(--primary-color);
          transform: translateY(-1px);
          text-shadow: 0 0 10px var(--primary-color);
        }



.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  display: none;
}

@media (min-width: 640px) {
  .logo-text {
    display: inline;
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;
  margin-left: 8%;
  min-width: 200px;
}

        .nav-link {
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.875rem;
          transition: var(--transition);
          position: relative;
          padding: 0.5rem 0;
          text-align: center;
          min-width: 80px;
          outline: none !important;
          box-shadow: none !important;
        }

        .nav-link:focus,
        .nav-link:focus-visible {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }

        .nav-link:hover {
          color: var(--primary-color);
          text-shadow: 0 0 8px var(--primary-color);
        }

        .nav-link.router-link-active {
          color: var(--primary-color);
          text-shadow: 0 0 8px var(--primary-color);
        }



.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  border-radius: 1px;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.user-link:hover {
  background: var(--surface-color);
  color: var(--primary-color);
  text-shadow: 0 0 8px var(--primary-color);
}

.user-avatar {
  font-size: 1.25rem;
}

.user-name {
  display: none;
  font-weight: 500;
}

@media (min-width: 768px) {
  .user-name {
    display: inline;
  }
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  outline: none !important;
  box-shadow: none !important;
}

.nav-toggle:focus,
.nav-toggle:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.nav-toggle:hover {
  background: var(--surface-color);
}



.nav-toggle span {
  width: 20px;
  height: 2px;
  background: var(--text-secondary);
  transition: var(--transition);
  border-radius: 1px;
}

.nav-toggle-open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle-open span:nth-child(2) {
  opacity: 0;
}

.nav-toggle-open span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

@media (max-width: 768px) {
  .nav {
    padding: 0.75rem 0;
  }
  
  .nav-menu {
    position: fixed;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface-color);
    flex-direction: column;
    gap: 0;
    padding: 1rem 0;
    box-shadow: var(--shadow-lg);
    border-top: 1px solid var(--border-color);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
  }
  
  .nav-menu-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-link {
    width: 100%;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .nav-link:last-child {
    border-bottom: none;
  }
  
  .nav-link.router-link-active::after {
    display: none;
  }
  
  .nav-toggle {
    display: flex;
  }
  
  .user-menu {
    display: none;
  }
}
</style>
