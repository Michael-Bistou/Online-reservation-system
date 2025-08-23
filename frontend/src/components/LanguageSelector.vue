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
  border-radius: 8px;
  background: var(--surface-color);
  border: 2px solid var(--primary-color);
  transition: all 0.3s;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(200, 162, 125, 0.2);
}

.current-language:hover {
  background: var(--primary-color);
  border-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(200, 162, 125, 0.3);
}

.flag {
  font-size: 1.2rem;
}

.name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-color);
  flex: 1;
  text-shadow: 0 0 8px var(--primary-color);
}

.arrow {
  font-size: 0.8rem;
  color: var(--primary-color);
  transition: transform 0.3s;
  font-weight: bold;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.language-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--surface-color);
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(200, 162, 125, 0.3);
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
  background: var(--primary-color);
  color: var(--surface-dark);
}

.language-option.active {
  background: var(--primary-color);
  color: var(--surface-dark);
  font-weight: bold;
}

.language-option .flag {
  font-size: 1.1rem;
}

.language-option .name {
  font-size: 0.9rem;
  font-weight: 600;
  flex: 1;
  color: var(--text-primary);
}

.language-option .check {
  color: var(--surface-dark);
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
