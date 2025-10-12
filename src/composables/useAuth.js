import { ref, computed } from 'vue'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { auth, googleProvider, db } from '../firebase/firebase.js'
import { useRouter } from 'vue-router'

const user = ref(null)
const userProfile = ref(null)
const loading = ref(true)
const error = ref(null)
const authInitialized = ref(false)

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => userProfile.value?.role || null)
  const projectCode = computed(() => userProfile.value?.projectCode || null)
  const permissions = computed(() => userProfile.value?.permissions || {})

  const generateProjectCode = () => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 6)
    return (timestamp.substring(timestamp.length - 4) + random).toUpperCase()
  }

  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        userProfile.value = userDoc.data()
        return true
      }
      return false
    } catch (err) {
      console.error('Error cargando perfil:', err)
      return false
    }
  }

  // Solo actualizar estado, NO navegar desde aquí
  onAuthStateChanged(auth, async (firebaseUser) => {
    user.value = firebaseUser
    
    if (firebaseUser) {
      await loadUserProfile(firebaseUser.uid)
    } else {
      userProfile.value = null
    }
    
    loading.value = false
    authInitialized.value = true
  })

  const loginWithEmail = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      
      const result = await signInWithEmailAndPassword(auth, email, password)
      const hasProfile = await loadUserProfile(result.user.uid)
      
      if (hasProfile) {
        if (userProfile.value.role === 'operator') {
          await router.push('/inventory')
        } else {
          await router.push('/dashboard')
        }
      } else {
        await router.push('/setup')
      }
      
      return result
    } catch (err) {
      console.error('❌ Error en login:', err)
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
      await router.push('/setup')
      return result
    } catch (err) {
      console.error('❌ Error en registro:', err)
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
      const hasProfile = await loadUserProfile(result.user.uid)
      
      if (hasProfile) {
        if (userProfile.value.role === 'operator') {
          await router.push('/inventory')
        } else {
          await router.push('/dashboard')
        }
      } else {
        await router.push('/setup')
      }
      
      return result
    } catch (err) {
      console.error('❌ Error con Google:', err)
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUserProfile = async (role, projectCode = null) => {
    if (!user.value?.uid) {
      throw new Error('Usuario no autenticado')
    }

    try {
      const newProfile = {
        uid: user.value.uid,
        email: user.value.email,
        role,
        projectCode: projectCode || generateProjectCode(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        permissions: getRolePermissions(role)
      }

      await setDoc(doc(db, 'users', user.value.uid), newProfile)
      userProfile.value = newProfile
      
      return newProfile
    } catch (err) {
      console.error('❌ Error creando perfil:', err)
      throw err
    }
  }

  const verifyProjectCode = async (code) => {
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('projectCode', '==', code.toUpperCase()))
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return { valid: false, message: 'Código de proyecto no encontrado' }
      }

      const adminDoc = querySnapshot.docs[0]
      const adminData = adminDoc.data()

      if (adminData.role !== 'admin') {
        return { valid: false, message: 'Código inválido' }
      }

      return { 
        valid: true, 
        adminId: adminDoc.id,
        adminEmail: adminData.email 
      }
    } catch (err) {
      console.error('❌ Error verificando código:', err)
      return { valid: false, message: 'Error al verificar código: ' + err.message }
    }
  }

  const logout = async () => {
    try {
      user.value = null
      userProfile.value = null
      error.value = null
      
      await signOut(auth)
      await router.push('/login')
      window.location.reload()
    } catch (err) {
      console.error('❌ Error cerrando sesión:', err)
      error.value = getErrorMessage(err.code)
      
      await router.push('/login')
      window.location.reload()
    }
  }

  const getRolePermissions = (role) => {
    switch (role) {
      case 'admin':
        return {
          viewDashboard: true,
          manageProducts: true,
          manageOperators: true,
          viewReports: true
        }
      case 'operator':
        return {
          viewDashboard: false,
          manageProducts: true,
          manageOperators: false,
          viewReports: false
        }
      default:
        return {}
    }
  }

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
    }
    return errorMessages[errorCode] || 'Error de autenticación'
  }

  return {
    user,
    userProfile,
    userRole,
    projectCode,
    permissions,
    loading,
    error,
    authInitialized,
    isAuthenticated,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    createUserProfile,
    verifyProjectCode,
    logout
  }
}