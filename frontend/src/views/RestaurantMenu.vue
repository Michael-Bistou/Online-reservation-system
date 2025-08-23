<template>
  <div class="restaurant-menu">
    <!-- Barre de navigation restaurant -->
    <div class="restaurant-nav">
      <div class="container">
        <div class="nav-content">
          <div class="nav-brand">
            <router-link to="/restaurant-dashboard" class="nav-logo">
              🏪 Dashboard Restaurant
            </router-link>
          </div>
          <div class="nav-links">
            <router-link to="/restaurant-dashboard" class="nav-link">
              📊 Dashboard
            </router-link>
            <router-link to="/restaurant-reservations" class="nav-link">
              📅 Réservations
            </router-link>
            <router-link to="/restaurant-stats" class="nav-link">
              📈 Statistiques
            </router-link>
            <router-link to="/restaurant-menu" class="nav-link active">
              📝 Menu
            </router-link>
            <router-link to="/restaurant-profile" class="nav-link">
              ⚙️ Profil
            </router-link>
          </div>
          <div class="nav-actions">
            <router-link to="/" class="btn btn-outline btn-sm">
              🏠 Site Principal
            </router-link>
            <button @click="logout" class="btn btn-outline btn-sm">
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Gestion du Menu</h1>
        <p class="page-subtitle">Gérez vos plats et votre carte</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- Actions principales -->
        <div class="actions-section">
          <div class="actions-row">
            <button @click="showAddModal = true" class="btn btn-primary">
              <span class="btn-icon">➕</span>
              Ajouter un plat
            </button>
            <button @click="exportMenu" class="btn btn-outline">
              <span class="btn-icon">📄</span>
              Exporter le menu
            </button>
            <button @click="importMenu" class="btn btn-outline">
              <span class="btn-icon">📥</span>
              Importer un menu
            </button>
          </div>
        </div>

        <!-- Filtres et recherche -->
        <div class="filters-section">
          <div class="filters-row">
            <div class="search-group">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Rechercher un plat..." 
                class="search-input"
              />
            </div>
            <div class="filter-group">
              <select v-model="selectedCategory" class="filter-select">
                <option value="">Toutes les catégories</option>
                <option value="entrees">Entrées</option>
                <option value="plats">Plats principaux</option>
                <option value="desserts">Desserts</option>
                <option value="boissons">Boissons</option>
              </select>
            </div>
            <div class="filter-group">
              <select v-model="sortBy" class="filter-select">
                <option value="name">Trier par nom</option>
                <option value="price">Trier par prix</option>
                <option value="category">Trier par catégorie</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Statistiques du menu -->
        <div class="menu-stats">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🍽️</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalDishes }}</div>
                <div class="stat-label">Total des plats</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <div class="stat-number">{{ averagePrice }}€</div>
                <div class="stat-label">Prix moyen</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-content">
                <div class="stat-number">{{ popularDishes.length }}</div>
                <div class="stat-label">Plats populaires</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🆕</div>
              <div class="stat-content">
                <div class="stat-number">{{ newDishes.length }}</div>
                <div class="stat-label">Nouveaux plats</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Liste des plats -->
        <div class="dishes-section">
          <div class="dishes-grid">
            <div 
              v-for="dish in filteredDishes" 
              :key="dish.id"
              class="dish-card"
            >
              <div class="dish-image">
                <img :src="dish.image || '/img/placeholder-dish.jpg'" :alt="dish.name" />
                <div class="dish-overlay">
                  <button @click="editDish(dish)" class="edit-btn">✏️</button>
                  <button @click="deleteDish(dish.id)" class="delete-btn">🗑️</button>
                </div>
              </div>
              <div class="dish-content">
                <div class="dish-header">
                  <h3 class="dish-name">{{ dish.name }}</h3>
                  <span class="dish-price">{{ dish.price }}€</span>
                </div>
                <p class="dish-description">{{ dish.description }}</p>
                <div class="dish-meta">
                  <span class="dish-category">{{ getCategoryLabel(dish.category) }}</span>
                  <span class="dish-status" :class="dish.available ? 'available' : 'unavailable'">
                    {{ dish.available ? 'Disponible' : 'Indisponible' }}
                  </span>
                </div>
                <div class="dish-tags">
                  <span v-if="dish.vegetarian" class="tag vegetarian">Végétarien</span>
                  <span v-if="dish.glutenFree" class="tag gluten-free">Sans gluten</span>
                  <span v-if="dish.spicy" class="tag spicy">Épicé</span>
                </div>
              </div>
            </div>
          </div>

          <!-- État vide -->
          <div v-if="filteredDishes.length === 0" class="empty-state">
            <div class="empty-icon">🍽️</div>
            <h3>Aucun plat trouvé</h3>
            <p>{{ searchQuery ? 'Aucun plat ne correspond à votre recherche.' : 'Commencez par ajouter votre premier plat !' }}</p>
            <button @click="showAddModal = true" class="btn btn-primary">Ajouter un plat</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification de plat -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Modifier le plat' : 'Ajouter un plat' }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="saveDish" class="dish-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nom du plat *</label>
              <input 
                v-model="dishForm.name" 
                type="text" 
                class="form-input" 
                required 
                placeholder="Ex: Salade César"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Prix (€) *</label>
              <input 
                v-model="dishForm.price" 
                type="number" 
                step="0.01" 
                min="0" 
                class="form-input" 
                required 
                placeholder="12.50"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Catégorie *</label>
              <select v-model="dishForm.category" class="form-select" required>
                <option value="">Sélectionner une catégorie</option>
                <option value="entrees">Entrées</option>
                <option value="plats">Plats principaux</option>
                <option value="desserts">Desserts</option>
                <option value="boissons">Boissons</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Image URL</label>
              <input 
                v-model="dishForm.image" 
                type="url" 
                class="form-input" 
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div class="form-group full-width">
              <label class="form-label">Description *</label>
              <textarea 
                v-model="dishForm.description" 
                class="form-textarea" 
                required 
                rows="3"
                placeholder="Décrivez votre plat..."
              ></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Ingrédients</label>
              <textarea 
                v-model="dishForm.ingredients" 
                class="form-textarea" 
                rows="3"
                placeholder="Liste des ingrédients..."
              ></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Temps de préparation (min)</label>
              <input 
                v-model="dishForm.prepTime" 
                type="number" 
                min="0" 
                class="form-input" 
                placeholder="15"
              />
            </div>
          </div>
          
          <div class="form-options">
            <div class="options-grid">
              <label class="checkbox-label">
                <input v-model="dishForm.available" type="checkbox" />
                <span class="checkmark"></span>
                Disponible
              </label>
              
              <label class="checkbox-label">
                <input v-model="dishForm.vegetarian" type="checkbox" />
                <span class="checkmark"></span>
                Végétarien
              </label>
              
              <label class="checkbox-label">
                <input v-model="dishForm.glutenFree" type="checkbox" />
                <span class="checkmark"></span>
                Sans gluten
              </label>
              
              <label class="checkbox-label">
                <input v-model="dishForm.spicy" type="checkbox" />
                <span class="checkmark"></span>
                Épicé
              </label>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-outline">Annuler</button>
            <button type="submit" class="btn btn-primary">
              {{ showEditModal ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h2>Confirmer la suppression</h2>
          <button @click="showDeleteModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <p>Êtes-vous sûr de vouloir supprimer ce plat ? Cette action est irréversible.</p>
        </div>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn btn-outline">Annuler</button>
          <button @click="confirmDelete" class="btn btn-danger">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'RestaurantMenu',
  setup() {
    const dishes = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const sortBy = ref('name')
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const showDeleteModal = ref(false)
    const dishToDelete = ref(null)

    const dishForm = ref({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '',
      ingredients: '',
      prepTime: '',
      available: true,
      vegetarian: false,
      glutenFree: false,
      spicy: false
    })

    // Computed properties
    const filteredDishes = computed(() => {
      let filtered = dishes.value

      // Filtre par recherche
      if (searchQuery.value) {
        filtered = filtered.filter(dish => 
          dish.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      // Filtre par catégorie
      if (selectedCategory.value) {
        filtered = filtered.filter(dish => dish.category === selectedCategory.value)
      }

      // Tri
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'price':
            return parseFloat(a.price) - parseFloat(b.price)
          case 'category':
            return a.category.localeCompare(b.category)
          default:
            return a.name.localeCompare(b.name)
        }
      })

      return filtered
    })

    const totalDishes = computed(() => dishes.value.length)
    const averagePrice = computed(() => {
      if (dishes.value.length === 0) return 0
      const total = dishes.value.reduce((sum, dish) => sum + parseFloat(dish.price), 0)
      return (total / dishes.value.length).toFixed(2)
    })
    const popularDishes = computed(() => dishes.value.filter(dish => dish.popular))
    const newDishes = computed(() => dishes.value.filter(dish => dish.isNew))

    // Methods
    const loadMenu = () => {
      loading.value = true
      
      try {
        const storedMenu = localStorage.getItem('restaurantMenu')
        if (storedMenu) {
          dishes.value = JSON.parse(storedMenu)
        } else {
          // Menu d'exemple
          dishes.value = getSampleMenu()
          saveMenuToStorage()
        }
      } catch (err) {
        console.error('Erreur lors du chargement du menu:', err)
        dishes.value = getSampleMenu()
        saveMenuToStorage()
      }
      
      loading.value = false
    }

    const getSampleMenu = () => {
      return [
        {
          id: 1,
          name: 'Salade César',
          price: 12.50,
          category: 'entrees',
          description: 'Salade romaine, parmesan, croûtons, sauce césar',
          image: '',
          ingredients: 'Laitue romaine, parmesan, croûtons, anchois, huile d\'olive',
          prepTime: 10,
          available: true,
          vegetarian: false,
          glutenFree: false,
          spicy: false,
          popular: true,
          isNew: false
        },
        {
          id: 2,
          name: 'Steak Frites',
          price: 24.00,
          category: 'plats',
          description: 'Steak de bœuf grillé avec frites maison',
          image: '',
          ingredients: 'Steak de bœuf, pommes de terre, beurre, herbes',
          prepTime: 20,
          available: true,
          vegetarian: false,
          glutenFree: true,
          spicy: false,
          popular: true,
          isNew: false
        },
        {
          id: 3,
          name: 'Tiramisu',
          price: 8.50,
          category: 'desserts',
          description: 'Dessert italien classique au café et mascarpone',
          image: '',
          ingredients: 'Mascarpone, œufs, sucre, café, cacao',
          prepTime: 15,
          available: true,
          vegetarian: true,
          glutenFree: false,
          spicy: false,
          popular: true,
          isNew: false
        }
      ]
    }

    const saveMenuToStorage = () => {
      localStorage.setItem('restaurantMenu', JSON.stringify(dishes.value))
    }

    const resetForm = () => {
      dishForm.value = {
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        ingredients: '',
        prepTime: '',
        available: true,
        vegetarian: false,
        glutenFree: false,
        spicy: false
      }
    }

    const editDish = (dish) => {
      dishForm.value = { ...dish }
      showEditModal.value = true
    }

    const deleteDish = (dishId) => {
      dishToDelete.value = dishId
      showDeleteModal.value = true
    }

    const confirmDelete = () => {
      if (dishToDelete.value) {
        dishes.value = dishes.value.filter(dish => dish.id !== dishToDelete.value)
        saveMenuToStorage()
        showDeleteModal.value = false
        dishToDelete.value = null
      }
    }

    const saveDish = () => {
      if (showEditModal.value) {
        // Modification
        const index = dishes.value.findIndex(dish => dish.id === dishForm.value.id)
        if (index !== -1) {
          dishes.value[index] = { ...dishForm.value }
        }
      } else {
        // Ajout
        const newDish = {
          ...dishForm.value,
          id: Date.now(),
          popular: false,
          isNew: true
        }
        dishes.value.push(newDish)
      }
      
      saveMenuToStorage()
      closeModal()
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      resetForm()
    }

    const exportMenu = () => {
      const menuData = JSON.stringify(dishes.value, null, 2)
      const blob = new Blob([menuData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'menu-restaurant.json'
      a.click()
      URL.revokeObjectURL(url)
    }

    const importMenu = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            try {
              const importedMenu = JSON.parse(e.target.result)
              dishes.value = importedMenu
              saveMenuToStorage()
            } catch (err) {
              alert('Erreur lors de l\'import du menu')
            }
          }
          reader.readAsText(file)
        }
      }
      input.click()
    }

    const getCategoryLabel = (category) => {
      const labels = {
        entrees: 'Entrées',
        plats: 'Plats principaux',
        desserts: 'Desserts',
        boissons: 'Boissons'
      }
      return labels[category] || category
    }

    const logout = () => {
      localStorage.removeItem('restaurantLoggedIn')
      localStorage.removeItem('currentRestaurant')
      window.location.href = '/restaurant-login'
    }

    onMounted(() => {
      loadMenu()
    })

    return {
      dishes,
      loading,
      searchQuery,
      selectedCategory,
      sortBy,
      showAddModal,
      showEditModal,
      showDeleteModal,
      dishToDelete,
      dishForm,
      filteredDishes,
      totalDishes,
      averagePrice,
      popularDishes,
      newDishes,
      editDish,
      deleteDish,
      confirmDelete,
      saveDish,
      closeModal,
      exportMenu,
      importMenu,
      getCategoryLabel,
      logout
    }
  }
}
</script>

