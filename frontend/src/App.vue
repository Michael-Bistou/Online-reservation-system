<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    </div>
</template>

<style>
/* Import des polices Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

/* Reset et variables CSS globales */
:root {
  /* Palette élégante inspirée de la gastronomie */
  --primary-color: #c8a27d; /* Or chaud sophistiqué */
  --primary-hover: #b8946a; /* Or plus foncé au hover */
  --primary-light: #e6d4b8; /* Or clair pour les accents */
  --primary-dark: #8b7355; /* Or foncé pour les contrastes */
  
  /* Couleurs secondaires élégantes */
  --secondary-color: #2d1810; /* Brun chaud profond */
  --secondary-light: #4a2c1a; /* Brun plus clair */
  --accent-color: #d2691e; /* Orange chaud pour les accents */
  
  /* Couleurs de statut raffinées */
  --success-color: #c8a27d; /* Or doré pour le succès */
  --success-light: #e6d4b8; /* Or clair pour le succès */
  --warning-color: #d4af37; /* Or pour les avertissements */
  --error-color: #8b0000; /* Rouge foncé sophistiqué */
  
  /* Couleurs de fond sophistiquées */
  --background-color: #0a0a0a; /* Noir profond */
  --surface-color: #1a1a1a; /* Gris très foncé */
  --surface-light: #2a2a2a; /* Gris plus clair */
  --surface-dark: #0f0f0f; /* Noir plus clair */
  
  /* Couleurs de texte élégantes */
  --text-primary: #f5f5f5; /* Blanc cassé */
  --text-secondary: #b8b8b8; /* Gris clair */
  --text-muted: #8a8a8a; /* Gris moyen */
  --text-gold: #d4af37; /* Or pour les accents de texte */
  
  /* Bordures et ombres raffinées */
  --border-color: #333333; /* Gris foncé */
  --border-light: #4a4a4a; /* Gris plus clair */
  --border-gold: #c8a27d; /* Bordure dorée */
  
  /* Ombres sophistiquées */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
  --shadow-gold: 0 4px 12px rgba(200, 162, 125, 0.3);
  
  /* Effets de transparence */
  --overlay-dark: rgba(10, 10, 10, 0.8);
  --overlay-gold: rgba(200, 162, 125, 0.1);
  
  /* Autres variables */
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Suppression complète des outlines bleus/verts par défaut */
*:focus {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

*:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* Suppression pour tous les éléments interactifs */
a:focus,
a:focus-visible,
button:focus,
button:focus-visible,
input:focus,
input:focus-visible,
textarea:focus,
textarea:focus-visible,
select:focus,
select:focus-visible,
.router-link-active:focus,
.router-link-active:focus-visible,
.router-link-exact-active:focus,
.router-link-exact-active:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* Suppression des outlines sur tous les éléments interactifs */
button:focus,
a:focus,
input:focus,
textarea:focus,
select:focus,
.router-link-active:focus,
.nav-link:focus,
.nav-logo:focus,
.user-link:focus,
.nav-toggle:focus,
.hero-btn:focus,
.feature-link:focus,
.cta-btn:focus,
.current-language:focus,
.language-option:focus,
.btn:focus,
.btn-outline:focus,
.btn-primary:focus,
.btn-secondary:focus {
  outline: none !important;
  box-shadow: none !important;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible,
.router-link-active:focus-visible,
.nav-link:focus-visible,
.nav-logo:focus-visible,
.user-link:focus-visible,
.nav-toggle:focus-visible,
.hero-btn:focus-visible,
.feature-link:focus-visible,
.cta-btn:focus-visible,
.current-language:focus-visible,
.language-option:focus-visible,
.btn:focus-visible,
.btn-outline:focus-visible,
.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* Suppression des outlines sur les éléments Vue Router */
.router-link-active,
.router-link-exact-active,
.router-link-active:focus,
.router-link-exact-active:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* Suppression des outlines sur les éléments de navigation */
.nav-logo,
.nav-link,
.user-link,
.nav-toggle,
.nav-logo:focus,
.nav-link:focus,
.user-link:focus,
.nav-toggle:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* Suppression des outlines sur les boutons */
.btn,
.hero-btn,
.cta-btn,
.btn:focus,
.hero-btn:focus,
.cta-btn:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* Suppression des outlines sur les liens */
.feature-link,
.current-language,
.language-option,
.feature-link:focus,
.current-language:focus,
.language-option:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* Suppression spécifique pour tous les éléments de navigation */
nav *:focus,
nav *:focus-visible,
header *:focus,
header *:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* Suppression pour tous les liens et boutons */
a:focus,
a:focus-visible,
button:focus,
button:focus-visible,
.btn:focus,
.btn:focus-visible,
.btn-outline:focus,
.btn-outline:focus-visible,
.btn-primary:focus,
.btn-primary:focus-visible,
.btn-secondary:focus,
.btn-secondary:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* Suppression spécifique pour la navigation */
.nav-logo:focus,
.nav-logo:focus-visible,
.nav-link:focus,
.nav-link:focus-visible,
.nav-toggle:focus,
.nav-toggle:focus-visible,
.user-link:focus,
.user-link:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* Suppression pour tous les éléments de navigation */
nav a:focus,
nav a:focus-visible,
nav button:focus,
nav button:focus-visible,
header a:focus,
header a:focus-visible,
header button:focus,
header button:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* Suppression radicale pour tous les éléments */
*:focus {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

*:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* Suppression spécifique pour les éléments de navigation */
.nav-logo,
.nav-link,
.nav-toggle,
.user-link,
.btn,
.btn-outline,
.btn-primary,
.btn-secondary {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.nav-logo:focus,
.nav-logo:focus-visible,
.nav-link:focus,
.nav-link:focus-visible,
.nav-toggle:focus,
.nav-toggle:focus-visible,
.user-link:focus,
.user-link:focus-visible,
.btn:focus,
.btn:focus-visible,
.btn-outline:focus,
.btn-outline:focus-visible,
.btn-primary:focus,
.btn-primary:focus-visible,
.btn-secondary:focus,
.btn-secondary:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--background-color);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.main-content {
  flex: 1;
  padding: 0;
  width: 100%;
  max-width: 100%;
}

/* Conteneurs */
.container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0 2rem;
}

.container-sm {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0 2rem;
}

.container-lg {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0 2rem;
}

/* Grille responsive */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Cartes */
.card {
  background: var(--surface-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  background-color: var(--background-color);
}

/* Boutons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  gap: 0.5rem;
  min-height: 44px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--secondary-color);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #475569;
}

.btn-outline {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-outline:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--background-color);
  color: var(--text-primary);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  min-height: 36px;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
  min-height: 52px;
}

/* Formulaires */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);
  background: var(--surface-color);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
}

.form-input.error {
  border-color: var(--error-color);
}

.form-error {
  color: var(--error-color);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-help {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Alertes */
.alert {
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.alert-success {
  background: rgba(200, 162, 125, 0.1);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.alert-warning {
  background: rgba(212, 175, 55, 0.1);
  color: var(--warning-color);
  border-color: var(--warning-color);
}

.alert-error {
  background: rgba(139, 0, 0, 0.1);
  color: var(--error-color);
  border-color: var(--error-color);
}

.alert-info {
  background: rgba(200, 162, 125, 0.1);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-primary {
  background: var(--primary-color);
  color: white;
}

.badge-success {
  background: var(--success-color);
  color: white;
}

.badge-warning {
  background: var(--warning-color);
  color: white;
}

.badge-error {
  background: var(--error-color);
  color: white;
}

/* Utilitaires */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-primary { color: var(--primary-color); }
.text-secondary { color: var(--text-secondary); }
.text-success { color: var(--success-color); }
.text-warning { color: var(--warning-color); }
.text-error { color: var(--error-color); }

.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }

.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }
  
  .container {
    padding: 0 0.75rem;
  }
}
</style>
