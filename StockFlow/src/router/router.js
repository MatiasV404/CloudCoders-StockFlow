import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticación mejorado
router.beforeEach((to, from, next) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe() // Desuscribirse inmediatamente
    
    if (to.meta.requiresAuth && !user) {
      next('/login')
    } else if (to.meta.requiresGuest && user) {
      next('/dashboard')
    } else {
      next()
    }
  })
})

export default router