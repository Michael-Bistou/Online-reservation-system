import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/auth.js'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import RestaurantRegister from '../views/RestaurantRegister.vue'
import RestaurantLogin from '../views/RestaurantLogin.vue'
import RestaurantDashboard from '../views/RestaurantDashboard.vue'
import Restaurants from '../views/Restaurants.vue'
import RestaurantDetails from '../views/RestaurantDetails.vue'
import Reservations from '../views/Reservations.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Accueil' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Connexion', guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: 'Inscription', guestOnly: true }
  },
  {
    path: '/restaurant-register',
    name: 'RestaurantRegister',
    component: RestaurantRegister,
    meta: { title: 'Inscription Restaurant', guestOnly: true }
  },
  {
    path: '/restaurant-login',
    name: 'RestaurantLogin',
    component: RestaurantLogin,
    meta: { title: 'Connexion Restaurant', guestOnly: true }
  },
  {
    path: '/restaurant-dashboard',
    name: 'RestaurantDashboard',
    component: RestaurantDashboard,
    meta: { title: 'Dashboard Restaurant', requiresRestaurantAuth: true }
  },
  {
    path: '/restaurants',
    name: 'Restaurants',
    component: Restaurants,
    meta: { title: 'Restaurants', requiresAuth: true }
  },
  {
    path: '/restaurants/:id',
    name: 'RestaurantDetails',
    component: RestaurantDetails,
    meta: { title: 'Détails Restaurant', requiresAuth: true }
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: Reservations,
    meta: { title: 'Mes Réservations', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: 'Mon Profil', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard améliorée pour l'authentification
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  const isRestaurantAuthenticated = localStorage.getItem('restaurantLoggedIn') === 'true'
  
  // Mettre à jour le titre de la page
  document.title = to.meta.title ? `${to.meta.title} - Système de Réservation` : 'Système de Réservation'
  
  // Vérifier l'authentification utilisateur
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de connexion avec l'URL de retour
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Vérifier l'authentification restaurant
  if (to.meta.requiresRestaurantAuth && !isRestaurantAuthenticated) {
    next('/restaurant-login')
    return
  }
  
  // Empêcher les utilisateurs connectés d'accéder aux pages d'invité
  if (to.meta.guestOnly && (isAuthenticated || isRestaurantAuthenticated)) {
    next('/')
    return
  }
  
  next()
})

// Navigation guard après chaque navigation
router.afterEach((to) => {
  // Faire défiler vers le haut de la page
  window.scrollTo(0, 0)
})

export default router
