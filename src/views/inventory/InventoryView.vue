<template>
  <DashboardLayout>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6">

      <!-- Header con estadísticas -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl mb-6">
          <h2 class="text-2xl font-bold mb-2">Gestión de Inventario</h2>
          <p class="opacity-90">Administra tus productos de manera eficiente</p>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Productos</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.totalProducts }}</p>
              </div>
              <div class="text-blue-500 text-2xl">📦</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Stock Bajo</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.lowStock }}</p>
              </div>
              <div class="text-yellow-500 text-2xl">⚠️</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Sin Stock</p>
                <p class="text-2xl font-bold text-gray-800">{{ stats.outOfStock }}</p>
              </div>
              <div class="text-red-500 text-2xl">🚫</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Valor Total</p>
                <p class="text-2xl font-bold text-gray-800">${{ formatCurrency(stats.totalValue) }}</p>
              </div>
              <div class="text-green-500 text-2xl">💰</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controles de búsqueda y filtros -->
      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-6">
        <div class="flex flex-col gap-4">

          <!-- Row 1: Búsqueda -->
          <div class="w-full">
            <div class="relative">
              <input v-model="searchTerm" type="text" placeholder="Buscar productos..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Row 2: Filtros y Botón - Responsivo -->
          <div class="flex flex-col sm:flex-row gap-3 sm:items-center">

            <!-- Contenedor de filtros -->
            <div class="flex flex-col sm:flex-row gap-3 flex-1">
              <select v-model="selectedCategory"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Todas las categorías</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>

              <select v-model="selectedStatus"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Todos los estados</option>
                <option v-for="status in statuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>

            <!-- Botón agregar -->
            <button @click="showAddModal = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap sm:w-auto">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              <span class="hidden sm:inline">Agregar Producto</span>
              <span class="sm:hidden">Agregar</span>
            </button>
          </div>

          <!-- Indicadores de filtros activos -->
          <div v-if="searchTerm || selectedCategory || selectedStatus" class="flex flex-wrap gap-2">
            <span v-if="searchTerm"
              class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              Búsqueda: "{{ searchTerm }}"
              <button @click="searchTerm = ''" class="hover:bg-blue-200 rounded-full p-0.5">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </span>

            <span v-if="selectedCategory"
              class="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              Categoría: {{ selectedCategory }}
              <button @click="selectedCategory = ''" class="hover:bg-purple-200 rounded-full p-0.5">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </span>

            <span v-if="selectedStatus"
              class="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Estado: {{ selectedStatus }}
              <button @click="selectedStatus = ''" class="hover:bg-green-200 rounded-full p-0.5">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </span>

            <button @click="clearAllFilters"
              class="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- LOADING MEJORADO -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <div class="relative">
          <!-- Spinner animado -->
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          <!-- Icono central -->
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V6A2,2 0 0,1 4,4Z" />
            </svg>
          </div>
        </div>
        
        <!-- Texto de carga -->
        <div class="mt-6 text-center">
          <p class="text-lg font-medium text-gray-700 mb-1">Cargando inventario...</p>
          <p class="text-sm text-gray-500">Esto puede tomar unos segundos</p>
        </div>

        <!-- Barra de progreso animada -->
        <div class="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-blue-600 rounded-full animate-pulse" style="width: 60%"></div>
        </div>
      </div>

      <!-- Tabla de productos -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Código/SKU</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Estado vacío -->
              <tr v-if="filteredProducts.length === 0">
                <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <svg class="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
                    </svg>
                    <p class="text-lg font-medium">No hay productos</p>
                    <p class="text-sm">Comienza agregando tu primer producto</p>
                  </div>
                </td>
              </tr>

              <!-- Filas de productos -->
              <tr v-for="(product, index) in filteredProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ index + 1 }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-mono font-semibold">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z" />
                    </svg>
                    {{ product.productId || 'N/A' }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ product.code || product.sku || 'N/A' }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div v-if="product.description" class="text-sm text-gray-500 max-w-xs truncate">
                    {{ product.description }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ product.category }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-900">{{ product.stock }}</span>
                    <span v-if="product.stock <= (product.minStock || 5)" class="ml-2 text-yellow-500">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
                      </svg>
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ formatCurrency(product.price) }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(product.status)">
                    {{ product.status }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex gap-2">
                    <button @click="editProduct(product)"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="Editar">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                      </svg>
                    </button>
                    <button @click="confirmDelete(product)"
                      class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Eliminar">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modales -->
      <ProductModal :show="showAddModal || showEditModal" :product="selectedProduct" :categories="categories"
        :statuses="statuses" @close="closeModal" @save="handleSave" />

      <ConfirmModal :show="showDeleteModal" :title="`¿Eliminar ${productToDelete?.name}?`"
        :message="'Esta acción no se puede deshacer.'" :confirmText="'Eliminar'"
        :confirmClass="'bg-red-600 hover:bg-red-700'" @confirm="handleDelete" @cancel="showDeleteModal = false" />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import ProductModal from '../../components/inventory/ProductModal.vue'
import ConfirmModal from '../../components/common/ConfirmModal.vue'
import { useProducts } from '../../composables/useProducts.js'

const route = useRoute()

const {
  products,
  loading,
  categories,
  statuses,
  stats,
  loadProducts,
  subscribeToProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = useProducts()

// Estado local
const searchTerm = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedProduct = ref(null)
const productToDelete = ref(null)

// Suscripción en tiempo real
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

    if (route.query.action === 'add') {
      showAddModal.value = true
    }
  } catch (error) {
    console.error('❌ Error cargando productos en inventory:', error)
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
})

watch(() => route.query.action, (action) => {
  if (action === 'add') {
    showAddModal.value = true
  }
})

const filteredProducts = computed(() => {
  let result = products.value

  if (searchTerm.value) {
    result = searchProducts(searchTerm.value)
  }

  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  if (selectedStatus.value) {
    result = result.filter(p => p.status === selectedStatus.value)
  }

  return result
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL').format(amount)
}

const clearAllFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
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

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedProduct.value = null
}

const editProduct = (product) => {
  selectedProduct.value = { ...product }
  showEditModal.value = true
}

const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const handleSave = async (productData) => {
  try {
    if (selectedProduct.value?.id) {
      await updateProduct(selectedProduct.value.id, productData)
    } else {
      await addProduct(productData)
    }
    closeModal()
  } catch (error) {
    console.error('Error guardando producto:', error)
  }
}

const handleDelete = async () => {
  if (!productToDelete.value?.id) return

  try {
    await deleteProduct(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
  } catch (error) {
    console.error('Error eliminando producto:', error)
  }
}
</script>