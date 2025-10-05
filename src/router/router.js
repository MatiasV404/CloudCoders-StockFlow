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
      requiresRole: ['admin_operator', 'operator', 'admin']
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// MEJORADO: Guard con mejor manejo de estados
router.beforeEach((to, from, next) => {
  console.log(`🧭 Navegando de ${from.path} a ${to.path}`)
  
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    unsubscribe()
    
    console.log('🔐 Usuario actual:', user?.email || 'No autenticado')
    
    // Rutas públicas (requiresGuest)
    if (to.meta.requiresGuest) {
      if (user) {
        console.log('👉 Usuario autenticado intentando acceder a ruta pública')
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          
          if (!userDoc.exists()) {
            console.log('👉 Usuario sin perfil → /setup')
            next('/setup')
            return
          }

          const userRole = userDoc.data().role
          console.log('👉 Usuario con perfil, rol:', userRole)
          
          if (userRole === 'operator') {
            next('/inventory')
          } else {
            next('/dashboard')
          }
        } catch (err) {
          console.error('❌ Error verificando usuario:', err)
          next('/dashboard')
        }
      } else {
        console.log('✅ Permitir acceso a ruta pública')
        next()
      }
      return
    }

    // Rutas protegidas (requiresAuth)
    if (to.meta.requiresAuth) {
      if (!user) {
        console.log('👉 Ruta protegida sin autenticación → /login')
        next('/login')
        return
      }

      // Verificar perfil y rol
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        
        // Sin perfil → setup
        if (!userDoc.exists()) {
          if (to.path !== '/setup') {
            console.log('👉 Usuario sin perfil → /setup')
            next('/setup')
          } else {
            console.log('✅ Permitir acceso a /setup')
            next()
          }
          return
        }

        // Con perfil → verificar rol si es necesario
        const userRole = userDoc.data().role
        const requiredRoles = to.meta.requiresRole

        if (requiredRoles && !requiredRoles.includes(userRole)) {
          console.log(`❌ Rol ${userRole} no tiene acceso a ${to.path}`)
          
          // Redirigir según rol
          if (userRole === 'operator') {
            console.log('👉 Operario → /inventory')
            next('/inventory')
          } else {
            console.log('👉 Admin → /dashboard')
            next('/dashboard')
          }
          return
        }

        console.log('✅ Acceso permitido a', to.path)
        next()
      } catch (err) {
        console.error('❌ Error verificando permisos:', err)
        next('/login')
      }
    } else {
      // Ruta sin restricciones
      console.log('✅ Ruta sin restricciones')
      next()
    }
  })
})

export default router