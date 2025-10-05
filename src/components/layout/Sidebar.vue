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
        class="bg-white/10 border-0 text-white p-2 rounded-md cursor-pointer transition-all hover:bg-white/20 w-9 h-9 flex items-center justify-center hover:scale-110"
        :title="isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'"
      >
        <svg class="w-5 h-5 transition-transform duration-300" :class="{ 'rotate-180': isCollapsed }" viewBox="0 0 24 24" fill="currentColor">
          <path v-if="isMobile" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          <path v-else d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
        </svg>
      </button>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 py-5">
      <ul class="list-none p-0 m-0">
        <!-- Dashboard - Solo para admins -->
        <li v-if="canViewDashboard" class="mb-1">
          <router-link 
            to="/dashboard" 
            @click="handleLinkClick"
            class="group flex items-center gap-4 px-5 py-3 text-white/80 no-underline transition-all border-l-4 border-transparent hover:bg-white/10 hover:text-white relative"
            active-class="bg-white/15 text-white border-l-white"
          >
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="font-medium whitespace-nowrap transition-opacity duration-300">Dashboard</span>
            
            <div v-if="!isMobile && isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Dashboard
            </div>
          </router-link>
        </li>

        <!-- Inventario - Para todos -->
        <li v-if="canManageProducts" class="mb-1">
          <router-link 
            to="/inventory" 
            @click="handleLinkClick"
            class="group flex items-center gap-4 px-5 py-3 text-white/80 no-underline transition-all border-l-4 border-transparent hover:bg-white/10 hover:text-white relative"
            active-class="bg-white/15 text-white border-l-white"
          >
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V6A2,2 0 0,1 4,4Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="font-medium whitespace-nowrap transition-opacity duration-300">Inventario</span>
            
            <div v-if="!isMobile && isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Inventario
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
}

.sidebar-mobile.sidebar-collapsed {
  transform: translateX(-100%);
}

/* Prevenir scroll horizontal */
@media (max-width: 1023px) {
  html, body {
    overflow-x: hidden;
  }
}
</style>