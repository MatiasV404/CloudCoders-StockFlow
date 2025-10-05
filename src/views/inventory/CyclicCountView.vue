<template>
  <DashboardLayout>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Header Simple -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div class="flex items-center gap-3 mb-2">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
            </svg>
            <h2 class="text-2xl font-bold m-0">Recuento Cíclico</h2>
          </div>
          <p class="opacity-90 m-0">Escanea códigos QR para registrar el stock físico de productos</p>
        </div>
      </div>

      <!-- Scanner Section -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-800 m-0">Escáner QR</h3>
            <div class="flex gap-2">
              <button
                v-if="!isScanning"
                @click="startScanning"
                class="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" />
                </svg>
                Iniciar Escaneo
              </button>
              <button
                v-else
                @click="stopScanning"
                class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M9,9H15V15H9" />
                </svg>
                Detener Escaneo
              </button>
            </div>
          </div>

          <!-- Camera Preview -->
          <div class="relative bg-gray-900 rounded-lg overflow-hidden" style="aspect-ratio: 16/9;">
            <div v-if="!isScanning" class="absolute inset-0 flex flex-col items-center justify-center text-white">
              <svg class="w-24 h-24 mb-4 opacity-50" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
              </svg>
              <p class="text-lg font-medium mb-2">Cámara inactiva</p>
              <p class="text-sm opacity-75">Haz clic en "Iniciar Escaneo" para comenzar</p>
            </div>

            <!-- Video element -->
            <video
              v-show="isScanning"
              ref="videoElement"
              class="w-full h-full object-cover"
              autoplay
              playsinline
            ></video>

            <!-- Overlay de escaneo -->
            <div v-if="isScanning" class="absolute inset-0 pointer-events-none">
              <!-- Marco de escaneo -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative w-64 h-64">
                  <!-- Esquinas del marco -->
                  <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500"></div>
                  <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500"></div>
                  <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500"></div>
                  <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500"></div>
                  
                  <!-- Línea de escaneo animada -->
                  <div class="absolute inset-x-0 h-0.5 bg-purple-500 animate-scan"></div>
                </div>
              </div>

              <!-- Instrucciones -->
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                {{ scanningMessage }}
              </div>
            </div>
          </div>

          <!-- Manual input alternativo -->
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              O ingresa el código manualmente:
            </label>
            <div class="flex gap-2">
              <input
                v-model="manualProductId"
                type="text"
                placeholder="PRD-XXXXX-XXXXX"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                @keyup.enter="searchProduct"
              />
              <button
                @click="searchProduct"
                :disabled="!manualProductId || searching"
                class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Producto Encontrado -->
      <div v-if="currentProduct" class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4 flex-1">
              <div class="bg-purple-100 p-3 rounded-lg">
                <svg class="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z" />
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-800 mb-1">{{ currentProduct.name }}</h4>
                <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ currentProduct.productId }}</span>
                  <span class="text-gray-400">•</span>
                  <span>{{ currentProduct.category }}</span>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Stock Registrado:</span>
                    <span class="ml-1 font-semibold text-gray-800">{{ currentProduct.stock }} unidades</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Precio:</span>
                    <span class="ml-1 font-semibold text-gray-800">${{ formatCurrency(currentProduct.price) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              @click="clearProduct"
              class="text-gray-400 hover:text-gray-600 p-2"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <!-- Formulario de recuento -->
          <form @submit.prevent="updatePhysicalCount" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Stock Físico Actual *
              </label>
              <input
                v-model.number="physicalCount"
                type="number"
                min="0"
                required
                placeholder="Ingresa la cantidad física"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                :class="{ 'border-yellow-500': hasDifference }"
              />
              
              <!-- Diferencia -->
              <div v-if="hasDifference" class="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-yellow-800">Diferencia detectada</p>
                    <p class="text-xs text-yellow-700 mt-1">
                      {{ difference > 0 ? `+${difference}` : difference }} unidades 
                      {{ difference > 0 ? '(Excedente)' : '(Faltante)' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                v-model="countNotes"
                rows="2"
                placeholder="Agrega cualquier observación sobre el recuento..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="clearProduct"
                class="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="updating || physicalCount === null"
                class="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg v-if="updating" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,1A11,11 0 1 0 23,12A11,11 0 0 0 12,1Zm0,19a8,8 0 1 1 8-8A8,8 0 0 1 12,20Z" opacity=".25"/>
                  <path d="M10.14,1.16a11,11 0 0 0-9,8.92A1.59,1.59 0 0,0 2.46,12,1.52,1.52 0 0,0 4.11,10.7a8,8 0 0 1 6.66-6.61A1.42,1.42 0 0,0 12,2.69h0A1.57,1.57 0 0,0 10.14,1.16Z"/>
                </svg>
                {{ updating ? 'Actualizando...' : 'Registrar Recuento' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Toasts -->
      <Toast
        :show="showSuccessToast"
        type="success"
        title="¡Recuento registrado!"
        message="El stock del producto se actualizó correctamente"
        :duration="3000"
        @close="showSuccessToast = false"
      />

      <Toast
        :show="showErrorToast"
        type="error"
        title="Error al registrar"
        :message="errorMessage"
        :duration="4000"
        @close="showErrorToast = false"
      />

      <Toast
        :show="showCameraErrorToast"
        type="error"
        title="Error de cámara"
        :message="cameraErrorMessage"
        :duration="5000"
        @close="showCameraErrorToast = false"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import Toast from '../../components/common/Toast.vue'
import { useProducts } from '../../composables/useProducts.js'
import { BrowserQRCodeReader } from '@zxing/library'

const { products, loadProducts, updateProduct } = useProducts()

// Estado del escáner
const isScanning = ref(false)
const videoElement = ref(null)
const manualProductId = ref('')
const searching = ref(false)
const scanningMessage = ref('Centra el código QR en el marco')

// Instancia del lector QR
let codeReader = null
let scanningActive = false

// Producto actual
const currentProduct = ref(null)
const physicalCount = ref(null)
const countNotes = ref('')
const updating = ref(false)

// Toasts
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const errorMessage = ref('')
const showCameraErrorToast = ref(false)
const cameraErrorMessage = ref('')

// Computed
const hasDifference = computed(() => {
  return currentProduct.value && physicalCount.value !== null && physicalCount.value !== currentProduct.value.stock
})

const difference = computed(() => {
  if (!currentProduct.value || physicalCount.value === null) return 0
  return physicalCount.value - currentProduct.value.stock
})

// Métodos de escaneo
const startScanning = async () => {
  try {
    scanningMessage.value = 'Iniciando cámara...'
    
    // Verificar permisos y disponibilidad de cámara
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraErrorMessage.value = 'Tu navegador no soporta acceso a cámara'
      showCameraErrorToast.value = true
      return
    }

    // Inicializar lector QR si no existe
    if (!codeReader) {
      codeReader = new BrowserQRCodeReader()
    }

    // Listar dispositivos de video disponibles
    const videoInputDevices = await codeReader.listVideoInputDevices()
    
    if (videoInputDevices.length === 0) {
      cameraErrorMessage.value = 'No se encontró ninguna cámara en tu dispositivo'
      showCameraErrorToast.value = true
      return
    }

    // Buscar cámara trasera o usar la primera disponible
    let selectedDevice = videoInputDevices[0].deviceId
    
    // Intentar encontrar cámara trasera
    const backCamera = videoInputDevices.find(device => 
      device.label.toLowerCase().includes('back') || 
      device.label.toLowerCase().includes('rear') ||
      device.label.toLowerCase().includes('trasera')
    )
    
    if (backCamera) {
      selectedDevice = backCamera.deviceId
    }

    isScanning.value = true
    scanningActive = true
    scanningMessage.value = 'Centra el código QR en el marco'

    // Comenzar decodificación continua
    codeReader.decodeFromVideoDevice(
      selectedDevice,
      videoElement.value,
      (result, error) => {
        // Solo procesar si el escaneo está activo
        if (!scanningActive) return

        if (result) {
          handleQRCodeDetected(result.getText())
        }
      }
    )
  } catch (error) {
    
    if (error.name === 'NotAllowedError') {
      cameraErrorMessage.value = 'Permiso de cámara denegado. Por favor permite el acceso a la cámara.'
    } else if (error.name === 'NotFoundError') {
      cameraErrorMessage.value = 'No se encontró ninguna cámara en tu dispositivo'
    } else if (error.name === 'NotReadableError') {
      cameraErrorMessage.value = 'La cámara está siendo utilizada por otra aplicación'
    } else {
      cameraErrorMessage.value = `Error al acceder a la cámara: ${error.message}`
    }
    
    showCameraErrorToast.value = true
    stopScanning()
  }
}

const stopScanning = () => {
  
  isScanning.value = false
  scanningActive = false
  scanningMessage.value = 'Centra el código QR en el marco'
  
  // Detener el lector QR y resetear
  if (codeReader) {
    try {
      codeReader.reset()
    } catch (error) {
      console.error('⚠️ Error al detener escáner:', error)
    }
  }
  
  // Limpiar el video element
  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
}

const handleQRCodeDetected = async (qrText) => {
  
  // Detener escaneo inmediatamente para evitar múltiples lecturas
  scanningActive = false
  scanningMessage.value = '¡QR detectado! Buscando producto...'
  
  // Vibración si está disponible
  if (navigator.vibrate) {
    navigator.vibrate(200)
  }
  
  // Buscar el producto por el ID escaneado
  try {
    await loadProducts()
    
    const product = products.value.find(p => 
      p.productId?.toUpperCase() === qrText.toUpperCase()
    )
    
    if (product) {
      
      currentProduct.value = { ...product }
      physicalCount.value = product.stock
      countNotes.value = ''
      
      // Detener escaneo completamente
      stopScanning()
      
      // Scroll al formulario
      setTimeout(() => {
        const formElement = document.querySelector('form')
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    } else {
      
      errorMessage.value = `Producto con ID ${qrText} no encontrado`
      showErrorToast.value = true
      
      // Reactivar escaneo después de 2 segundos
      setTimeout(() => {
        if (isScanning.value) {
          scanningActive = true
          scanningMessage.value = 'Centra el código QR en el marco'
        }
      }, 2000)
    }
  } catch (error) {
    
    errorMessage.value = 'Error al buscar el producto escaneado'
    showErrorToast.value = true
    
    // Reactivar escaneo después de 2 segundos
    setTimeout(() => {
      if (isScanning.value) {
        scanningActive = true
        scanningMessage.value = 'Centra el código QR en el marco'
      }
    }, 2000)
  }
}

const searchProduct = async () => {
  if (!manualProductId.value) return
  
  searching.value = true
  
  try {
    await loadProducts()
    
    const product = products.value.find(p => 
      p.productId?.toUpperCase() === manualProductId.value.toUpperCase()
    )
    
    if (product) {
      currentProduct.value = { ...product }
      physicalCount.value = product.stock
      countNotes.value = ''
      manualProductId.value = ''
    } else {
      errorMessage.value = 'Producto no encontrado con ese ID'
      showErrorToast.value = true
    }
  } catch (error) {
    errorMessage.value = 'Error al buscar el producto'
    showErrorToast.value = true
  } finally {
    searching.value = false
  }
}

const updatePhysicalCount = async () => {
  if (!currentProduct.value || physicalCount.value === null) return
  
  updating.value = true
  
  try {
    await updateProduct(currentProduct.value.id, {
      ...currentProduct.value,
      stock: physicalCount.value
    })
    
    showSuccessToast.value = true
    clearProduct()
  } catch (error) {
    errorMessage.value = 'No se pudo actualizar el stock'
    showErrorToast.value = true
  } finally {
    updating.value = false
  }
}

const clearProduct = () => {
  currentProduct.value = null
  physicalCount.value = null
  countNotes.value = ''
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL').format(amount)
}

onMounted(async () => {
  await loadProducts()
})

onUnmounted(() => {
  if (isScanning.value) {
    stopScanning()
  }
  if (codeReader) {
    codeReader.reset()
    codeReader = null
  }
})
</script>

<style scoped>
@keyframes scan {
  0% {
    top: 0;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

.animate-scan {
  animation: scan 2s linear infinite;
}
</style>