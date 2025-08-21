<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-brand">
        <router-link to="/" class="nav-logo">
          🍽️ RestaurantReservation
        </router-link>
      </div>
      
      <div class="nav-menu">
        <router-link to="/" class="nav-link">{{ $t('navigation.home') }}</router-link>
        <router-link to="/restaurants" class="nav-link" v-if="isAuthenticated">{{ $t('navigation.restaurants') }}</router-link>
        <router-link to="/reservations" class="nav-link" v-if="isAuthenticated">{{ $t('navigation.reservations') }}</router-link>
      </div>
      
      <div class="nav-auth">
        <LanguageSelector />
        <template v-if="isAuthenticated">
          <router-link to="/profile" class="nav-link">{{ $t('navigation.profile') }}</router-link>
          <button @click="logout" class="btn btn-outline">{{ $t('navigation.logout') }}</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">{{ $t('navigation.login') }}</router-link>
          <router-link to="/register" class="btn btn-primary">{{ $t('navigation.register') }}</router-link>
        </template>
      </div>
    </nav>
  </header>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '../services/auth.js'
import LanguageSelector from './LanguageSelector.vue'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isAuthenticated = ref(false)
    const currentUser = ref(null)

    const checkAuth = () => {
      isAuthenticated.value = authService.isAuthenticated()
      currentUser.value = authService.getCurrentUser()
    }

    const logout = () => {
      authService.logout()
      isAuthenticated.value = false
      currentUser.value = null
      router.push('/')
    }

    // Surveiller les changements de route pour mettre à jour l'état d'authentification
    watch(route, () => {
      checkAuth()
    })

    onMounted(() => {
      checkAuth()
    })

    return {
      isAuthenticated,
      currentUser,
      logout
    }
  },
  components: {
    LanguageSelector
  }
  }
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-logo {
  text-decoration: none;
  color: #333;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #007bff;
}

.nav-link.router-link-active {
  color: #007bff;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-outline {
  background: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}
</style>
