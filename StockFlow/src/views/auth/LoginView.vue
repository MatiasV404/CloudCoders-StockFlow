<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
    <div class="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md min-h-[500px] flex flex-col">
      <!-- Logo y título -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2">
          <h1 class="text-4xl font-semibold text-blue-500 m-0">StockFlow</h1>
          <div class="text-3xl">📦</div>
        </div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="flex-1 flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <label for="email" class="font-medium text-gray-700 text-sm">Usuario:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Ingresa tu email"
            required
            :disabled="loading"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="password" class="font-medium text-gray-700 text-sm">Contraseña:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            required
            :disabled="loading"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div class="flex items-center gap-2">
          <label class="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input v-model="rememberMe" type="checkbox" class="m-0 w-auto" />
            Guardar Sesión
          </label>
        </div>

        <div class="flex flex-col gap-3 mt-2">
          <button 
            type="submit" 
            :disabled="loading"
            class="bg-blue-500 text-white border-0 px-5 py-3 rounded-lg text-base font-medium cursor-pointer transition-colors hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Iniciando...</span>
            <span v-else>Iniciar sesión</span>
          </button>

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
            Continuar con Google
          </button>

          <button 
            type="button" 
            @click="toggleRegister" 
            class="bg-transparent text-blue-500 border-2 border-blue-500 px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-blue-500 hover:text-white"
          >
            {{ isRegisterMode ? 'Ya tengo cuenta' : 'Registro' }}
          </button>
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
          {{ error }}
        </div>
      </form>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500 m-0 leading-relaxed">
          Contacto de Soporte +56 9 7777 5555 / 9 5454 5488 - Correo: WorkFlowSupport@Correo.com
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
const rememberMe = ref(false)
const isRegisterMode = ref(false)

const handleLogin = async () => {
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
}
</script>