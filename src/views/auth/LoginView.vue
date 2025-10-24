<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
    <div class="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md min-h-[500px] flex flex-col">
      <!-- Logo y título con indicador de modo -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-3">
          <h1 class="text-4xl font-semibold text-blue-500 m-0">StockFlow</h1>
          <div class="text-3xl">📦</div>
        </div>
        
        <!-- Indicador visual del modo actual -->
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer" 
               :class="!isRegisterMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
               @click="isRegisterMode = false">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <span class="text-sm font-medium">Iniciar sesión</span>
          </div>
          
          <div class="w-px h-6 bg-gray-300"></div>
          
          <div class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer"
               :class="isRegisterMode ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
               @click="isRegisterMode = true">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
            </svg>
            <span class="text-sm font-medium">Registro</span>
          </div>
        </div>
        
        <!-- Título dinámico -->
        <h2 class="text-xl font-semibold text-gray-800 m-0 transition-all duration-300">
          {{ isRegisterMode ? '¡Únete a StockFlow!' : '¡Bienvenido de vuelta!' }}
        </h2>
        <p class="text-sm text-gray-600 mt-1 transition-all duration-300">
          {{ isRegisterMode ? 'Crea tu cuenta para comenzar' : 'Inicia sesión en tu cuenta' }}
        </p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="flex-1 flex flex-col gap-5">
        <!-- Campo de email con icono -->
        <div class="flex flex-col gap-2">
          <label for="email" class="font-medium text-gray-700 text-sm flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
            </svg>
            {{ isRegisterMode ? 'Email:' : 'Usuario:' }}
          </label>
          <div class="relative">
            <input
              id="email"
              v-model="email"
              type="email"
              :placeholder="isRegisterMode ? 'Ingresa tu email' : 'Ingresa tu email'"
              required
              :disabled="loading"
              class="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
            </svg>
          </div>
        </div>

        <!-- Campo de contraseña con icono y toggle de visibilidad -->
        <div class="flex flex-col gap-2">
          <label for="password" class="font-medium text-gray-700 text-sm flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
            </svg>
            Contraseña:
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="isRegisterMode ? 'Crea una contraseña segura' : 'Ingresa tu contraseña'"
              required
              :disabled="loading"
              class="w-full px-4 py-3 pl-10 pr-12 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <!-- Icono de candado -->
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
            </svg>
            <!-- Botón toggle mostrar/ocultar contraseña -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
              :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <!-- Icono ojo abierto (mostrar) -->
              <svg v-if="!showPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
              </svg>
              <!-- Icono ojo cerrado (ocultar) -->
              <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirmar contraseña solo para registro -->
        <div v-if="isRegisterMode" class="flex flex-col gap-2">
          <label for="confirmPassword" class="font-medium text-gray-700 text-sm flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
            </svg>
            Confirmar Contraseña:
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirma tu contraseña"
              required
              :disabled="loading"
              class="w-full px-4 py-3 pl-10 pr-12 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <!-- Icono de candado -->
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
            </svg>
            <!-- Botón toggle mostrar/ocultar confirmación de contraseña -->
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
              :title="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <!-- Icono ojo abierto (mostrar) -->
              <svg v-if="!showConfirmPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
              </svg>
              <!-- Icono ojo cerrado (ocultar) -->
              <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Checkbox "Guardar Sesión" solo para login -->
        <div v-if="!isRegisterMode" class="flex items-center gap-2">
          <label class="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input v-model="rememberMe" type="checkbox" class="m-0 w-auto accent-blue-500" />
            Guardar Sesión
          </label>
        </div>

        <div class="flex flex-col gap-3 mt-2">
          <!-- Botón principal con colores diferenciados -->
          <button 
            type="submit" 
            :disabled="loading || (isRegisterMode && password !== confirmPassword)"
            class="border-0 px-5 py-3 rounded-lg text-base font-medium cursor-pointer transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            :class="isRegisterMode 
              ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300' 
              : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300'"
          >
            <svg v-if="isRegisterMode" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
            </svg>
            <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
            </svg>
            
            <span v-if="loading">
              {{ isRegisterMode ? 'Creando cuenta...' : 'Iniciando sesión...' }}
            </span>
            <span v-else>
              {{ isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión' }}
            </span>
          </button>

          <!-- Google button -->
          <button 
            type="button" 
            @click="handleGoogleLogin" 
            :disabled="loading"
            class="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:border-blue-500"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {{ isRegisterMode ? 'Registrarse con Google' : 'Continuar con Google' }}
          </button>

          <!-- Toggle button con mejor visual -->
          <button 
            type="button" 
            @click="toggleRegister" 
            class="bg-transparent border-2 px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center justify-center gap-2"
            :class="isRegisterMode 
              ? 'text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white' 
              : 'text-green-600 border-green-600 hover:bg-green-600 hover:text-white'"
          >
            <svg v-if="isRegisterMode" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" />
            </svg>
            {{ isRegisterMode ? 'Ya tengo cuenta' : '¿No tienes cuenta? Regístrate' }}
          </button>
        </div>

        <!-- Error message con mejor styling -->
        <div v-if="error" class="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center border border-red-200 flex items-center gap-2 justify-center">
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
          </svg>
          {{ error }}
        </div>

        <!-- Validation message para confirmar contraseña -->
        <div v-if="isRegisterMode && password && confirmPassword && password !== confirmPassword" 
             class="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm text-center border border-yellow-200 flex items-center gap-2 justify-center">
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
          </svg>
          Las contraseñas no coinciden
        </div>
      </form>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500 m-0 leading-relaxed">
          Contacto de Soporte +56 9 7777 5555 / 9 5454 5488 - Correo: stockflowsupport@stockflow.com
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth.js'

const { loginWithEmail, registerWithEmail, loginWithGoogle, loading, error } = useAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const rememberMe = ref(false)
const isRegisterMode = ref(false)

// Estados para mostrar/ocultar contraseñas
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleLogin = async () => {
  // Validación para registro
  if (isRegisterMode.value && password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  try {
    if (isRegisterMode.value) {
      await registerWithEmail(email.value, password.value)
    } else {
      await loginWithEmail(email.value, password.value)
    }
  } catch (err) {
    console.error('Error en autenticación:', err)
  }
}

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle()
  } catch (err) {
    console.error('Error con Google:', err)
  }
}

const toggleRegister = () => {
  isRegisterMode.value = !isRegisterMode.value
  error.value = null
  confirmPassword.value = ''
  // Reset password visibility cuando cambias de modo
  showPassword.value = false
  showConfirmPassword.value = false
}
</script>