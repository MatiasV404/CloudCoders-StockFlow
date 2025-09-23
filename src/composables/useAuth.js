import { ref, computed } from 'vue'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebase.js'
import { useRouter } from 'vue-router'

const user = ref(null)
const loading = ref(true)
const error = ref(null)

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!user.value)

  // Monitorear estado de autenticación
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    loading.value = false
  })

  const loginWithEmail = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      const result = await signInWithEmailAndPassword(auth, email, password)
      await router.push('/dashboard')
      return result
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  const registerWithEmail = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await router.push('/dashboard')
      return result
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
    try {
      error.value = null
      loading.value = true
      const result = await signInWithPopup(auth, googleProvider)
      await router.push('/dashboard')
      return result
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      await router.push('/login')
    } catch (err) {
      error.value = getErrorMessage(err.code)
    }
  }

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
    }
    return errorMessages[errorCode] || 'Error de autenticación'
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout
  }
}