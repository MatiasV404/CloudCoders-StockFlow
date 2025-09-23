<template>
  <div class="flex min-h-screen bg-gray-50 overflow-x-hidden">
    <!-- Overlay para móvil -->
    <div 
      v-if="isMobile && !sidebarCollapsed" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <Sidebar :is-mobile="isMobile" />

    <!-- Contenido principal -->
    <main class="flex-1 transition-all duration-300 min-w-0 lg:ml-0" :class="{ 'ml-0': sidebarCollapsed || isMobile }">
      <!-- Header responsivo -->
      <header class="bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5 shadow-sm flex items-center justify-between border-b border-gray-200">
        <div class="flex items-center gap-4">
          <!-- Botón hamburger solo para móvil -->
          <button 
            v-if="isMobile"
            @click="toggleSidebar"
            class="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
            :title="sidebarCollapsed ? 'Abrir menú' : 'Cerrar menú'"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
          </button>
          
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 m-0 truncate">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <button 
            @click="logout" 
            class="flex items-center gap-2 bg-red-600 text-white border-0 px-3 py-2 rounded-lg font-medium cursor-pointer transition-colors hover:bg-red-700 text-sm"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.59L17,17L22,12L17,7M4,5H12V3H4C2.89,3 2,3.89 2,5V19A2,2 0 0,0 4,21H12V19H4V5Z" />
            </svg>
            <span class="hidden sm:inline">Cerrar Sesión</span>
            <span class="sm:hidden">Salir</span>
          </button>
        </div>
      </header>

      <!-- Contenido de la página con padding responsivo -->
      <div class="p-4 sm:p-6 lg:p-8 w-full">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, provide, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import Sidebar from './Sidebar.vue'

const { logout } = useAuth()
const route = useRoute()

// Estado del sidebar y móvil
const sidebarCollapsed = ref(true) // Empieza cerrado en móvil
const isMobile = ref(false)

// Función para detectar móvil
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024 // lg breakpoint de Tailwind
  if (isMobile.value) {
    sidebarCollapsed.value = true // Fuerza cerrado en móvil
  }
}

// Función para toggle
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Función para cerrar sidebar (overlay click)
const closeSidebar = () => {
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
}

// Event listeners
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Provide para compartir estado y funciones
provide('sidebarCollapsed', sidebarCollapsed)
provide('toggleSidebar', toggleSidebar)
provide('isMobile', isMobile)

// Computed para título de página
const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Dashboard',
    inventory: 'Inventario',
    products: 'Productos',
    reports: 'Reportes',
    settings: 'Configuración'
  }
  
  const routeName = route.name?.toLowerCase() || 'dashboard'
  return titles[routeName] || 'Dashboard'
})
</script>