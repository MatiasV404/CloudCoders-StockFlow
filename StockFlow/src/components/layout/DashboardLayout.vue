<template>
  <div class="dashboard-layout">
    <!-- Overlay para móvil -->
    <div 
      v-if="isMobile && !sidebarCollapsed" 
      class="mobile-overlay"
      @click="sidebarCollapsed = true"
    ></div>

    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenido principal -->
    <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Header -->
      <header class="content-header">
        <div class="header-left">
          <button 
            v-if="isMobile" 
            @click="toggleSidebar" 
            class="mobile-menu-btn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
          </button>
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>

        <div class="header-right">
          <button @click="logout" class="btn-logout">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.59L17,17L22,12L17,7M4,5H12V3H4C2.89,3 2,3.89 2,5V19A2,2 0 0,0 4,21H12V19H4V5Z" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- Contenido de la página -->
      <div class="page-content">
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

// Estado responsivo
const isMobile = ref(false)
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

// Funciones
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.main-content {
  flex: 1;
  transition: margin-left 0.3s ease;
  min-width: 0;
}

.main-content.sidebar-collapsed {
  margin-left: 0;
}

.content-header {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #4285f4;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.mobile-menu-btn:hover {
  background: #f0f2f5;
}

.mobile-menu-btn svg {
  width: 24px;
  height: 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background: #c82333;
}

.btn-logout svg {
  width: 18px;
  height: 18px;
}

.page-content {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }
  
  .content-header {
    padding: 16px 20px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-content {
    padding: 20px;
  }
  
  .btn-logout span {
    display: none;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: 16px;
  }
  
  .content-header {
    padding: 12px 16px;
  }
}
</style>