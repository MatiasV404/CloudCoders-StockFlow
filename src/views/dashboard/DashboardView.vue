<template>
  <DashboardLayout>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6" data-aos="fade-up">
      
      <!-- Card de bienvenida -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 sm:p-8 rounded-2xl mb-6 sm:mb-8 shadow-lg">
        <h2 class="m-0 mb-2 text-2xl sm:text-3xl font-semibold">¡Bienvenido a StockFlow! 👋</h2>
        <p class="m-0 opacity-90 text-base sm:text-lg">Gestiona tu inventario de manera eficiente</p>
      </div>

      <!-- Grid de estadísticas básicas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8" data-aos="fade-up" data-aos-delay="100">
        
        <!-- Total Productos -->
        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-blue-500">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">📦</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase">Total Productos</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800">{{ stats.totalProducts }}</p>
          </div>
        </div>

        <!-- Stock Bajo con Badge -->
        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-yellow-500 relative">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">⚠️</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase">Stock Bajo</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800">{{ stats.lowStock }}</p>
          </div>
          <span v-if="lowStockProducts.length > 0" class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {{ lowStockProducts.length }}
          </span>
        </div>

        <!-- Valor Total -->
        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-green-500">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">💰</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase">Valor Total</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800">${{ formatCurrency(stats.totalValue) }}</p>
          </div>
        </div>

        <!-- Sin Stock -->
        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-red-500">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">🚫</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase">Sin Stock</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800">{{ stats.outOfStock }}</p>
          </div>
        </div>
      </div>

      <!-- Margen de Ganancia Total y Crecimiento -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-aos="fade-up" data-aos-delay="150">
        
        <!-- Margen de Ganancia Total -->
        <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">💵 Ganancia potencial</h3>
            <div class="text-3xl">📈</div>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-emerald-100 text-sm mb-1">Ganancia total</p>
              <p class="text-4xl font-bold">${{ formatCurrency(profitMetrics.totalProfit) }}</p>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <div>
                <p class="text-emerald-100">Margen promedio</p>
                <p class="text-2xl font-bold">{{ profitMetrics.averageMargin }}%</p>
              </div>
              <div class="h-12 w-px bg-emerald-400"></div>
              <div>
                <p class="text-emerald-100">Costo total</p>
                <p class="text-lg font-semibold">${{ formatCurrency(profitMetrics.totalCost) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Crecimiento del Inventario -->
        <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-800">📊 Crecimiento del inventario</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-purple-600 mb-1">Esta semana</p>
              <p class="text-3xl font-bold text-purple-700">{{ inventoryGrowth.thisWeek }}</p>
              <p class="text-xs text-purple-500 mt-1">productos nuevos</p>
            </div>
            <div class="bg-indigo-50 p-4 rounded-lg">
              <p class="text-sm text-indigo-600 mb-1">Este mes</p>
              <p class="text-3xl font-bold text-indigo-700">{{ inventoryGrowth.thisMonth }}</p>
              <p class="text-xs text-indigo-500 mt-1">productos nuevos</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top 5 Productos Rentables y Categoría con Más Valor -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-aos="fade-up" data-aos-delay="200">
        
        <!-- Top 5 Productos Más Rentables -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-800">🏆 Top 5 productos rentables</h3>
          </div>
          <div v-if="topProfitableProducts.length > 0" class="space-y-3">
            <div 
              v-for="(product, index) in topProfitableProducts" 
              :key="product.id"
              class="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 hover:shadow-md transition-shadow"
            >
              <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-white"
                :class="{
                  'bg-yellow-500': index === 0,
                  'bg-gray-400': index === 1,
                  'bg-amber-600': index === 2,
                  'bg-blue-400': index > 2
                }"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800 truncate">{{ product.name }}</p>
                <p class="text-xs text-gray-500">{{ product.category }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-green-600">${{ formatCurrency(product.totalProfit) }}</p>
                <p class="text-xs text-gray-500">{{ product.marginPercent }}% margen</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
            </svg>
            <p class="text-sm">No hay datos de rentabilidad disponibles</p>
          </div>
        </div>

        <!-- Categoría con más valor -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">👑 Categoría estrella</h3>
            <div class="text-3xl">🌟</div>
          </div>
          <div v-if="topCategory" class="space-y-4">
            <div>
              <p class="text-indigo-100 text-sm mb-2">Categoría más valiosa</p>
              <p class="text-3xl font-bold mb-1">{{ topCategory.name }}</p>
              <p class="text-indigo-100 text-sm">{{ topCategory.productCount }} productos</p>
            </div>
            <div class="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p class="text-indigo-100 text-sm mb-1">Valor total de inventario</p>
              <p class="text-3xl font-bold">${{ formatCurrency(topCategory.totalValue) }}</p>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <div>
                <p class="text-indigo-200">Stock total</p>
                <p class="text-xl font-bold">{{ topCategory.totalStock }}</p>
              </div>
              <div class="h-8 w-px bg-indigo-400"></div>
              <div>
                <p class="text-indigo-200">Precio promedio</p>
                <p class="text-xl font-bold">${{ formatCurrency(topCategory.avgPrice) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-indigo-100">No hay categorías disponibles</p>
          </div>
        </div>
      </div>

      <!-- Alertas de Reabastecimiento -->
      <div class="mb-8" data-aos="fade-up" data-aos-delay="250">
        <div class="bg-white p-6 rounded-xl shadow-sm border-l-4" :class="lowStockProducts.length > 0 ? 'border-red-500' : 'border-green-500'">
          <div class="flex items-center justify-between mb-4 custom-flex">
            <div class="flex items-center gap-3 custom-flex">
              <h3 class="text-xl font-bold text-gray-800">⚠️ Alertas de reabastecimiento</h3>
              <span v-if="lowStockProducts.length > 0" class="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                {{ lowStockProducts.length }} alertas
              </span>
            </div>
            <button 
              v-if="lowStockProducts.length > 0"
              @click="goToInventory"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              Ver en inventario
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </button>
          </div>
          
          <div v-if="lowStockProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="product in lowStockProducts.slice(0, 6)" 
              :key="product.id"
              class="bg-red-50 border-2 border-red-200 p-4 rounded-lg"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <p class="font-semibold text-gray-800">{{ product.name }}</p>
                  <p class="text-sm text-gray-500">{{ product.category }}</p>
                </div>
                <span class="text-red-700 font-bold text-l">Stock actual: {{ product.stock }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Stock mínimo: {{ product.minStock }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <div class="text-6xl mb-4">✅</div>
            <p class="text-lg font-semibold text-green-600 mb-1">¡Todo en orden!</p>
            <p class="text-sm text-gray-500">No hay productos con stock bajo en este momento</p>
          </div>
        </div>
      </div>

      <!-- Gráficos (3. Valor por Categoría, 5. Distribución por Estado, 8. Stock por Categoría) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" data-aos="fade-up" data-aos-delay="300">
        
        <!-- Valor de Inventario por Categoría -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h3 class="text-lg font-bold text-gray-800 mb-4">💼 Valor por categoría</h3>
          <canvas ref="valueByCategory"></canvas>
        </div>

        <!-- Distribución de Stock por Estado -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h3 class="text-lg font-bold text-gray-800 mb-4">🎯 Stock por estado</h3>
          <canvas ref="stockByStatus"></canvas>
        </div>

        <!-- Stock por Categoría -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h3 class="text-lg font-bold text-gray-800 mb-4">📊 Stock por categoría</h3>
          <canvas ref="stockByCategory"></canvas>
        </div>
      </div>

      <!-- Distribución de Productos por Categoría -->
      <div class="bg-white p-6 rounded-xl shadow-sm mb-8" data-aos="fade-up" data-aos-delay="350">
        <h3 class="text-xl font-bold text-gray-800 mb-4">🥧 Distribución de productos</h3>
        <div class="max-w-md mx-auto">
          <canvas ref="productDistribution"></canvas>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div data-aos="fade-up" data-aos-delay="400">
        <h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Acciones rápidas</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <button @click="goToAddProduct"
            class="bg-white border-2 border-gray-200 p-4 sm:p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 text-left">
            <span class="text-xl sm:text-2xl flex-shrink-0">➕</span>
            <div>
              <span class="block">Agregar producto</span>
              <span class="text-xs text-gray-400">Nuevo artículo</span>
            </div>
          </button>

          <button @click="goToInventory"
            class="bg-white border-2 border-gray-200 p-4 sm:p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 text-left">
            <span class="text-xl sm:text-2xl flex-shrink-0">📋</span>
            <div>
              <span class="block">Ver inventario</span>
              <span class="text-xs text-gray-400">Gestionar productos</span>
            </div>
          </button>

          <div class="bg-gray-50 border-2 border-gray-200 p-4 sm:p-5 rounded-xl cursor-not-allowed flex items-center gap-3 font-medium text-gray-400 text-left relative opacity-60">
            <span class="text-xl sm:text-2xl flex-shrink-0">📈</span>
            <div>
              <span class="block">Generar reporte</span>
              <span class="text-xs text-gray-300">Próximamente</span>
            </div>
            <div class="absolute -top-2 -right-2 bg-yellow-100 border border-yellow-300 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">
              Pronto
            </div>
          </div>
        </div>
      </div>

      <!-- Productos recientes -->
      <div v-if="recentProducts.length > 0" class="mt-8" data-aos="fade-up" data-aos-delay="450">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl sm:text-2xl font-semibold text-gray-800">Productos recientes</h3>
          <router-link to="/inventory" class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 no-underline">
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
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="getStatusClass(product.status)">
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
      <div v-if="stats.totalProducts === 0" class="mt-8 text-center py-12" data-aos="fade-up" data-aos-delay="500">
        <div class="bg-white rounded-xl shadow-sm p-8">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">¡Comienza tu inventario!</h3>
          <p class="text-gray-600 mb-6">Agrega tu primer producto para empezar a gestionar tu stock</p>
          <button @click="goToAddProduct"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium border-0 cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Agregar Primer Producto
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import { useProducts } from '../../composables/useProducts.js'
import Chart from 'chart.js/auto'

const router = useRouter()

const {
  products,
  stats,
  loadProducts,
  subscribeToProducts,
} = useProducts()

// Referencias para los canvas de gráficos
const valueByCategory = ref(null)
const stockByStatus = ref(null)
const stockByCategory = ref(null)
const productDistribution = ref(null)

// Instancias de Chart.js
let chartInstances = {
  valueByCategory: null,
  stockByStatus: null,
  stockByCategory: null,
  productDistribution: null
}

// Estado de búsqueda
const searchQuery = ref('')
const searchResults = ref([])

let unsubscribe = null

onMounted(async () => {
  try {
    await loadProducts()
    
    const subscription = await subscribeToProducts()
    if (subscription && typeof subscription === 'function') {
      unsubscribe = subscription
    } else {
      console.warn('⚠️ No se pudo establecer suscripción en tiempo real')
    }

    // Crear gráficos después de que los datos estén cargados
    await nextTick()
    createCharts()
  } catch (error) {
    console.error('❌ Error cargando productos en dashboard:', error)
  }
})

onUnmounted(() => {
  if (unsubscribe && typeof unsubscribe === 'function') {
    try {
      unsubscribe()
    } catch (error) {
      console.error('❌ Error limpiando suscripción:', error)
    }
  }
  unsubscribe = null

  // Destruir gráficos
  Object.values(chartInstances).forEach(chart => {
    if (chart) chart.destroy()
  })
})

// 1. MARGEN DE GANANCIA TOTAL
const profitMetrics = computed(() => {
  const productsWithCost = products.value.filter(p => p.cost > 0)
  
  const totalProfit = productsWithCost.reduce((sum, p) => {
    return sum + ((p.price - p.cost) * p.stock)
  }, 0)

  const totalCost = productsWithCost.reduce((sum, p) => sum + (p.cost * p.stock), 0)
  const totalRevenue = productsWithCost.reduce((sum, p) => sum + (p.price * p.stock), 0)
  
  const averageMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0

  return {
    totalProfit,
    totalCost,
    averageMargin
  }
})

// TOP 5 PRODUCTOS MÁS RENTABLES
const topProfitableProducts = computed(() => {
  return products.value
    .filter(p => p.cost > 0)
    .map(p => ({
      ...p,
      totalProfit: (p.price - p.cost) * p.stock,
      marginPercent: ((p.price - p.cost) / p.price * 100).toFixed(1)
    }))
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .slice(0, 5)
})

// ALERTAS DE REABASTECIMIENTO
const lowStockProducts = computed(() => {
  return products.value
    .filter(p => p.stock <= (p.minStock) && p.stock > 0)
    .sort((a, b) => a.stock - b.stock)
})

// CRECIMIENTO DEL INVENTARIO
const inventoryGrowth = computed(() => {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const thisWeek = products.value.filter(p => 
    p.createdAt && p.createdAt.toDate() >= oneWeekAgo
  ).length

  const thisMonth = products.value.filter(p => 
    p.createdAt && p.createdAt.toDate() >= oneMonthAgo
  ).length

  const lastMonth = products.value.filter(p => {
    const date = p.createdAt ? p.createdAt.toDate() : null
    return date && date >= twoMonthsAgo && date < oneMonthAgo
  }).length

  const growthPercentage = lastMonth > 0 
    ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(0)
    : (thisMonth > 0 ? 100 : 0)

  return {
    thisWeek,
    thisMonth,
    growthPercentage: Number(growthPercentage)
  }
})

// CATEGORÍA CON MÁS VALOR
const topCategory = computed(() => {
  if (products.value.length === 0) return null

  const categoryData = {}
  
  products.value.forEach(p => {
    if (!categoryData[p.category]) {
      categoryData[p.category] = {
        name: p.category,
        totalValue: 0,
        productCount: 0,
        totalStock: 0,
        totalPrice: 0
      }
    }
    
    categoryData[p.category].totalValue += p.price * p.stock
    categoryData[p.category].productCount += 1
    categoryData[p.category].totalStock += p.stock
    categoryData[p.category].totalPrice += p.price
  })

  const categories = Object.values(categoryData)
  const top = categories.reduce((max, cat) => 
    cat.totalValue > max.totalValue ? cat : max
  , categories[0])

  return {
    ...top,
    avgPrice: Math.round(top.totalPrice / top.productCount)
  }
})

// DATOS PARA GRÁFICOS
const categoryValueData = computed(() => {
  const data = {}
  products.value.forEach(p => {
    if (!data[p.category]) data[p.category] = 0
    data[p.category] += p.price * p.stock
  })
  return data
})

const statusStockData = computed(() => {
  const data = {}
  products.value.forEach(p => {
    if (!data[p.status]) data[p.status] = 0
    data[p.status] += p.stock
  })
  return data
})

const categoryStockData = computed(() => {
  const data = {}
  products.value.forEach(p => {
    if (!data[p.category]) data[p.category] = 0
    data[p.category] += p.stock
  })
  return data
})

const categoryProductCount = computed(() => {
  const data = {}
  products.value.forEach(p => {
    if (!data[p.category]) data[p.category] = 0
    data[p.category] += 1
  })
  return data
})

const recentProducts = computed(() => {
  return products.value.slice(0, 5)
})

// CREAR GRÁFICOS
const createCharts = () => {
  // Destruir gráficos existentes
  Object.values(chartInstances).forEach(chart => {
    if (chart) chart.destroy()
  })

  // 3. Valor por Categoría (Dona)
  if (valueByCategory.value) {
    const ctx = valueByCategory.value.getContext('2d')
    chartInstances.valueByCategory = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryValueData.value),
        datasets: [{
          data: Object.values(categoryValueData.value),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 10, font: { size: 10 } }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `$${formatCurrency(context.parsed)}`
              }
            }
          }
        }
      }
    })
  }

  // 5. Stock por Estado (Barras horizontales)
  if (stockByStatus.value) {
    const ctx = stockByStatus.value.getContext('2d')
    chartInstances.stockByStatus = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(statusStockData.value),
        datasets: [{
          label: 'Unidades',
          data: Object.values(statusStockData.value),
          backgroundColor: [
            '#10B981', // Activo - Verde
            '#6B7280', // Inactivo - Gris
            '#EF4444', // Agotado - Rojo
            '#8B5CF6'  // Descontinuado - Púrpura
          ]
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    })
  }

  // Stock por Categoría (Barras)
  if (stockByCategory.value) {
    const ctx = stockByCategory.value.getContext('2d')
    const stockData = Object.values(categoryStockData.value)
    const colors = stockData.map(stock => 
      stock > 50 ? '#10B981' : stock > 20 ? '#F59E0B' : '#EF4444'
    )

    chartInstances.stockByCategory = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(categoryStockData.value),
        datasets: [{
          label: 'Stock',
          data: stockData,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    })
  }

  // Distribución de Productos (Pastel grande)
  if (productDistribution.value) {
    const ctx = productDistribution.value.getContext('2d')
    chartInstances.productDistribution = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(categoryProductCount.value),
        datasets: [{
          data: Object.values(categoryProductCount.value),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'right',
            labels: { padding: 15, font: { size: 12 } }
          }
        }
      }
    })
  }
}

// MÉTODOS

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL').format(amount)
}

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

const goToAddProduct = () => {
  router.push({
    path: '/inventory',
    query: { action: 'add' }
  })
}

const goToInventory = () => {
  router.push('/inventory')
}
</script>

<style scoped>
.custom-flex {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>