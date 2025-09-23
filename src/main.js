import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router.js'
import './firebase/firebase.js'
import AOS from 'aos'
import 'aos/dist/aos.css'

AOS.init({
  duration: 600,
  easing: 'ease-in-out',
  once: true,
  offset: 50
})

const app = createApp(App)
app.use(router)
app.mount('#app')