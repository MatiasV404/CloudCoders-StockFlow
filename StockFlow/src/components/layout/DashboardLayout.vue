<script setup>
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import Sidebar from './Sidebar.vue'

const { logout } = useAuth()
const route = useRoute()

// Estado del sidebar
const sidebarCollapsed = ref(false)

// Función para toggle - ESTA ES LA FUNCIÓN PRINCIPAL
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Provide para compartir TANTO el estado como la función
provide('sidebarCollapsed', sidebarCollapsed)
provide('toggleSidebar', toggleSidebar)

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

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenido principal -->
    <main class="flex-1 transition-all duration-300 min-w-0">
      <!-- Header responsivo -->
      <header class="bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <!-- Botón para colapsar desde el header -->
          <button 
            @click="toggleSidebar"
            class="lg:hidden flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            :title="sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
          </button>
          
          <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800 m-0 truncate">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <button 
            @click="logout" 
            class="flex items-center gap-2 bg-red-600 text-white border-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium cursor-pointer transition-colors hover:bg-red-700 text-sm sm:text-base"
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