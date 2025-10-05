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
const authInitialized = ref(false) // NUEVO: flag de inicialización

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => userProfile.value?.role || null)
  const projectCode = computed(() => userProfile.value?.projectCode || null)
  const permissions = computed(() => userProfile.value?.permissions || {})

  // Generar código corto y único
  const generateProjectCode = () => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 6)
    return (timestamp.substring(timestamp.length - 4) + random).toUpperCase()
  }

  // Cargar perfil de usuario desde Firestore
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

  // MEJORADO: Monitorear estado de autenticación
  onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('🔄 Auth state changed:', firebaseUser?.email || 'No user')
    
    user.value = firebaseUser
    
    if (firebaseUser) {
      const hasProfile = await loadUserProfile(firebaseUser.uid)
      
      // Si no tiene perfil y no está en setup, redirigir
      if (!hasProfile) {
        if (router.currentRoute.value.path !== '/setup' && router.currentRoute.value.path !== '/login') {
          console.log('👉 Usuario sin perfil, redirigiendo a /setup')
          await router.push('/setup')
        }
      }
    } else {
      // NUEVO: Limpiar perfil cuando no hay usuario
      userProfile.value = null
      
      // Si no está en rutas públicas, redirigir a login
      const publicRoutes = ['/login', '/']
      if (!publicRoutes.includes(router.currentRoute.value.path)) {
        console.log('👉 Usuario no autenticado, redirigiendo a /login')
        await router.push('/login')
      }
    }
    
    loading.value = false
    authInitialized.value = true // NUEVO: marcar como inicializado
  })

  const loginWithEmail = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      
      console.log('🔐 Intentando login con email:', email)
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Cargar perfil
      const hasProfile = await loadUserProfile(result.user.uid)
      
      if (hasProfile) {
        console.log('✅ Login exitoso, rol:', userProfile.value.role)
        // Redirigir según rol
        if (userProfile.value.role === 'operator') {
          await router.push('/inventory')
        } else {
          await router.push('/dashboard')
        }
      } else {
        console.log('⚠️ Usuario sin perfil, redirigiendo a setup')
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
      
      console.log('📝 Registrando nuevo usuario:', email)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      console.log('✅ Registro exitoso, redirigiendo a setup')
      // Redirigir a setup para configurar rol
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
      
      console.log('🔐 Intentando login con Google')
      const result = await signInWithPopup(auth, googleProvider)
      
      // Cargar perfil
      const hasProfile = await loadUserProfile(result.user.uid)
      
      if (hasProfile) {
        console.log('✅ Login Google exitoso, rol:', userProfile.value.role)
        // Redirigir según rol
        if (userProfile.value.role === 'operator') {
          await router.push('/inventory')
        } else {
          await router.push('/dashboard')
        }
      } else {
        console.log('⚠️ Usuario Google sin perfil, redirigiendo a setup')
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
      console.log('📄 Creando perfil de usuario:', { role, projectCode })
      
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
      
      console.log('✅ Perfil creado exitosamente')
      return newProfile
    } catch (err) {
      console.error('❌ Error creando perfil:', err)
      throw err
    }
  }

  const verifyProjectCode = async (code) => {
    console.log('🔍 Verificando código:', code.toUpperCase())
    
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('projectCode', '==', code.toUpperCase()))
      
      console.log('📡 Ejecutando query en Firestore...')
      const querySnapshot = await getDocs(q)
      console.log('📦 Resultados encontrados:', querySnapshot.size)
      
      if (querySnapshot.empty) {
        console.log('❌ Código no encontrado')
        return { valid: false, message: 'Código de proyecto no encontrado' }
      }

      const adminDoc = querySnapshot.docs[0]
      const adminData = adminDoc.data()
      
      console.log('✅ Admin encontrado:', {
        uid: adminDoc.id,
        email: adminData.email,
        role: adminData.role,
        projectCode: adminData.projectCode
      })

      if (adminData.role !== 'admin' && adminData.role !== 'admin_operator') {
        console.log('❌ Código no pertenece a un admin')
        return { valid: false, message: 'Código inválido' }
      }

      console.log('✅ Código válido')
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

  // MEJORADO: Logout con limpieza completa
  const logout = async () => {
    try {
      console.log('🚪 Cerrando sesión...')
      
      // Limpiar estado local primero
      user.value = null
      userProfile.value = null
      error.value = null
      
      // Cerrar sesión en Firebase
      await signOut(auth)
      
      console.log('✅ Sesión cerrada exitosamente')
      
      // Redirigir a login
      await router.push('/login')
      
      // NUEVO: Forzar recarga de la página para limpiar cualquier estado residual
      window.location.reload()
    } catch (err) {
      console.error('❌ Error cerrando sesión:', err)
      error.value = getErrorMessage(err.code)
      
      // Aún así, intentar redirigir
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
    authInitialized, // NUEVO: exportar flag de inicialización
    isAuthenticated,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    createUserProfile,
    verifyProjectCode,
    logout
  }
}