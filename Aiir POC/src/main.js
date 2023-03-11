import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vueInternetChecker from 'vue-internet-checker'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('vueInternetChecker', vueInternetChecker)
app.mount('#app')
