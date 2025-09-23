<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Overlay -->
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="handleCancel"></div>

      <!-- Modal panel -->
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        
        <!-- Icon -->
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4" :class="iconBackgroundClass">
          <svg class="h-6 w-6" :class="iconColorClass" viewBox="0 0 24 24" fill="currentColor">
            <path v-if="type === 'warning'" d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
            <path v-else-if="type === 'danger'" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            <path v-else-if="type === 'info'" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            <path v-else d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5Z" />
          </svg>
        </div>

        <!-- Content -->
        <div class="text-center">
          <!-- Title -->
          <h3 class="text-lg font-medium text-gray-900 mb-2" id="modal-title">
            {{ title || defaultTitle }}
          </h3>
          
          <!-- Message -->
          <div class="text-sm text-gray-500 mb-6">
            <p v-if="message">{{ message }}</p>
            <div v-else-if="$slots.message" class="text-left">
              <slot name="message"></slot>
            </div>
            <p v-else>{{ defaultMessage }}</p>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>

        <!-- Buttons -->
        <div v-else class="flex flex-col sm:flex-row-reverse gap-3">
          <button
            @click="handleConfirm"
            :disabled="loading"
            class="w-full inline-flex justify-center rounded-lg border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :class="confirmButtonClass"
          >
            {{ confirmText || 'Confirmar' }}
          </button>
          
          <button
            @click="handleCancel"
            :disabled="loading"
            class="w-full inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cancelText || 'Cancelar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'warning', // 'warning', 'danger', 'info', 'success'
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  },
  confirmClass: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel'])

// Computed properties para estilos dinámicos
const iconBackgroundClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    info: 'bg-blue-100',
    success: 'bg-green-100'
  }
  return classes[props.type] || classes.warning
})

const iconColorClass = computed(() => {
  const classes = {
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
    success: 'text-green-600'
  }
  return classes[props.type] || classes.warning
})

const confirmButtonClass = computed(() => {
  if (props.confirmClass) {
    return props.confirmClass
  }
  
  const classes = {
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  }
  return classes[props.type] || classes.warning
})

const defaultTitle = computed(() => {
  const titles = {
    warning: '¿Estás seguro?',
    danger: 'Confirmar eliminación',
    info: 'Información',
    success: '¡Éxito!'
  }
  return titles[props.type] || titles.warning
})

const defaultMessage = computed(() => {
  const messages = {
    warning: 'Esta acción requiere confirmación.',
    danger: 'Esta acción no se puede deshacer.',
    info: 'Por favor confirma para continuar.',
    success: 'La operación se completó exitosamente.'
  }
  return messages[props.type] || messages.warning
})

// Methods
const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const handleCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}
</script>