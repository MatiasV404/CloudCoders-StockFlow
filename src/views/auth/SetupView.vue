<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
    <div class="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-2xl relative">
      
      <!-- Botón de cerrar sesión -->
      <button
        @click="showLogoutModal = true"
        class="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
        title="Cerrar sesión"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
        </svg>
        <span class="hidden sm:inline">Salir</span>
      </button>

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-3">
          <h1 class="text-3xl sm:text-4xl font-semibold text-blue-500 m-0">StockFlow</h1>
          <div class="text-2xl sm:text-3xl">📦</div>
        </div>
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          {{ step === 1 ? '¡Bienvenido!' : 'Confirma tu Rol' }}
        </h2>
        <p class="text-sm sm:text-base text-gray-600">
          {{ step === 1 ? 'Selecciona tu rol para comenzar' : 'Verifica tu información' }}
        </p>

        <!-- Información de la cuenta activa -->
        <div class="mt-4 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <div class="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm">
            {{ userInitial }}
          </div>
          <div class="text-left">
            <p class="text-xs text-gray-500 m-0">Configurando cuenta:</p>
            <p class="text-sm font-medium text-gray-800 m-0">{{ userEmail }}</p>
          </div>
        </div>
      </div>

      <!-- Step 1: Selección de Rol - SOLO 2 OPCIONES -->
      <div v-if="step === 1" class="space-y-6">
        
        <!-- Opción 1: Administrador - ACCESO COMPLETO -->
        <button
          @click="selectRole('admin')"
          class="w-full bg-white border-2 p-6 rounded-xl transition-all text-left hover:-translate-y-1 hover:shadow-lg"
          :class="selectedRole === 'admin' 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-blue-300'"
        >
          <div class="flex items-start gap-4">
            <div class="text-4xl flex-shrink-0">👔</div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800 mb-1">
                Administrador
              </h3>
              <p class="text-sm text-gray-600 mb-3">
                Acceso completo al sistema. Gestiona inventario, visualiza reportes y administra operarios.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">✓ Dashboard</span>
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">✓ Inventario</span>
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">✓ Reportes</span>
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">✓ Gestionar Operarios</span>
              </div>
            </div>
            <div v-if="selectedRole === 'admin'" class="text-blue-500 text-2xl flex-shrink-0">
              ✓
            </div>
          </div>
        </button>

        <!-- Opción 2: Operario - ACCESO LIMITADO -->
        <button
          @click="selectRole('operator')"
          class="w-full bg-white border-2 p-6 rounded-xl transition-all text-left hover:-translate-y-1 hover:shadow-lg"
          :class="selectedRole === 'operator' 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-200 hover:border-purple-300'"
        >
          <div class="flex items-start gap-4">
            <div class="text-4xl flex-shrink-0">🔧</div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800 mb-1">
                Operario
              </h3>
              <p class="text-sm text-gray-600 mb-3">
                Miembro del equipo. Gestiona productos y realiza recuento de inventario.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ Inventario</span>
                <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ Recuento</span>
                <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ Escaneo</span>
              </div>
            </div>
            <div v-if="selectedRole === 'operator'" class="text-purple-500 text-2xl flex-shrink-0">
              ✓
            </div>
          </div>
        </button>

        <!-- Botón Continuar -->
        <button
          @click="nextStep"
          :disabled="!selectedRole"
          class="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 text-base sm:text-lg"
        >
          Continuar
        </button>
      </div>

      <!-- Step 2: Confirmación/Código -->
      <div v-else-if="step === 2" class="space-y-6">
        
        <!-- Para Administradores: Mostrar código -->
        <div v-if="selectedRole === 'admin'" class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z" />
            </svg>
            Tu Código de Proyecto
          </h3>
          <div class="bg-white p-4 rounded-lg border-2 border-blue-300 mb-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-xs text-gray-600 mb-1">Comparte este código con tus operarios</p>
                <p class="text-3xl font-bold text-blue-600 tracking-wider font-mono">{{ generatedCode }}</p>
              </div>
              <button
                @click="copyCode"
                class="transition-colors flex items-center gap-2 px-4 py-2 rounded-lg"
                :class="codeCopied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'"
              >
                <svg v-if="!codeCopied" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                </svg>
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                </svg>
                <span class="hidden sm:inline">
                  {{ codeCopied ? '¡Copiado!' : 'Copiar' }}
                </span>
              </button>
            </div>
          </div>
          <div v-if="copyError" class="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
            </svg>
            No se pudo copiar el código
          </div>
          <p class="text-sm text-gray-600 mt-4">
            <strong>Importante:</strong> Guarda este código. Los operarios lo necesitarán para unirse a tu proyecto.
          </p>
        </div>

        <!-- Para Operarios: Solicitar código -->
        <div v-else class="space-y-4">
          <div class="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <svg class="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
              Código de Proyecto
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Solicita el código de proyecto a tu administrador para unirte al equipo.
            </p>
            <input
              v-model="projectCodeInput"
              type="text"
              placeholder="Ingresa el código (ej: A1B2C3D4)"
              maxlength="8"
              class="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase text-center text-xl font-bold tracking-wider font-mono"
              :class="{ 'border-red-500': codeError }"
            />
            <p v-if="codeError" class="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
              </svg>
              {{ codeError }}
            </p>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
          </svg>
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Botones -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="step = 1"
            :disabled="loading"
            class="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Volver
          </button>
          <button
            @click="confirmSetup"
            :disabled="loading || (selectedRole === 'operator' && !projectCodeInput)"
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,1A11,11 0 1 0 23,12A11,11 0 0 0 12,1Zm0,19a8,8 0 1 1 8-8A8,8 0 0 1 12,20Z" opacity=".25"/>
              <path d="M10.14,1.16a11,11 0 0 0-9,8.92A1.59,1.59 0 0 0 2.46,12,1.52,1.52 0 0,0 4.11,10.7a8,8 0 0 1 6.66-6.61A1.42,1.42 0 0 0 12,2.69h0A1.57,1.57 0 0 0 10.14,1.16Z"/>
            </svg>
            {{ loading ? 'Configurando...' : 'Finalizar Configuración' }}
          </button>
        </div>
      </div>

      <!-- Modal de Logout -->
      <ConfirmModal
        :show="showLogoutModal"
        type="warning"
        title="¿Cerrar sesión?"
        message="Perderás el progreso de configuración actual. ¿Estás seguro?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        :confirmClass="'bg-red-600 hover:bg-red-700 focus:ring-red-500'"
        :loading="loggingOut"
        @confirm="confirmLogout"
        @cancel="showLogoutModal = false"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../../composables/useAuth.js'
