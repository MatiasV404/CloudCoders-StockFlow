<template>
  <aside
    class="sidebar bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col transition-all duration-300 shadow-lg z-50"
    :class="[
      isMobile ? 'sidebar-mobile' : 'sidebar-desktop',
      { 'sidebar-collapsed': isCollapsed }
    ]">

    <!-- Header del sidebar -->
    <div class="p-5 flex items-center justify-between border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="text-3xl w-8 flex-shrink-0" v-if="!isCollapsed">📦</div>
        <span v-show="!isCollapsed"
          class="text-xl font-semibold whitespace-nowrap transition-opacity duration-300">StockFlow</span>
      </div>

      <button v-if="!isMobile || !isCollapsed" @click="handleToggle"
        class="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
        :title="isCollapsed ? 'Expandir menú' : 'Contraer menú'">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path v-if="isCollapsed" d="M10,17L15,12L10,7V17Z" />
          <path v-else d="M15,17L10,12L15,7V17Z" />
        </svg>
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-5">
      <ul class="space-y-2 px-3">
        <!-- Dashboard -->
        <li v-if="canViewDashboard">
          <router-link to="/dashboard"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-white no-underline hover:bg-white/10 group relative"
            :class="{ 'justify-center': !isMobile && isCollapsed }" @click="handleLinkClick"
            active-class="bg-white/20 font-semibold">
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="whitespace-nowrap">Dashboard</span>
            <div v-if="!isMobile && isCollapsed"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Dashboard
            </div>
          </router-link>
        </li>

        <!-- Inventario -->
        <li v-if="canManageProducts">
          <router-link to="/inventory"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-white no-underline hover:bg-white/10 group relative"
            :class="{ 'justify-center': !isMobile && isCollapsed }" @click="handleLinkClick"
            active-class="bg-white/20 font-semibold">
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="whitespace-nowrap">Inventario</span>
            <div v-if="!isMobile && isCollapsed"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Inventario
            </div>
          </router-link>
        </li>

        <!-- Conteo Cíclico -->
        <li v-if="canManageProducts">
          <router-link to="/cyclic-count"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-white no-underline hover:bg-white/10 group relative overflow-hidden"
            :class="{ 'justify-center': !isMobile && isCollapsed }" @click="handleLinkClick"
            active-class="bg-white/20 font-semibold">
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="whitespace-nowrap">Conteo Cíclico</span>
            <div v-if="!isMobile && isCollapsed"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Conteo Cíclico
            </div>
          </router-link>
        </li>

        <!-- Historial -->
        <li v-if="canViewDashboard">
          <router-link to="/movements"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-white no-underline hover:bg-white/10 group relative"
            :class="{ 'justify-center': !isMobile && isCollapsed }" @click="handleLinkClick"
            active-class="bg-white/20 font-semibold">
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" />
            </svg>
            <span v-show="!isCollapsed || isMobile" class="whitespace-nowrap">Historial</span>
            <div v-if="!isMobile && isCollapsed"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              Historial
            </div>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <!-- Footer del sidebar -->
    <div class="p-5 border-t border-white/10 space-y-3">
      <div v-show="!isCollapsed || isMobile" class="space-y-2">
        <!-- Badge de Rol -->
        <div class="flex items-center justify-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
            :class="roleClass">
            <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path v-if="userRole === 'admin'"
                d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0,0,1 15,8A3,3 0,0,1 12,11A3,3 0,0,1 9,8A3,3 0,0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z" />
              <path v-else
                d="M12,4A4,4 0,0,1 16,8A4,4 0,0,1 12,12A4,4 0,0,1 8,8A4,4 0,0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <span>{{ roleLabel }}</span>
          </span>
        </div>

        <!-- Badge de Código de Proyecto -->
        <div v-if="projectCode" class="flex items-center justify-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L12,15H9V10L7,14H10V19Z" />
            </svg>
            <span class="font-mono tracking-wider">{{ projectCode }}</span>

            <!-- Botón copiar -->
            <button @click="copyProjectCode" class="hover:bg-indigo-200 p-0.5 rounded transition-colors"
              title="Copiar código">
              <svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <!-- Info del Usuario -->
      <div class="flex items-center gap-3 pt-2">
        <div
          class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold text-lg flex-shrink-0">
          {{ userInitials }}
        </div>
        <div v-show="!isCollapsed || isMobile" class="overflow-hidden flex-1">
          <span class="block font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">{{ userName }}</span>
          <span class="block text-xs opacity-70 whitespace-nowrap overflow-hidden text-ellipsis">{{ userEmail }}</span>
        </div>
      </div>
    </div>

    <Toast :show="showCopyToast" type="success" title="¡Código copiado!"
      message="El código del proyecto se copió al portapapeles" :duration="2000" position="bottom-center"
      @close="showCopyToast = false" />
  </aside>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useAuth } from '../../composables/useAuth.js'
import Toast from '../common/Toast.vue'

const { user, userProfile, permissions } = useAuth()

const isCollapsed = inject('sidebarCollapsed', ref(false))
const toggleSidebar = inject('toggleSidebar', () => { })
const isMobile = inject('isMobile', ref(false))

// Estado para toast
const showCopyToast = ref(false)

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

// Rol
const userRole = computed(() => userProfile.value?.role || '')

const roleLabel = computed(() => {
  const labels = {
    'admin': 'Administrador',
    'operator': 'Operario'
  }
  return labels[userProfile.value?.role] || 'Usuario'
})

const roleClass = computed(() => {
  const classes = {
    'admin': 'bg-blue-100 text-blue-800 border border-blue-200',
    'operator': 'bg-purple-100 text-purple-800 border border-purple-200'
  }
  return classes[userProfile.value?.role] || 'bg-gray-100 text-gray-800 border border-gray-200'
})

// Código de proyecto
const projectCode = computed(() => userProfile.value?.projectCode || '')

// Copiar código
const copyProjectCode = async () => {
  try {
    await navigator.clipboard.writeText(projectCode.value)
    showCopyToast.value = true
  } catch (err) {
    console.error('Error copiando código:', err)
  }
}
</script>

<style scoped>
/* Estilos para desktop */
.sidebar-desktop {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  transition: width 0.3s ease;
  overflow-x: hidden;
  overflow-y: auto;
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
  html,
  body {
    overflow-x: hidden;
  }
}
</style>