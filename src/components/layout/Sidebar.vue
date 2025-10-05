<template>
  <aside 
    class="sidebar bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col transition-all duration-300 shadow-lg z-50" 
    :class="[
      isMobile ? 'sidebar-mobile' : 'sidebar-desktop',
      { 'sidebar-collapsed': isCollapsed }
    ]"
  >
    
    <!-- Header del sidebar -->
    <div class="p-5 flex items-center justify-between border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="text-3xl w-8 flex-shrink-0" v-if="!isCollapsed">📦</div>
        <span v-show="!isCollapsed" class="text-xl font-semibold whitespace-nowrap transition-opacity duration-300">StockFlow</span>
      </div>
      
      <button 
        v-if="!isMobile || !isCollapsed"
        @click="handleToggle" 
        class="text-white hover:bg-white/10 p-2 rounded-lg transition-colors" 
        :title="isCollapsed ? 'Expandir menú' : 'Contraer menú'"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path v-if="isCollapsed" d="M10,17L15,12L10,7V17Z" />
          <path v-else d="M15,17L10,12L15,7V17Z" />
        </svg>
      </button>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-5">
      <ul class="space-y-2 px-3">
        <!-- Dashboard (solo admin) -->
        <li v-if="canViewDashboard">
          <router-link 
            to="/dashboard" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-white no-underline hover:bg-white/10 group relative"
            :class="{ 'justify-center': !isMobile && isCollapsed }"
            @click="handleLinkClick"
            active-class="bg-white/20 font-semibold"
          >
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="whitespace-nowrap">Dashboard</span>
            <div v-if="!isMobile && isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Dashboard
            </div>
          </router-link>
        </li>

        <!-- Inventario -->
        <li v-if="canManageProducts">
          <router-link 
            to="/inventory" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-white no-underline hover:bg-white/10 group relative"
            :class="{ 'justify-center': !isMobile && isCollapsed }"
            @click="handleLinkClick"
            active-class="bg-white/20 font-semibold"
          >
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="whitespace-nowrap">Inventario</span>
            <div v-if="!isMobile && isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Inventario
            </div>
          </router-link>
        </li>

        <li v-if="canManageProducts">
          <router-link 
            to="/cyclic-count" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-white no-underline hover:bg-white/10 group relative overflow-hidden"
            :class="{ 'justify-center': !isMobile && isCollapsed }"
            @click="handleLinkClick"
            active-class="bg-white/20 font-semibold"
          >
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
            </svg>
            
            <!-- ✅ WRAPPER con flex para controlar overflow -->
            <div v-show="!isCollapsed || isMobile" class="flex items-center gap-2 min-w-0">
              <span class="whitespace-nowrap">Recuento Cíclico</span>
              <!-- ✅ Badge solo cuando sidebar NO está colapsado en desktop -->
              <span v-if="!isCollapsed && !isMobile" class="text-xs bg-purple-500 px-2 py-0.5 rounded-full flex-shrink-0">Nuevo</span>
            </div>
            
            <div v-if="!isMobile && isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Recuento Cíclico
            </div>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer del sidebar -->
    <div class="p-5 border-t border-white/10">
      <!-- Badge de rol -->
      <div v-show="!isCollapsed || isMobile" class="mb-3">
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
          :class="roleClass">
          {{ roleLabel }}
        </span>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold text-lg flex-shrink-0">
          {{ userInitials }}
        </div>
        <div v-show="!isCollapsed || isMobile" class="overflow-hidden transition-opacity duration-300">
          <span class="block font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">{{ userName }}</span>
          <span class="block text-xs opacity-70 whitespace-nowrap overflow-hidden text-ellipsis">{{ userEmail }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useAuth } from '../../composables/useAuth.js'

const { user, userProfile, permissions } = useAuth()

const isCollapsed = inject('sidebarCollapsed', ref(false))
const toggleSidebar = inject('toggleSidebar', () => {})
const isMobile = inject('isMobile', ref(false))

const handleToggle = () => {
  toggleSidebar()
}

const handleLinkClick = () => {
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

// Permisos
const canViewDashboard = computed(() => permissions.value.viewDashboard)
const canManageProducts = computed(() => permissions.value.manageProducts)

// Info del usuario
const userName = computed(() => {
  if (user.value?.displayName) return user.value.displayName
  if (user.value?.email) return user.value.email.split('@')[0]
  return 'Usuario'
})

const userEmail = computed(() => user.value?.email || '')

const userInitials = computed(() => {
  const name = userName.value
  return name.charAt(0).toUpperCase()
})

// Badge de rol
const roleLabel = computed(() => {
  const labels = {
    'admin': 'Administrador',
    'operator': 'Operario'
  }
  return labels[userProfile.value?.role] || 'Usuario'
})

const roleClass = computed(() => {
  const classes = {
    'admin': 'bg-blue-100 text-blue-800',
    'operator': 'bg-purple-100 text-purple-800'
  }
  return classes[userProfile.value?.role] || 'bg-gray-100 text-gray-800'
})
</script>

<style scoped>
/* Estilos para desktop */
.sidebar-desktop {
  width: 280px;
  min-height: 100vh;
  position: relative;
  transition: width 0.3s ease;
  overflow-x: hidden;
}

.sidebar-desktop.sidebar-collapsed {
  width: 80px;
}

/* Estilos para móvil */
.sidebar-mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transform: translateX(0);
  transition: transform 0.3s ease;
  overflow-x: hidden;
  overflow-y: auto;
}

.sidebar-mobile.sidebar-collapsed {
  transform: translateX(-100%);
}

nav {
  overflow-x: hidden !important;
}

nav a {
  max-width: 100%;
}

@media (max-width: 1023px) {
  html, body {
    overflow-x: hidden;
  }
}
</style>