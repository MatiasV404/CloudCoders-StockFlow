<template>
  <DashboardLayout>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6" data-aos="fade-up">
      <!-- Card de bienvenida -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 sm:p-8 rounded-2xl mb-6 sm:mb-8 shadow-lg">
        <h2 class="m-0 mb-2 text-2xl sm:text-3xl font-semibold">¡Bienvenido a StockFlow! 👋</h2>
        <p class="m-0 opacity-90 text-base sm:text-lg">Gestiona tu inventario de manera eficiente</p>
      </div>

      <!-- Grid de estadísticas con datos reales -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8" data-aos="fade-up"
        data-aos-delay="100">
        <div
          class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-blue-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">📦</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Total
              Productos</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800 truncate">{{ stats.totalProducts }}</p>
          </div>
        </div>

        <div
          class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-yellow-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">⚠️</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Stock
              Bajo</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800 truncate">{{ stats.lowStock }}</p>
          </div>
        </div>

        <div
          class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-green-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">💰</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Valor
              Total</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800 truncate">${{ formatCurrency(stats.totalValue) }}
            </p>
          </div>
        </div>

        <div
          class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-red-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">🚫</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Sin Stock
            </h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800 truncate">{{ stats.outOfStock }}</p>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas con funcionalidad -->
      <div data-aos="fade-up" data-aos-delay="200">
        <h3 class="m-0 mb-4 sm:mb-5 text-gray-800 text-xl sm:text-2xl font-semibold">Acciones Rápidas</h3>
        <!-- Reemplaza los botones de acciones rápidas con estos: -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <!-- Agregar Producto - Funcional -->
          <button @click="goToAddProduct"
            class="bg-white border-2 border-gray-200 p-4 sm:p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-sm text-left">
            <span class="text-xl sm:text-2xl flex-shrink-0">➕</span>
            <div>
              <span class="block truncate">Agregar Producto</span>
              <span class="text-xs text-gray-400">Crear nuevo producto</span>
            </div>
          </button>

          <!-- Ver Inventario - Funcional -->
          <button @click="goToInventory"
            class="bg-white border-2 border-gray-200 p-4 sm:p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-sm text-left">
            <span class="text-xl sm:text-2xl flex-shrink-0">📋</span>
            <div>
              <span class="block truncate">Ver Inventario</span>
              <span class="text-xs text-gray-400">Gestionar productos</span>
            </div>
          </button>

          <!-- Generar Reporte - Deshabilitado -->
          <div
            class="bg-gray-50 border-2 border-gray-200 p-4 sm:p-5 rounded-xl cursor-not-allowed transition-all flex items-center gap-3 font-medium text-gray-400 text-left relative sm:col-span-2 lg:col-span-1 opacity-60">
            <span class="text-xl sm:text-2xl flex-shrink-0">📈</span>
            <div>
              <span class="block truncate">Generar Reporte</span>
              <span class="text-xs text-gray-300">Próximamente</span>
            </div>
            <!-- Badge "Próximamente" -->
            <div
              class="absolute -top-2 -right-2 bg-yellow-100 border border-yellow-300 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">
              Pronto
            </div>
          </div>
        </div>
      </div>

      <!-- Productos recientes si hay datos -->
      <div v-if="recentProducts.length > 0" class="mt-8" data-aos="fade-up" data-aos-delay="300">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl sm:text-2xl font-semibold text-gray-800">Productos Recientes</h3>
          <router-link to="/inventory"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 no-underline">
            Ver todos
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </router-link>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Producto</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Categoría</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="product in recentProducts" :key="product.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <div class="font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.code || product.sku }}</div>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ product.category }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <span class="font-medium">{{ product.stock }}</span>
                      <span v-if="product.stock <= (product.minStock || 5)" class="ml-2 text-yellow-500">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
                        </svg>
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusClass(product.status)">
                      {{ product.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Estado sin productos -->
      <div v-if="stats.totalProducts === 0" class="mt-8 text-center py-12" data-aos="fade-up" data-aos-delay="300">
        <div class="bg-white rounded-xl shadow-sm p-8">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">¡Comienza tu inventario!</h3>
          <p class="text-gray-600 mb-6">Agrega tu primer producto para empezar a gestionar tu stock</p>
          <router-link to="/inventory" @click="openAddProductModal"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium no-underline">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Agregar Primer Producto
          </router-link>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import { useProducts } from '../../composables/useProducts.js'

const router = useRouter()

const {
  products,
  stats,
  loadProducts,
  subscribeToProducts
} = useProducts()

// Suscripción en tiempo real
let unsubscribe = null

onMounted(async () => {
  await loadProducts()
  unsubscribe = subscribeToProducts()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// Productos recientes (últimos 5)
const recentProducts = computed(() => {
  return products.value.slice(0, 5)
})

// Función para formatear moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL').format(amount)
}

// Función para clases de estado
const getStatusClass = (status) => {
  const classes = {
    'Activo': 'bg-green-100 text-green-800',
    'Inactivo': 'bg-gray-100 text-gray-800',
    'Bajo Stock': 'bg-yellow-100 text-yellow-800',
    'Agotado': 'bg-red-100 text-red-800',
    'Descontinuado': 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Función para abrir modal de agregar producto
const openAddProductModal = () => {
  // Navegar a inventario y después trigger del modal
  router.push({
    path: '/inventory',
    query: { action: 'add' }
  })
}

// Función para navegar a inventario con acción específica
const navigateToInventory = (action = null) => {
  if (action) {
    router.push({
      path: '/inventory',
      query: { action }
    })
  } else {
    router.push('/inventory')
  }
}

// Función específica para agregar producto
const goToAddProduct = () => {
  navigateToInventory('add')
}

// Función específica para ver inventario
const goToInventory = () => {
  navigateToInventory()
}
</script>