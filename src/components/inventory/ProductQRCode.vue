<template>
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
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
        @click.self="handleClose"
      >
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
            class="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            @click.stop
          >
            <div class="p-6">
              <!-- Header -->
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-800">Código QR</h3>
                <button
                  @click="handleClose"
                  type="button"
                  class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>

              <!-- QR Code Content -->
              <div class="flex flex-col items-center gap-4">
                <!-- QR Code -->
                <div class="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-200">
                  <qrcode-vue
                    :value="qrValue"
                    :size="size"
                    level="H"
                    render-as="canvas"
                    :margin="1"
                    class="qr-code"
                  />
                </div>

                <!-- Product ID -->
                <div class="text-center w-full">
                  <p class="text-xs text-gray-500 mb-1">ID del Producto</p>
                  <div class="flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                    <code class="text-lg font-mono font-bold text-gray-800">{{ productId }}</code>
                    <button
                      @click="copyProductId"
                      class="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Copiar ID"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Product Name (opcional) -->
                <div v-if="productName" class="text-center">
                  <p class="text-sm font-medium text-gray-700">{{ productName }}</p>
                </div>

                <!-- Botones de acción -->
                <div class="flex gap-2 w-full">
                  <button
                    @click="downloadQR"
                    class="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                    </svg>
                    Descargar
                  </button>

                  <button
                    @click="printQR"
                    class="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />
                    </svg>
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>

  <!-- Toasts -->
  <Toast
    :show="showCopySuccessToast"
    type="success"
    title="¡ID copiado!"
    message="El ID se copió al portapapeles correctamente"
    :duration="2000"
    position="bottom-center"
    @close="showCopySuccessToast = false"
  />

  <Toast
    :show="showCopyErrorToast"
    type="error"
    title="Error al copiar"
    message="No se pudo copiar el ID al portapapeles"
    :duration="3000"
    position="bottom-center"
    @close="showCopyErrorToast = false"
  />

  <Toast
    :show="showDownloadErrorToast"
    type="error"
    title="Error al descargar"
    message="No se pudo descargar el código QR"
    :duration="3000"
    position="bottom-center"
    @close="showDownloadErrorToast = false"
  />

  <Toast
    :show="showPrintErrorToast"
    type="error"
    title="Error al imprimir"
    :message="printErrorMessage"
    :duration="3000"
    position="bottom-center"
    @close="showPrintErrorToast = false"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import Toast from '../common/Toast.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 250
  }
})

const emit = defineEmits(['close'])

// Estados para toasts
const showCopySuccessToast = ref(false)
const showCopyErrorToast = ref(false)
const showDownloadErrorToast = ref(false)
const showPrintErrorToast = ref(false)
const printErrorMessage = ref('')

const qrValue = computed(() => props.productId)

// Métodos
const handleClose = () => {
  emit('close')
}

const copyProductId = async () => {
  try {
    await navigator.clipboard.writeText(props.productId)
    showCopySuccessToast.value = true
  } catch (err) {
    console.error('Error copiando ID:', err)
    showCopyErrorToast.value = true
  }
}

const downloadQR = () => {
  try {
    const canvas = document.querySelector('.qr-code')
    if (!canvas) {
      console.error('No se encontró el canvas del QR')
      showDownloadErrorToast.value = true
      return
    }

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    const fileName = `QR-${props.productId}${props.productName ? `-${props.productName}` : ''}.png`
    link.download = fileName.replace(/[^a-z0-9.-]/gi, '_')
    link.href = url
    link.click()
  } catch (err) {
    console.error('Error descargando QR:', err)
    showDownloadErrorToast.value = true
  }
}

const printQR = () => {
  try {
    const canvas = document.querySelector('.qr-code')
    if (!canvas) {
      console.error('No se encontró el canvas del QR')
      printErrorMessage.value = 'No se pudo generar el código QR para imprimir'
      showPrintErrorToast.value = true
      return
    }

    const printWindow = window.open('', '_blank', 'width=600,height=800')
    if (!printWindow) {
      printErrorMessage.value = 'Por favor permite ventanas emergentes para imprimir'
      showPrintErrorToast.value = true
      return
    }

    const qrImageUrl = canvas.toDataURL('image/png')
    const productNameHtml = props.productName 
      ? '<p class="product-name">' + props.productName + '</p>' 
      : ''

    const htmlContent = '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
      '<title>QR - ' + (props.productName || props.productId) + '</title>' +
      '<style>' +
      '* { margin: 0; padding: 0; box-sizing: border-box; }' +
      'body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif; padding: 20px; }' +
      '.qr-container { text-align: center; padding: 30px; border: 2px solid #e5e7eb; border-radius: 12px; background: white; }' +
      '.qr-image { margin-bottom: 20px; }' +
      '.product-info { margin-top: 20px; }' +
      '.product-name { font-size: 20px; font-weight: bold; margin: 10px 0; color: #1f2937; }' +
      '.product-id { font-size: 28px; font-weight: bold; font-family: "Courier New", monospace; margin: 15px 0; color: #2563eb; letter-spacing: 2px; }' +
      '.footer { font-size: 12px; color: #6b7280; margin-top: 20px; }' +
      '@media print { body { margin: 0; padding: 0; } .qr-container { border: none; box-shadow: none; } }' +
      '</style>' +
      '</head>' +
      '<body>' +
      '<div class="qr-container">' +
      '<div class="qr-image">' +
      '<img src="' + qrImageUrl + '" alt="Código QR" />' +
      '</div>' +
      '<div class="product-info">' +
      productNameHtml +
      '<p class="product-id">' + props.productId + '</p>' +
      '<p class="footer">StockFlow - Sistema de Gestión de Inventario</p>' +
      '</div>' +
      '</div>' +
      '<script>' +
      'window.onload = function() {' +
      '  setTimeout(function() {' +
      '    window.print();' +
      '    window.onafterprint = function() { window.close(); };' +
      '  }, 250);' +
      '};' +
      '<\/script>' +
      '</body>' +
      '</html>'

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  } catch (err) {
    console.error('Error imprimiendo QR:', err)
    printErrorMessage.value = 'No se pudo imprimir el código QR'
    showPrintErrorToast.value = true
  }
}
</script>

<style scoped>
.qr-code {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>