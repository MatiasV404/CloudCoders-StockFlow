<template>
  <!-- OVERLAY CON BLUR -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <!-- MODAL PANEL CON ANIMACIÓN -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="show"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div class="p-6 sm:p-8">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-800 m-0">
                  {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
                </h2>
                <button
                  @click="closeModal"
                  type="button"
                  class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>

              <!-- Banner QR Code (solo cuando edita) -->
              <div v-if="isEditing && product?.productId" class="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <svg class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-sm font-semibold text-blue-900 mb-2">Código QR del Producto</h3>
                    <button
                      @click="showQRModal = true"
                      type="button"
                      class="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      Ver y descargar código QR
                    </button>
                  </div>
                </div>
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
                      <option value="" disabled>Selecciona una categoría</option>
                      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
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
                      <option value="" disabled>Selecciona un estado</option>
                      <option v-for="st in statuses" :key="st" :value="st">{{ st }}</option>
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
                        :class="{ 'border-red-500': errors.cost }"
                      />
                    </div>
                    <p v-if="errors.cost" class="mt-1 text-sm text-red-600">{{ errors.cost }}</p>
                  </div>
                </div>

                <!-- Error general -->
                <div v-if="generalError" class="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <svg class="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
                  </svg>
                  <p class="text-sm text-red-700">{{ generalError }}</p>
                </div>

                <!-- Botones -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    @click="closeModal"
                    :disabled="saving"
                    class="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    :disabled="saving"
                    class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg v-if="saving" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,1A11,11 0 1 0 23,12A11,11 0 0 0 12,1Zm0,19a8,8 0 1 1 8-8A8,8 0 0 1 12,20Z" opacity=".25"/>
                      <path d="M10.14,1.16a11,11 0 0 0-9,8.92A1.59,1.59 0 0 0 2.46,12,1.52,1.52 0 0 0 4.11,10.7a8,8 0 0 1 6.66-6.61A1.42,1.42 0 0 0 12,2.69h0A1.57,1.57 0 0 0 10.14,1.16Z"/>
                    </svg>
                    {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Producto') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>

        <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="showQRModal"
            class="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4"
            @click.self="showQRModal = false"
          >
            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="scale-95 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition-all duration-200"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-95 opacity-0"
            >
              <div v-if="showQRModal" class="bg-white rounded-2xl shadow-2xl max-w-md w-full" @click.stop>
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800">Código QR</h3>
                    <button
                      @click="showQRModal = false"
                      type="button"
                      class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                      </svg>
                    </button>
                  </div>

                  <ProductQRCode
                    :product-id="product?.productId"
                    :product-name="product?.name"
                    :size="250"
                  />
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import ProductQRCode from './ProductQRCode.vue'

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
const showQRModal = ref(false)

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
      const firstInput = document.getElementById('name')
      if (firstInput) firstInput.focus()
    })
  } else {
    showQRModal.value = false
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
</script>