<template>
  <div v-if="authInitialized">
    <router-view />
  </div>
  <div v-else class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-white text-lg font-medium">Cargando StockFlow...</p>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useAuth } from './composables/useAuth.js'

const { authInitialized } = useAuth()

// Log cuando la autenticación esté lista
watch(authInitialized, (initialized) => {
  if (initialized) {
    console.log('✅ Autenticación inicializada')
  }
})
</script>

<style>
/* Estilos globales se mantienen en style.css */
</style>