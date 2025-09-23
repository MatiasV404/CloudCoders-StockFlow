<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Overlay -->
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? 'Editar Producto' : 'Agregar Producto' }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Row 1: Código y SKU -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
                Código del Producto
              </label>
              <input
                id="code"
                v-model="form.code"
                type="text"
                placeholder="Ej: COMP001"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :class="{ 'border-red-500': errors.code }"
              />
              <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code }}</p>
            </div>

            <div>
              <label for="sku" class="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                id="sku"
                v-model="form.sku"
                type="text"
                placeholder="Ej: SKU001"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :class="{ 'border-red-500': errors.sku }"
              />
              <p v-if="errors.sku" class="mt-1 text-sm text-red-600">{{ errors.sku }}</p>
            </div>
          </div>

          <!-- Row 2: Nombre -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Ej: Laptop Dell Inspiron"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Row 3: Descripción -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Descripción detallada del producto..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            ></textarea>
          </div>

          <!-- Row 4: Categoría y Estado -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="category"
                v-model="form.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :class="{ 'border-red-500': errors.category }"
              >
                <option value="">Selecciona una categoría</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                id="status"
                v-model="form.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :class="{ 'border-red-500': errors.status }"
              >
                <option value="">Selecciona un estado</option>
                <option v-for="status in statuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
              <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
            </div>
          </div>

          <!-- Row 5: Stock y Stock Mínimo -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
                Stock Actual *
              </label>
              <input
                id="stock"
                v-model.number="form.stock"
                type="number"
                min="0"
                required
                placeholder="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :class="{ 'border-red-500': errors.stock }"
              />
              <p v-if="errors.stock" class="mt-1 text-sm text-red-600">{{ errors.stock }}</p>
            </div>

            <div>
              <label for="minStock" class="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo
              </label>
              <input
                id="minStock"
                v-model.number="form.minStock"
                type="number"
                min="0"
                placeholder="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <p class="mt-1 text-sm text-gray-500">Alerta cuando el stock esté por debajo de este número</p>
            </div>
          </div>

          <!-- Row 6: Precio -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                Precio de Venta *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="price"
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  :class="{ 'border-red-500': errors.price }"
                />
              </div>
              <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
            </div>

            <div>
              <label for="cost" class="block text-sm font-medium text-gray-700 mb-2">
                Precio de Costo
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="cost"
                  v-model.number="form.cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">Para cálculo de rentabilidad</p>
            </div>
          </div>

          <!-- Información adicional -->
          <div v-if="isEditing && product" class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Información del producto</h4>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span class="font-medium">Creado:</span> 
                {{ formatDate(product.createdAt) }}
              </div>
              <div v-if="product.updatedAt">
                <span class="font-medium">Última actualización:</span> 
                {{ formatDate(product.updatedAt) }}
              </div>
            </div>
          </div>

          <!-- Error general -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400 mt-0.5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
              </svg>
              <p class="text-sm text-red-700">{{ generalError }}</p>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              :disabled="saving"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              :disabled="saving"
            >
              <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1A11,11 0 1 0 23,12A11,11 0 0 0 12,1Zm0,19a8,8 0 1 1 8-8A8,8 0 0 1 12,20Z" opacity=".25"/>
                <path d="M10.14,1.16a11,11 0 0 0-9,8.92A1.59,1.59 0 0 0 2.46,12,1.52,1.52 0 0 0 4.11,10.7a8,8 0 0 1 6.66-6.61A1.42,1.42 0 0 0 12,2.69h0A1.57,1.57 0 0 0 10.14,1.16Z"/>
              </svg>
              {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Producto') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  },
  statuses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

// Estado del formulario
const form = reactive({
  code: '',
  sku: '',
  name: '',
  description: '',
  category: '',
  status: '',
  stock: 0,
  minStock: 5,
  price: 0,
  cost: 0
})

// Estado del componente
const errors = ref({})
const generalError = ref('')
const saving = ref(false)

// Computed
const isEditing = computed(() => !!props.product?.id)

// Watchers
watch(() => props.show, (show) => {
  if (show) {
    resetForm()
    if (props.product) {
      loadProductData()
    }
    nextTick(() => {
      // Focus en el primer campo
      const firstInput = document.getElementById('name')
      if (firstInput) firstInput.focus()
    })
  }
})

// Métodos
const resetForm = () => {
  form.code = ''
  form.sku = ''
  form.name = ''
  form.description = ''
  form.category = ''
  form.status = ''
  form.stock = 0
  form.minStock = 5
  form.price = 0
  form.cost = 0
  errors.value = {}
  generalError.value = ''
  saving.value = false
}

const loadProductData = () => {
  if (!props.product) return
  
  form.code = props.product.code || ''
  form.sku = props.product.sku || ''
  form.name = props.product.name || ''
  form.description = props.product.description || ''
  form.category = props.product.category || ''
  form.status = props.product.status || ''
  form.stock = props.product.stock || 0
  form.minStock = props.product.minStock || 5
  form.price = props.product.price || 0
  form.cost = props.product.cost || 0
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'El nombre es obligatorio'
  }
  
  if (!form.category) {
    errors.value.category = 'La categoría es obligatoria'
  }
  
  if (!form.status) {
    errors.value.status = 'El estado es obligatorio'
  }
  
  if (form.stock < 0) {
    errors.value.stock = 'El stock no puede ser negativo'
  }
  
  if (form.price <= 0) {
    errors.value.price = 'El precio debe ser mayor a 0'
  }

  if (form.cost < 0) {
    errors.value.cost = 'El costo no puede ser negativo'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  // Determinar estado automático basado en stock
  let finalStatus = form.status
  if (form.stock === 0) {
    finalStatus = 'Agotado'
  } else if (form.stock <= form.minStock) {
    finalStatus = 'Bajo Stock'
  } else if (form.status === 'Agotado' && form.stock > 0) {
    finalStatus = 'Activo'
  }

  saving.value = true
  generalError.value = ''

  try {
    const productData = {
      code: form.code.trim(),
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      status: finalStatus,
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      price: Number(form.price),
      cost: Number(form.cost) || 0
    }

    await emit('save', productData)
  } catch (error) {
    console.error('Error guardando producto:', error)
    generalError.value = 'Error al guardar el producto. Inténtalo nuevamente.'
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  if (!saving.value) {
    emit('close')
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>