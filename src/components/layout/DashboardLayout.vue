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

        <div class="flex items-center gap-3">
          <button
            @click="showLogoutModal = true"
            :disabled="loggingOut"
            class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
            </svg>
            <span class="hidden sm:inline">{{ loggingOut ? 'Saliendo...' : 'Cerrar Sesión' }}</span>
            <span class="sm:hidden">{{ loggingOut ? '...' : 'Salir' }}</span>
          </button>
        </div>
      </header>

      <!-- Contenido de la página con padding responsivo -->
      <div class="p-4 sm:p-6 lg:p-8 w-full">
        <slot />
      </div>
    </main>

    <!-- Modal de Logout -->
    <ConfirmModal
      :show="showLogoutModal"
      type="warning"
      title="¿Cerrar sesión?"
      message="¿Estás seguro de que quieres cerrar sesión?"
      confirmText="Cerrar Sesión"
      cancelText="Cancelar"
      :confirmClass="'bg-red-600 hover:bg-red-700 focus:ring-red-500'"
      :loading="loggingOut"
      @confirm="confirmLogout"
      @cancel="showLogoutModal = false"
    />

    <!-- Toast de Error -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="showErrorToast"
        class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md z-50"
      >
        <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
        </svg>
        <div class="flex-1">
          <p class="font-semibold">Error al cerrar sesión</p>
          <p class="text-sm opacity-90">La página se recargará automáticamente</p>
        </div>
        <button @click="showErrorToast = false" class="hover:bg-red-600 p-1 rounded">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, provide, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import Sidebar from './Sidebar.vue'
import ConfirmModal from '../common/ConfirmModal.vue'

const { logout } = useAuth()
const route = useRoute()

// Estado del sidebar y móvil
const sidebarCollapsed = ref(true)
const isMobile = ref(false)
const loggingOut = ref(false)
const showLogoutModal = ref(false)
const showErrorToast = ref(false)

// FUNCIÓN DE LOGOUT MEJORADA
const confirmLogout = async () => {
  try {
    loggingOut.value = true
    await logout()
  } catch (err) {
    console.error('❌ Error en logout desde layout:', err)
    
    // Mostrar toast en vez de alert
    showErrorToast.value = true
    
    // Recargar después de 3 segundos
    setTimeout(() => {
      window.location.href = '/login'
    }, 3000)
  } finally {
    loggingOut.value = false
    showLogoutModal.value = false
  }
}

// Función para detectar móvil
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    sidebarCollapsed.value = true
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