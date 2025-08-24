import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import notificationService from './services/notificationService.js'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')

// Initialiser les rappels automatiques au démarrage
notificationService.scheduleAllReminders()
