import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from '../firebase/firebase.js'
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
      requiresRole: ['admin']
    }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/inventory/InventoryView.vue'),
    meta: { 
      requiresAuth: true,
      requiresRole: ['admin', 'operator']
    }
  },
  // Recuento Cíclico
  {
    path: '/cyclic-count',
    name: 'CyclicCount',
    component: () => import('../views/inventory/CyclicCountView.vue'),
    meta: { 
      requiresAuth: true,
      requiresRole: ['admin', 'operator']
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    // Si ya hay usuario autenticado, resolverlo inmediatamente
    if (auth.currentUser) {
      resolve(auth.currentUser)
      return
    }

    // Si no, esperar el evento de auth
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        unsubscribe()
        resolve(user)
      },
      (error) => {
        unsubscribe()
        reject(error)
      }
    )
  })
}

router.beforeEach(async (to, from, next) => {
  // Evitar bucles infinitos: Si ya estamos en la ruta destino, permitir
  if (to.path === from.path) {
    return next()
  }

  try {
    // Obtener usuario actual UNA SOLA VEZ
    const user = await getCurrentUser()

    if (to.meta.requiresGuest) {
      if (user) {
        
        // Verificar perfil
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        
        if (!userDoc.exists()) {
          return next('/setup')
        }

        const userRole = userDoc.data().role
        
        // Redirigir según rol
        const redirectTo = userRole === 'operator' ? '/inventory' : '/dashboard'
        return next(redirectTo)
      } else {
        return next()
      }
    }

    if (to.meta.requiresAuth) {
      if (!user) {
        return next('/login')
      }

      // Verificar perfil
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (!userDoc.exists()) {
        // Sin perfil
        if (to.path !== '/setup') {
          return next('/setup')
        }
        return next()
      }

      // Con perfil, verificar roles
      const userRole = userDoc.data().role
      const requiredRoles = to.meta.requiresRole

      if (requiredRoles && !requiredRoles.includes(userRole)) {
        
        // Redirigir según rol
        const redirectTo = userRole === 'operator' ? '/inventory' : '/dashboard'
        return next(redirectTo)
      }

      return next()
    }
    
    return next()

  } catch (error) {
    console.error('❌ Error en router guard:', error)
    return next('/login')
  }
})

export default router