import { useRouter } from 'vue-router'
import ConfirmModal from '../../components/common/ConfirmModal.vue'

const { user, createUserProfile, verifyProjectCode, logout } = useAuth()
const router = useRouter()

// Estados principales
const step = ref(1)
const selectedRole = ref(null)
const projectCodeInput = ref('')
const codeError = ref('')
const error = ref('')
const loading = ref(false)
const generatedCode = ref('')

// Estados para copy code
const codeCopied = ref(false)
const copyError = ref(false)

// Estados para logout modal
const showLogoutModal = ref(false)
const loggingOut = ref(false)

// Computed properties
const userEmail = computed(() => {
  return user.value?.email || 'usuario@email.com'
})

const userInitial = computed(() => {
  const email = userEmail.value
  return email.charAt(0).toUpperCase()
})

// Función para generar código único
const generateUniqueCode = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 6)
  return (timestamp.substring(timestamp.length - 4) + random).toUpperCase()
}

// Función para seleccionar rol
const selectRole = (role) => {
  selectedRole.value = role
  codeError.value = ''
  error.value = ''

  // Generar código solo para admin
  if (role === 'admin') {
    generatedCode.value = generateUniqueCode()
  }
}

// Función para avanzar al siguiente paso
const nextStep = () => {
  if (selectedRole.value) {
    step.value = 2
  }
}

// Función para copiar código (CON FEEDBACK VISUAL)
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    codeCopied.value = true
    copyError.value = false
    setTimeout(() => {
      codeCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Error copiando código:', err)
    copyError.value = true
    setTimeout(() => {
      copyError.value = false
    }, 2000)
  }
}

// Función para confirmar logout (CON MODAL)
const confirmLogout = async () => {
  try {
    loggingOut.value = true
    await logout()
  } catch (err) {
    console.error('Error cerrando sesión:', err)
  } finally {
    loggingOut.value = false
    showLogoutModal.value = false
  }
}

const confirmSetup = async () => {
  loading.value = true
  error.value = ''
  codeError.value = ''

  try {
    if (selectedRole.value === 'operator') {
      if (!projectCodeInput.value || projectCodeInput.value.trim().length === 0) {
        codeError.value = 'Ingresa un código válido'
        loading.value = false
        return
      }

      const verification = await verifyProjectCode(projectCodeInput.value)
      
      if (!verification.valid) {
        codeError.value = verification.message
        loading.value = false
        return
      }

      await createUserProfile(selectedRole.value, projectCodeInput.value.trim().toUpperCase())
    } else {
      await createUserProfile(selectedRole.value, generatedCode.value)
    }

    if (selectedRole.value === 'operator') {
      await router.push('/inventory')
    } else {
      await router.push('/dashboard')
    }

  } catch (err) {
    console.error('Error en setup:', err)
    error.value = 'Error al configurar tu cuenta: ' + err.message
  } finally {
    loading.value = false
  }
}
</script>