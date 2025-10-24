import { ref, computed } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  onSnapshot,
  getDoc
} from 'firebase/firestore'
import { db } from '../firebase/firebase.js'
import { useAuth } from './useAuth.js'
import { useMovements } from './useMovements.js' // ✅ IMPORTAR

export function useProducts() {
  const { user, userProfile } = useAuth()
  const { 
    logProductCreation, 
    logProductUpdate, 
    logProductDeletion 
  } = useMovements()
  
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const adminUserId = ref(null)

  // Categorías disponibles
  const categories = [
    'Electrónica',
    'Ropa',
    'Alimentos',
    'Hogar',
    'Deportes',
    'Juguetes',
    'Libros',
    'Salud',
    'Belleza',
    'Automotriz',
    'Mascotas',
    'Jardinería',
    'Oficina',
    'Bebés',
    'Música',
    'Herramientas',
    'Construcción',
    'Tecnología',
    'Muebles',
    'Otros'
  ]

  const statuses = [
    'Activo',
    'Inactivo',
    'Agotado',
    'Descontinuado'
  ]

  const generateProductId = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `PRD-${timestamp}-${random}`
  }

  // Buscar el UID del admin
  const findAdminUserId = async () => {
    if (!user.value?.uid || !userProfile.value?.projectCode) {
      return null
    }

    try {
      if (userProfile.value.role === 'admin') {
        return user.value.uid
      }

      const usersRef = collection(db, 'users')
      const q = query(
        usersRef, 
        where('projectCode', '==', userProfile.value.projectCode),
        where('role', '==', 'admin')
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id
      }

      return null
    } catch (err) {
      console.error('Error buscando admin:', err)
      return null
    }
  }

  const getProductsCollection = async () => {
    if (!adminUserId.value) {
      adminUserId.value = await findAdminUserId()
    }

    if (!adminUserId.value) {
      throw new Error('No se pudo encontrar el administrador del proyecto')
    }

    return collection(db, `users/${adminUserId.value}/products`)
  }

  // Stats computados
  const stats = computed(() => {
    const totalProducts = products.value.length
    const lowStock = products.value.filter(p => p.stock > 0 && p.stock <= (p.minStock || 5)).length
    const outOfStock = products.value.filter(p => p.stock === 0).length
    const totalValue = products.value.reduce((sum, p) => sum + (p.price * p.stock), 0)

    return {
      totalProducts,
      lowStock,
      outOfStock,
      totalValue
    }
  })

  // Cargar productos
  const loadProducts = async () => {
    try {
      loading.value = true
      error.value = null

      const productsRef = await getProductsCollection()
      const q = query(productsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      products.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      console.error('Error cargando productos:', err)
      error.value = 'Error al cargar productos'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Suscripción en tiempo real
  const subscribeToProducts = async () => {
    if (!user.value?.uid) {
      console.warn('⚠️ No se puede suscribir: usuario no autenticado')
      return null
    }

    try {
      const productsRef = await getProductsCollection()
      const q = query(productsRef, orderBy("createdAt", "desc"))

      const unsubscribeFn = onSnapshot(
        q,
        (querySnapshot) => {
          products.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        },
        (err) => {
          console.error("❌ Error en suscripción:", err)
          error.value = "Error al sincronizar productos: " + err.message
        }
      )

      return unsubscribeFn
    } catch (err) {
      console.error("❌ Error suscribiéndose a productos:", err)
      error.value = "Error al suscribirse: " + err.message
      return null
    }
  }

  const addProduct = async (productData) => {
    if (!user.value?.uid) {
      throw new Error('Usuario no autenticado')
    }

    try {
      loading.value = true
      error.value = null

      const productsRef = await getProductsCollection()
      
      const productId = generateProductId()
      
      const newProduct = {
        ...productData,
        productId,
        createdAt: new Date(),
        updatedAt: new Date(),
        addedBy: user.value.uid,
        userId: adminUserId.value
      }

      const docRef = await addDoc(productsRef, newProduct)
      
      await logProductCreation(newProduct, docRef.id)
      
      return docRef.id
      
    } catch (err) {
      console.error('Error agregando producto:', err)
      error.value = 'Error al agregar producto'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (productId, productData) => {
    if (!user.value?.uid) {
      throw new Error('Usuario no autenticado')
    }

    try {
      loading.value = true
      error.value = null

      const productsRef = await getProductsCollection()
      const productRef = doc(productsRef, productId)

      const oldProductSnap = await getDoc(productRef)
      const oldProduct = oldProductSnap.data()

      const updatedData = {
        ...productData,
        updatedAt: new Date(),
        updatedBy: user.value.uid
      }

      await updateDoc(productRef, updatedData)
      
      const newProduct = { ...oldProduct, ...updatedData }
      await logProductUpdate(oldProduct, newProduct, productId)
      
    } catch (err) {
      console.error('Error actualizando producto:', err)
      error.value = 'Error al actualizar producto'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (productId) => {
    if (!user.value?.uid) {
      throw new Error('Usuario no autenticado')
    }

    try {
      loading.value = true
      error.value = null

      const productsRef = await getProductsCollection()
      const productRef = doc(productsRef, productId)

      const productSnap = await getDoc(productRef)
      const productData = productSnap.data()

      await deleteDoc(productRef)
      
      await logProductDeletion(productData, productId)
      
    } catch (err) {
      console.error('Error eliminando producto:', err)
      error.value = 'Error al eliminar producto'
      throw err
    } finally {
      loading.value = false
    }
  }

  const findProductByProductId = (productId) => {
    return products.value.find(p => p.productId === productId)
  }

  // Buscar productos
  const searchProducts = (searchTerm) => {
    const term = searchTerm.toLowerCase()
    return products.value.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.code?.toLowerCase().includes(term) ||
      product.sku?.toLowerCase().includes(term) ||
      product.productId?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term)
    )
  }

  return {
    products,
    loading,
    error,
    categories,
    statuses,
    stats,
    loadProducts,
    subscribeToProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    findProductByProductId
  }
}