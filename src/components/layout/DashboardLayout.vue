<template>
  <div class="flex min-h-screen bg-gray-50 overflow-x-hidden">
    <div 
      v-if="isMobile && !sidebarCollapsed" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
      @click="closeSidebar"
    ></div>

    <Sidebar :is-mobile="isMobile" />

    <main 
      class="flex-1 transition-all duration-300 min-w-0"
      :class="{
        'lg:ml-[280px]': !sidebarCollapsed && !isMobile,
        'lg:ml-[80px]': sidebarCollapsed && !isMobile,
        'ml-0': isMobile
      }"
    >
      <header class="bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5 shadow-sm flex items-center justify-between border-b border-gray-200">
        <div class="flex items-center gap-4">
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
            class="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
            </svg>
            <span class="hidden sm:inline">{{ loggingOut ? 'Saliendo...' : 'Cerrar Sesión' }}</span>
          </button>
        </div>
      </header>

      <div class="p-4 sm:p-6 lg:p-8 w-full">
        <slot />
      </div>
    </main>

    <ConfirmModal
      :show="showLogoutModal"
      type="warning"
      title="¿Cerrar sesión?"
      message="¿Estás seguro de que quieres cerrar sesión?"
      confirmText="Cerrar sesión"
      cancelText="Cancelar"
      :confirmClass="'bg-red-600 hover:bg-red-700 focus:ring-red-500'"
      :loading="loggingOut"
      @confirm="confirmLogout"
      @cancel="showLogoutModal = false"
    />

    <Toast
      :show="showErrorToast"
      type="error"
      title="Error al cerrar sesión"
      message="La página se recargará automáticamente"
      :duration="3000"
      position="bottom-right"
      @close="showErrorToast = false"
    />
  </div>
</template>

<script setup>
import { ref, provide, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import Sidebar from './Sidebar.vue'
import ConfirmModal from '../common/ConfirmModal.vue'
import Toast from '../common/Toast.vue'

const { logout } = useAuth()
const route = useRoute()

const sidebarCollapsed = ref(true)
const isMobile = ref(false)
const loggingOut = ref(false)
const showLogoutModal = ref(false)
const showErrorToast = ref(false)

const confirmLogout = async () => {
  try {
    loggingOut.value = true
    await logout()
  } catch (err) {
    console.error('Error en logout desde layout:', err)
    
    showErrorToast.value = true
    
    setTimeout(() => {
      window.location.href = '/login'
    }, 3000)
  } finally {
    loggingOut.value = false
    showLogoutModal.value = false
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

provide('sidebarCollapsed', sidebarCollapsed)
provide('toggleSidebar', toggleSidebar)
provide('isMobile', isMobile)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/inventory': 'Inventario',
    '/cyclic-count': 'Conteo Cíclico',
    '/movements': 'Historial de Movimientos'
  }
  return titles[route.path] || 'StockFlow'
})
</script>