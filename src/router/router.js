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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    unsubscribe()
    
    if (to.meta.requiresGuest) {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          
          if (!userDoc.exists()) {
            next('/setup')
            return
          }

          const userRole = userDoc.data().role
          
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
        next()
      }
      return
    }

    if (to.meta.requiresAuth) {
      if (!user) {
        next('/login')
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        
        if (!userDoc.exists()) {
          if (to.path !== '/setup') {
            next('/setup')
          } else {
            next()
          }
          return
        }

        const userRole = userDoc.data().role
        const requiredRoles = to.meta.requiresRole

        if (requiredRoles && !requiredRoles.includes(userRole)) {
          
          if (userRole === 'operator') {
            next('/inventory')
          } else {
            next('/dashboard')
          }
          return
        }
        next()
      } catch (err) {
        console.error('❌ Error verificando permisos:', err)
        next('/login')
      }
    } else {
      next()
    }
  })
})

export default router