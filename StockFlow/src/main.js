import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router.js'
import './firebase/firebase.js'
import AOS from 'aos'

AOS.init();

const app = createApp(App)
app.use(router)
app.mount('#app')