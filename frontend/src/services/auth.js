import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token')
    this.user = JSON.parse(localStorage.getItem('userData') || 'null')
    this.setupAxiosInterceptors()
  }

  // Configuration des intercepteurs Axios
  setupAxiosInterceptors() {
    // Intercepteur de requête - ajouter le token automatiquement
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token && config.url?.startsWith(API_BASE_URL)) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Intercepteur de réponse - gérer l'expiration du token
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
          // Rediriger vers la page de connexion
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Obtenir le token
  getToken() {
    return localStorage.getItem('token')
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = this.getToken()
    if (!token) return false

    try {
      // Vérifier si le token n'est pas expiré
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      
      if (payload.exp < now) {
        this.logout()
        return false
      }
      
      return true
    } catch (error) {
      console.error('Token invalide:', error)
      this.logout()
      return false
    }
  }

  // Connexion
  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      })

      const { token, user } = response.data
      
      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token)
      localStorage.setItem('userData', JSON.stringify(user))
      localStorage.setItem('userRole', user.role || 'user')
      this.token = token
      this.user = user

      return { success: true, data: { token, user } }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur de connexion'
      }
    }
  }

  // Inscription
  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
      
      const { token, user } = response.data
      
      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token)
      localStorage.setItem('userData', JSON.stringify(user))
      localStorage.setItem('userRole', user.role || 'user')
      this.token = token
      this.user = user

      return { success: true, data: { token, user } }
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur d\'inscription',
        errors: error.response?.data?.errors || []
      }
    }
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    localStorage.removeItem('userRole')
    this.token = null
    this.user = null
  }

  // Obtenir le profil utilisateur
  async getProfile() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Non authentifié')
      }

      const response = await axios.get(`${API_BASE_URL}/auth/profile`)
      this.user = response.data
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors de la récupération du profil'
      }
    }
  }

  // Mettre à jour le profil
  async updateProfile(profileData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData)
      this.user = { ...this.user, ...profileData }
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors de la mise à jour',
        errors: error.response?.data?.errors || []
      }
    }
  }

  // Changer le mot de passe
  async changePassword(currentPassword, newPassword) {
    try {
      await axios.put(`${API_BASE_URL}/auth/password`, {
        currentPassword,
        newPassword
      })
      return { success: true }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur lors du changement de mot de passe'
      }
    }
  }

  // Obtenir les informations utilisateur actuelles
  getCurrentUser() {
    if (this.user) {
      return this.user
    }
    
    // Fallback vers localStorage si this.user est null
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        this.user = JSON.parse(userData)
        return this.user
      }
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error)
    }
    
    return null
  }

  // Forcer la mise à jour du rôle utilisateur
  updateUserRole() {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const user = JSON.parse(userData)
        if (user.role) {
          localStorage.setItem('userRole', user.role)
          console.log('Rôle utilisateur mis à jour:', user.role)
          return user.role
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error)
    }
    return null
  }

  // Vérifier les permissions utilisateur
  hasRole(role) {
    return this.user?.role === role
  }

  // Rafraîchir le token (si implémenté côté serveur)
  async refreshToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`)
      const { token } = response.data
      
      localStorage.setItem('token', token)
      this.token = token
      
      return { success: true, token }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error)
      this.logout()
      return { success: false }
    }
  }
}

// Instance singleton du service d'authentification
const authService = new AuthService()

export default authService
