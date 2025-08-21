<template>
  <div class="language-selector">
    <div class="language-dropdown" @click="toggleDropdown" ref="dropdown">
      <div class="current-language">
        <span class="flag">{{ currentLanguage.flag }}</span>
        <span class="name">{{ currentLanguage.name }}</span>
        <span class="arrow" :class="{ 'rotated': isOpen }">▼</span>
      </div>
      
      <div v-if="isOpen" class="language-options" @click.stop>
        <div
          v-for="language in supportedLanguages"
          :key="language.code"
          class="language-option"
          :class="{ 'active': language.code === currentLanguage.code }"
          @click="changeLanguage(language.code)"
        >
          <span class="flag">{{ language.flag }}</span>
          <span class="name">{{ language.name }}</span>
          <span v-if="language.code === currentLanguage.code" class="check">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { changeLanguage, getCurrentLanguage, getSupportedLanguages } from '../i18n/index.js'

export default {
  name: 'LanguageSelector',
  setup() {
    const { t } = useI18n()
    const isOpen = ref(false)
    const dropdown = ref(null)

    const supportedLanguages = getSupportedLanguages()
    const currentLanguage = computed(() => {
      const currentCode = getCurrentLanguage()
      return supportedLanguages.find(lang => lang.code === currentCode) || supportedLanguages[0]
    })

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    const changeLanguageHandler = async (languageCode) => {
      try {
        await changeLanguage(languageCode)
        isOpen.value = false
      } catch (error) {
        console.error('Erreur lors du changement de langue:', error)
      }
    }

    // Fermer le dropdown en cliquant à l'extérieur
    const handleClickOutside = (event) => {
      if (dropdown.value && !dropdown.value.contains(event.target)) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isOpen,
      dropdown,
      currentLanguage,
      supportedLanguages,
      toggleDropdown,
      changeLanguage: changeLanguageHandler,
      t
    }
  }
}
</script>

<style scoped>
.language-selector {
  position: relative;
}

.language-dropdown {
  cursor: pointer;
  user-select: none;
}

.current-language {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: all 0.3s;
  min-width: 120px;
}

.current-language:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.flag {
  font-size: 1.2rem;
}

.name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  flex: 1;
}

.arrow {
  font-size: 0.8rem;
  color: #666;
  transition: transform 0.3s;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.language-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 0.25rem;
  overflow: hidden;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.language-option:hover {
  background: #f8f9fa;
}

.language-option.active {
  background: #e3f2fd;
  color: #1976d2;
}

.language-option .flag {
  font-size: 1.1rem;
}

.language-option .name {
  font-size: 0.9rem;
  font-weight: 500;
  flex: 1;
}

.language-option .check {
  color: #1976d2;
  font-weight: bold;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .current-language {
    min-width: 100px;
    padding: 0.4rem 0.6rem;
  }
  
  .name {
    font-size: 0.8rem;
  }
  
  .language-options {
    min-width: 120px;
  }
}
</style>
