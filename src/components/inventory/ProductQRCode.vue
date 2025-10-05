<template>
  <div class="flex flex-col items-center gap-4 p-4">
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
    <div class="text-center">
      <p class="text-xs text-gray-500 mb-1">ID del Producto</p>
      <div class="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
        <code class="text-lg font-mono font-bold text-gray-800">{{ productId }}</code>
        <button
          @click="copyProductId"
          class="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
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
    <div class="flex gap-2">
      <button
        @click="downloadQR"
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
        </svg>
        Descargar QR
      </button>

      <button
        @click="printQR"
        class="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />
        </svg>
        Imprimir
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
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
    default: 200
  }
})

const qrValue = computed(() => props.productId)

const copyProductId = async () => {
  try {
    await navigator.clipboard.writeText(props.productId)
    alert('✓ ID copiado al portapapeles')
  } catch (err) {
    console.error('Error copiando ID:', err)
    alert('✗ No se pudo copiar el ID')
  }
}

const downloadQR = () => {
  try {
    const canvas = document.querySelector('.qr-code')
    if (!canvas) {
      console.error('No se encontró el canvas del QR')
      alert('✗ No se pudo descargar el QR')
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
    alert('✗ No se pudo descargar el QR')
  }
}

const printQR = () => {
  try {
    const canvas = document.querySelector('.qr-code')
    if (!canvas) {
      console.error('No se encontró el canvas del QR')
      alert('✗ No se pudo generar el QR para imprimir')
      return
    }

    const printWindow = window.open('', '_blank', 'width=600,height=800')
    if (!printWindow) {
      alert('✗ Por favor permite ventanas emergentes para imprimir')
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
    alert('✗ No se pudo imprimir el QR')
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