<style scoped>
.restaurant-menu {
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 80px; /* Espace pour la barre de navigation fixe */
}



.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0 40px;
  text-align: center;
  margin-top: 80px; /* Adjust for fixed nav */
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

.actions-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.actions-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-icon {
  font-size: 1.1rem;
}

.filters-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.filters-row {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-group {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-group {
  min-width: 150px;
}

.filter-select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.menu-stats {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #5a6c7d;
}

.dishes-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.dish-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.dish-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.dish-image {
  position: relative;
  height: 200px;
  background: #f8f9fa;
  overflow: hidden;
}

.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dish-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dish-card:hover .dish-overlay {
  opacity: 1;
}

.edit-btn,
.delete-btn {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #28a745;
  color: white;
}

.delete-btn:hover {
  background: #dc3545;
  color: white;
}

.dish-content {
  padding: 20px;
}

.dish-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.dish-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.dish-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
  margin-left: 10px;
}

.dish-description {
  color: #5a6c7d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 15px;
}

.dish-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.dish-category {
  background: #e9ecef;
  color: #2c3e50;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.dish-status {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.dish-status.available {
  background: #d4edda;
  color: #155724;
}

.dish-status.unavailable {
  background: #f8d7da;
  color: #721c24;
}

.dish-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.7rem;
  padding: 3px 6px;
  border-radius: 3px;
  font-weight: 600;
}

.tag.vegetarian {
  background: #d4edda;
  color: #155724;
}

.tag.gluten-free {
  background: #fff3cd;
  color: #856404;
}

.tag.spicy {
  background: #f8d7da;
  color: #721c24;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #5a6c7d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.empty-state p {
  margin-bottom: 30px;
}

/* Modal styles */
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 25px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 25px;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #5a6c7d;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.dish-form {
  padding: 0 25px 25px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-options {
  margin-bottom: 25px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e50;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.delete-modal {
  max-width: 400px;
}

.modal-body {
  padding: 0 25px 25px;
}

.modal-body p {
  color: #5a6c7d;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding: 0 25px 25px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .actions-row {
    flex-direction: column;
  }
  
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-group {
    min-width: auto;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dishes-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 40px 0 30px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .dish-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .dish-price {
    margin-left: 0;
  }
  
  .dish-meta {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
