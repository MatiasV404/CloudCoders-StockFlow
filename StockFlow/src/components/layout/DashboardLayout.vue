<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenido principal -->
    <main class="flex-1 transition-all duration-300 min-w-0">
      <!-- Header -->
      <header class="bg-white px-8 py-5 shadow-sm flex justify-between items-center border-b border-gray-200">
        <div class="flex items-center gap-4">
          <h1 class="text-3xl font-semibold text-gray-800 m-0">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-4">
          <button 
            @click="logout" 
            class="flex items-center gap-2 bg-red-600 text-white border-0 px-4 py-2.5 rounded-lg font-medium cursor-pointer transition-colors hover:bg-red-700"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.59L17,17L22,12L17,7M4,5H12V3H4C2.89,3 2,3.89 2,5V19A2,2 0 0,0 4,21H12V19H4V5Z" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- Contenido de la página -->
      <div class="p-8 max-w-6xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import Sidebar from './Sidebar.vue'

const { logout } = useAuth()
const route = useRoute()

// Estado del sidebar
const sidebarCollapsed = ref(false)

// Provide para compartir estado con Sidebar
provide('sidebarCollapsed', sidebarCollapsed)

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