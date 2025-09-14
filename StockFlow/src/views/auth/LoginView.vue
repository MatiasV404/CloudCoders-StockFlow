<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo y título -->
      <div class="header">
        <div class="logo">
          <h1 class="brand">StockFlow</h1>
          <div class="logo-icon">📦</div>
        </div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Usuario:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Ingresa tu email"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input v-model="rememberMe" type="checkbox" />
            <span class="checkmark"></span>
            Guardar Sesión
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading">Iniciando...</span>
            <span v-else>Iniciar sesión</span>
          </button>

          <button type="button" @click="handleGoogleLogin" class="btn-google" :disabled="loading">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <button type="button" @click="toggleRegister" class="btn-secondary">
            {{ isRegisterMode ? 'Ya tengo cuenta' : 'Registro' }}
          </button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <!-- Footer -->
      <div class="footer">
        <p>Contacto de Soporte +56 9 7777 5555 / 9 5454 5488 - Correo: WorkFlowSuport@Correo.com</p>
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

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.brand {
  font-size: 2.5rem;
  font-weight: 600;
  color: #4285f4;
  margin: 0;
}

.logo-icon {
  font-size: 2rem;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4285f4;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-options {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
}

.checkbox-container input[type="checkbox"] {
  margin: 0;
  width: auto;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

.btn-primary {
  background: #4285f4;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #3367d6;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: white;
  border: 2px solid #e1e5e9;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.3s;
}

.btn-google:hover:not(:disabled) {
  border-color: #4285f4;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.btn-secondary {
  background: transparent;
  color: #4285f4;
  border: 2px solid #4285f4;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #4285f4;
  color: white;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #fcc;
}

.footer {
  margin-top: 30px;
  text-align: center;
}

.footer p {
  font-size: 0.75rem;
  color: #888;
  margin: 0;
  line-height: 1.4;
}

/* Responsivo */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .brand {
    font-size: 2rem;
  }
  
  .footer p {
    font-size: 0.7rem;
  }
}
</style>