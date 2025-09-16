<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Header del sidebar -->
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">📦</div>
        <span v-show="!isCollapsed" class="logo-text">StockFlow</span>
      </div>
      <button @click="toggleSidebar" class="toggle-btn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
        </svg>
      </button>
    </div>

    <!-- Navegación -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link" active-class="active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
            </svg>
            <span v-show="!isCollapsed" class="nav-text">Dashboard</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/inventory" class="nav-link" active-class="active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            <span v-show="!isCollapsed" class="nav-text">Inventario</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/products" class="nav-link" active-class="active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
            </svg>
            <span v-show="!isCollapsed" class="nav-text">Productos</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/reports" class="nav-link" active-class="active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
            </svg>
            <span v-show="!isCollapsed" class="nav-text">Reportes</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/settings" class="nav-link" active-class="active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
            </svg>
            <span v-show="!isCollapsed" class="nav-text">Configuración</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer del sidebar -->
    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="user-avatar">{{ userInitials }}</div>
        <div v-show="!isCollapsed" class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-email">{{ userEmail }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useAuth } from '../../composables/useAuth.js'

const { user } = useAuth()

// Props e inject para el estado de colapso
const isCollapsed = inject('sidebarCollapsed', ref(false))

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
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
.sidebar {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(135deg, #4285f4 0%, #3367d6 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 1.8rem;
  min-width: 32px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 36px;
  height: 36px;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toggle-btn svg {
  width: 20px;
  height: 20px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: white;
}

.nav-icon {
  width: 24px;
  height: 24px;
  min-width: 24px;
}

.nav-text {
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  min-width: 40px;
}

.user-info {
  overflow: hidden;
}

.user-name {
  display: block;
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  display: block;
  font-size: 0.75rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsivo */
@media (max-width: 768px) {
  .sidebar {
    width: 280px;
    position: fixed;
    left: -280px;
    z-index: 1000;
    transition: left 0.3s ease;
  }
  
  .sidebar.collapsed {
    left: -280px;
    width: 280px;
  }
  
  .sidebar.mobile-open {
    left: 0;
  }
}
</style>