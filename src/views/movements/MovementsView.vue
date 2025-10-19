<!-- filepath: src/views/movements/MovementsView.vue -->
<template>
  <DashboardLayout>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Header -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl mb-6">
          <h2 class="text-2xl font-bold mb-2">📋 Historial de Movimientos</h2>
          <p class="opacity-90">Registro completo de todas las operaciones del inventario</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Creaciones</p>
                <p class="text-2xl font-bold text-gray-800">{{ movementStats.byType.CREATE }}</p>
              </div>
              <div class="text-green-500 text-2xl">➕</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Actualizaciones</p>
                <p class="text-2xl font-bold text-gray-800">{{ movementStats.byType.UPDATE }}</p>
              </div>
              <div class="text-blue-500 text-2xl">✏️</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Eliminaciones</p>
                <p class="text-2xl font-bold text-gray-800">{{ movementStats.byType.DELETE }}</p>
              </div>
              <div class="text-red-500 text-2xl">🗑️</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Recuentos</p>
                <p class="text-2xl font-bold text-gray-800">{{ movementStats.byType.CYCLE_COUNT }}</p>
              </div>
              <div class="text-purple-500 text-2xl">📸</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
          <select v-model="filterType" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">Todos los tipos</option>
            <option value="CREATE">Creaciones</option>
            <option value="UPDATE">Actualizaciones</option>
            <option value="DELETE">Eliminaciones</option>
            <option value="CYCLE_COUNT">Recuentos Cíclicos</option>
          </select>

          <select v-model="limitCount" @change="reloadMovements" class="px-4 py-2 border border-gray-300 rounded-lg">
            <option :value="50">Últimos 50</option>
            <option :value="100">Últimos 100</option>
            <option :value="200">Últimos 200</option>
            <option :value="500">Últimos 500</option>
          </select>

          <button
            @click="reloadMovements"
            :disabled="loading"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 flex items-center gap-2"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Timeline de movimientos -->
      <div v-else class="space-y-4">
        <div
          v-for="movement in filteredMovements"
          :key="movement.id"
          class="bg-white rounded-xl shadow-sm p-6 border-l-4"
          :class="getMovementColor(movement.type)"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl" :class="getIconBgColor(movement.type)">
                {{ getMovementIcon(movement.type) }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">{{ movement.metadata.action }}</h3>
                <p class="text-sm text-gray-500">{{ formatDate(movement.timestamp) }}</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getTypeBadgeClass(movement.type)">
              {{ getTypeLabel(movement.type) }}
            </span>
          </div>

          <!-- Descripción -->
          <p class="text-sm text-gray-700 mb-4">{{ movement.metadata.description }}</p>

          <!-- Usuario -->
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <span>{{ movement.userName }} ({{ movement.userEmail }})</span>
            <span class="px-2 py-0.5 bg-gray-100 rounded-full">{{ getRoleLabel(movement.userRole) }}</span>
          </div>

          <!-- Detalles de cambios -->
          <div v-if="movement.type === 'CREATE'" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-green-800 mb-2">Datos del producto creado:</h4>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div><span class="font-medium">Categoría:</span> {{ movement.changes.created.category }}</div>
              <div><span class="font-medium">Estado:</span> {{ movement.changes.created.status }}</div>
              <div><span class="font-medium">Stock inicial:</span> {{ movement.changes.created.stock }}</div>
              <div><span class="font-medium">Precio:</span> ${{ formatCurrency(movement.changes.created.price) }}</div>
            </div>
          </div>

          <div v-else-if="movement.type === 'UPDATE'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-blue-800 mb-2">Cambios realizados:</h4>
            <div class="space-y-2">
              <div v-for="(change, field) in movement.changes" :key="field" class="text-xs flex items-center gap-2">
                <span class="font-medium text-blue-700">{{ getFieldLabel(field) }}:</span>
                <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded">{{ change.before }}</span>
                <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
                <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded">{{ change.after }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="movement.type === 'DELETE'" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-red-800 mb-2">Producto eliminado:</h4>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div><span class="font-medium">Categoría:</span> {{ movement.changes.deleted.category }}</div>
              <div><span class="font-medium">Stock al eliminar:</span> {{ movement.changes.deleted.stock }}</div>
              <div><span class="font-medium">Valor perdido:</span> ${{ formatCurrency(movement.metadata.valueLost) }}</div>
            </div>
          </div>

          <div v-else-if="movement.type === 'CYCLE_COUNT'" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-purple-800 mb-2">Recuento realizado:</h4>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-xs">
                <span class="font-medium">Stock anterior:</span>
                <span class="bg-gray-100 px-2 py-0.5 rounded">{{ movement.changes.stock.before }} unidades</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="font-medium">Stock actual:</span>
                <span class="bg-gray-100 px-2 py-0.5 rounded">{{ movement.changes.stock.after }} unidades</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="font-medium">Diferencia:</span>
                <span
                  class="px-2 py-0.5 rounded font-semibold"
                  :class="{
                    'bg-green-100 text-green-700': movement.changes.stock.difference > 0,
                    'bg-red-100 text-red-700': movement.changes.stock.difference < 0,
                    'bg-gray-100 text-gray-700': movement.changes.stock.difference === 0
                  }"
                >
                  {{ movement.changes.stock.difference > 0 ? '+' : '' }}{{ movement.changes.stock.difference }} unidades
                  ({{ movement.changes.stock.differenceType === 'SURPLUS' ? 'Excedente' : movement.changes.stock.differenceType === 'SHORTAGE' ? 'Faltante' : 'Coincide' }})
                </span>
              </div>
              <div v-if="movement.changes.notes" class="mt-2 pt-2 border-t border-purple-200">
                <span class="font-medium text-xs">Notas:</span>
                <p class="text-xs text-gray-600 mt-1">{{ movement.changes.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredMovements.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
          </svg>
          <p class="text-gray-500">No hay movimientos registrados</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import { useMovements } from '../../composables/useMovements.js'

const {
  movements,
  loading,
  loadMovements,
  getMovementStats
} = useMovements()

const filterType = ref('')
const limitCount = ref(50)

onMounted(async () => {
  await loadMovements(limitCount.value)
})

const reloadMovements = async () => {
  await loadMovements(limitCount.value)
}

const filteredMovements = computed(() => {
  if (!filterType.value) return movements.value
  return movements.value.filter(m => m.type === filterType.value)
})

const movementStats = computed(() => getMovementStats.value)

const getMovementColor = (type) => {
  const colors = {
    CREATE: 'border-green-500',
    UPDATE: 'border-blue-500',
    DELETE: 'border-red-500',
    CYCLE_COUNT: 'border-purple-500'
  }
  return colors[type] || 'border-gray-500'
}

const getIconBgColor = (type) => {
  const colors = {
    CREATE: 'bg-green-500',
    UPDATE: 'bg-blue-500',
    DELETE: 'bg-red-500',
    CYCLE_COUNT: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getMovementIcon = (type) => {
  const icons = {
    CREATE: '➕',
    UPDATE: '✏️',
    DELETE: '🗑️',
    CYCLE_COUNT: '📸'
  }
  return icons[type] || '📋'
}

const getTypeLabel = (type) => {
  const labels = {
    CREATE: 'Creación',
    UPDATE: 'Actualización',
    DELETE: 'Eliminación',
    CYCLE_COUNT: 'Recuento Cíclico'
  }
  return labels[type] || type
}

const getTypeBadgeClass = (type) => {
  const classes = {
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
    CYCLE_COUNT: 'bg-purple-100 text-purple-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getRoleLabel = (role) => {
  const labels = {
    admin: 'Administrador',
    operator: 'Operario'
  }
  return labels[role] || role
}

const getFieldLabel = (field) => {
  const labels = {
    code: 'Código',
    sku: 'SKU',
    name: 'Nombre',
    description: 'Descripción',
    category: 'Categoría',
    status: 'Estado',
    stock: 'Stock',
    minStock: 'Stock Mínimo',
    price: 'Precio',
    cost: 'Costo'
  }
  return labels[field] || field
}

const formatDate = (date) => {
  if (!date) return 'Fecha no disponible'
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL').format(amount)
}
</script>