<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Bienvenido a StockFlow</h1>
      <div class="user-info">
        <span>{{ user?.email }}</span>
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </div>
    </header>
    
    <main class="dashboard-content">
      <p>¡Dashboard en construcción! 🚧</p>
    </main>
  </div>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth.js'

const { user, logout } = useAuth()
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.dashboard-header {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-logout {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.dashboard-content {
  padding: 40px 20px;
  text-align: center;
}
</style>