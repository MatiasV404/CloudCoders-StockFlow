import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from '../firebase/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

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
    path: '/setup',
    name: 'Setup',
    component: () => import('../views/auth/SetupView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/DashboardView.vue'),
    meta: { 
      requiresAuth: true,
      requiresRole: ['admin', 'admin_operator']
    }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/inventory/InventoryView.vue'),
    meta: { 
      requiresAuth: true,
      requiresRole: ['admin_operator', 'operator']
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard mejorado con validación de roles
router.beforeEach((to, from, next) => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    unsubscribe()
    
    // Rutas públicas - MEJORADO
    if (to.meta.requiresGuest) {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          
          if (!userDoc.exists()) {
            next('/setup')
            return
          }

          // Redirigir según rol
          const userRole = userDoc.data().role
          if (userRole === 'operator') {
            next('/inventory')
          } else {
            next('/dashboard')
          }
        } catch (err) {
          console.error('Error verificando usuario:', err)
          next('/dashboard')
        }
      } else {
        next()
      }
      return
    }

    // Rutas protegidas
    if (to.meta.requiresAuth && !user) {
      next('/login')
      return
    }

    // Si hay usuario, verificar perfil y rol
    if (user && to.path !== '/setup') {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        
        // Si no tiene perfil, redirigir a setup
        if (!userDoc.exists()) {
          if (to.path !== '/setup') {
            next('/setup')
          } else {
            next()
          }
          return
        }

        // Verificar rol requerido
        const userRole = userDoc.data().role
        const requiredRoles = to.meta.requiresRole

        if (requiredRoles && !requiredRoles.includes(userRole)) {
          // Redirigir según rol
          if (userRole === 'operator') {
            next('/inventory')
          } else {
            next('/dashboard')
          }
          return
        }

        next()
      } catch (err) {
        console.error('Error verificando usuario:', err)
        next('/login')
      }
    } else {
      next()
    }
  })
})

export default router