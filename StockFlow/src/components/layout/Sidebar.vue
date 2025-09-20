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
      
      <!-- Botón toggle - solo visible en desktop o cuando está expandido en móvil -->
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
        <li class="mb-1">
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
            
            <!-- Tooltip solo para desktop colapsado -->
            <div v-if="!isMobile && isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Dashboard
            </div>
          </router-link>
        </li>

        <li class="mb-1">
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

        <li class="mb-1">
          <router-link 
            to="/" 
            @click="handleLinkClick"
            class="group flex items-center gap-4 px-5 py-3 text-white/80 no-underline transition-all border-l-4 border-transparent hover:bg-white/10 hover:text-white relative"
            active-class="bg-white/15 text-white border-l-white"
          >
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="font-medium whitespace-nowrap transition-opacity duration-300">Productos</span>
            
            <div v-if="!isMobile && isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Productos
            </div>
          </router-link>
        </li>

        <li class="mb-1">
          <router-link 
            to="/" 
            @click="handleLinkClick"
            class="group flex items-center gap-4 px-5 py-3 text-white/80 no-underline transition-all border-l-4 border-transparent hover:bg-white/10 hover:text-white relative"
            active-class="bg-white/15 text-white border-l-white"
          >
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="font-medium whitespace-nowrap transition-opacity duration-300">Reportes</span>
            
            <div v-if="!isMobile && isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Reportes
            </div>
          </router-link>
        </li>

        <li class="mb-1">
          <router-link 
            to="/" 
            @click="handleLinkClick"
            class="group flex items-center gap-4 px-5 py-3 text-white/80 no-underline transition-all border-l-4 border-transparent hover:bg-white/10 hover:text-white relative"
            active-class="bg-white/15 text-white border-l-white"
          >
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="font-medium whitespace-nowrap transition-opacity duration-300">Configuración</span>
            
            <div v-if="!isMobile && isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Configuración
            </div>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer del sidebar -->
    <div class="p-5 border-t border-white/10">
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

const { user } = useAuth()

// Inject estado y funciones desde DashboardLayout
const isCollapsed = inject('sidebarCollapsed', ref(false))
const toggleSidebar = inject('toggleSidebar', () => {})
const isMobile = inject('isMobile', ref(false))

// Función local que usa la función inyectada
const handleToggle = () => {
  toggleSidebar()
}

// Función para manejar clics en links (cierra sidebar en móvil)
const handleLinkClick = () => {
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

// Computed para info del usuario
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