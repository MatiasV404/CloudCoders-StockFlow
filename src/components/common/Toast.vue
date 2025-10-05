<template>
  <Transition
    enter-active-class="transition ease-out duration-300 transform"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="show"
      class="fixed z-50 flex items-center gap-3 px-4 sm:px-6 py-4 rounded-lg shadow-2xl max-w-sm sm:max-w-md"
      :class="[positionClasses, toastClasses]"
      role="alert"
    >
      <!-- Icono -->
      <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path v-if="type === 'success'" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5Z" />
        <path v-else-if="type === 'error'" d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
        <path v-else-if="type === 'warning'" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        <path v-else d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
      </svg>

      <!-- Contenido -->
      <div class="flex-1 min-w-0">
        <p v-if="title" class="font-semibold text-sm sm:text-base">{{ title }}</p>
        <p v-if="message" class="text-xs sm:text-sm" :class="{ 'mt-0.5': title }">{{ message }}</p>
      </div>

      <!-- Botón cerrar -->
      <button
        v-if="closable"
        @click="$emit('close')"
        class="flex-shrink-0 p-1 rounded transition-colors"
        :class="closeButtonClass"
        aria-label="Cerrar"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  closable: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(value)
  }
})

const emit = defineEmits(['close'])

// Computed classes
const positionClasses = computed(() => {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  }
  return positions[props.position]
})

const toastClasses = computed(() => {
  const classes = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  }
  return classes[props.type]
})

const closeButtonClass = computed(() => {
  const classes = {
    success: 'hover:bg-green-600',
    error: 'hover:bg-red-600',
    warning: 'hover:bg-yellow-600',
    info: 'hover:bg-blue-600'
  }
  return classes[props.type]
})

// Auto-close
watch(() => props.show, (newVal) => {
  if (newVal && props.duration > 0) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})
</script>