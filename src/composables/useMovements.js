import { ref, computed } from 'vue'
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit,
  getDocs,
  where,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase/firebase.js'
import { useAuth } from './useAuth.js'

export function useMovements() {
  const { user, userProfile } = useAuth()
  
  const movements = ref([])
  const loading = ref(false)
  const error = ref(null)

  const MOVEMENT_TYPES = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    CYCLE_COUNT: 'CYCLE_COUNT'
  }

  const normalizeCode = (code) => {
    if (!code) return ''
    
    return code
      .trim()
      .toUpperCase()
      .replace(/^PRD-?/i, '')
      .replace(/[^A-Z0-9]/g, '')
  }

  const generateMovementId = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `MOV-${timestamp}-${random}`
  }

  const findAdminUserId = async () => {
    if (!user.value?.uid || !userProfile.value?.projectCode) {
      return null
    }

    if (userProfile.value.role === 'admin') {
      return user.value.uid
    }

    const normalizedOperatorCode = normalizeCode(userProfile.value.projectCode)

    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('role', '==', 'admin'))
    const querySnapshot = await getDocs(q)

    for (const doc of querySnapshot.docs) {
      const userData = doc.data()
      if (userData.projectCode) {
        const normalizedAdminCode = normalizeCode(userData.projectCode)
        
        if (normalizedAdminCode === normalizedOperatorCode) {
          return doc.id
        }
      }
    }

    return null
  }

  const logProductCreation = async (productData, productId) => {
    try {
      const adminUserId = await findAdminUserId()
      if (!adminUserId) {
        throw new Error('No se pudo encontrar el administrador')
      }

      const movementsRef = collection(db, `users/${adminUserId}/movements`)
      
      const movement = {
        movementId: generateMovementId(),
        type: MOVEMENT_TYPES.CREATE,
        productId: productData.productId,
        productName: productData.name,
        userId: user.value.uid,
        userName: user.value.displayName || user.value.email?.split('@')[0] || 'Usuario',
        userEmail: user.value.email,
        userRole: userProfile.value.role,
        timestamp: Timestamp.now(),
        changes: {
          created: {
            code: productData.code || null,
            sku: productData.sku || null,
            name: productData.name,
            description: productData.description || null,
            category: productData.category,
            status: productData.status,
            stock: productData.stock,
            minStock: productData.minStock,
            price: productData.price,
            cost: productData.cost || 0
          }
        },
        metadata: {
          action: 'Producto creado',
          description: `Se creó el producto "${productData.name}" con stock inicial de ${productData.stock} unidades`,
          firestoreDocId: productId
        }
      }

      await addDoc(movementsRef, movement)
      console.log('Movimiento de creación registrado:', movement.movementId)
    } catch (err) {
      console.error('Error registrando creación:', err)
    }
  }

  const logProductUpdate = async (oldProduct, newProduct, productId) => {
    try {
      const adminUserId = await findAdminUserId()
      if (!adminUserId) {
        throw new Error('No se pudo encontrar el administrador')
      }

      const changes = {}
      const fields = ['code', 'sku', 'name', 'description', 'category', 'status', 'stock', 'minStock', 'price', 'cost']
      
      fields.forEach(field => {
        if (oldProduct[field] !== newProduct[field]) {
          changes[field] = {
            before: oldProduct[field],
            after: newProduct[field]
          }
        }
      })

      if (Object.keys(changes).length === 0) {
        console.log('No hay cambios que registrar')
        return
      }

      const movementsRef = collection(db, `users/${adminUserId}/movements`)
      
      const changeDescriptions = Object.entries(changes).map(([field, change]) => {
        const fieldNames = {
          code: 'Código',
          sku: 'SKU',
          name: 'Nombre',
          description: 'Descripción',
          category: 'Categoría',
          status: 'Estado',
          stock: 'Stock',
          minStock: 'Stock Mínimo',
          price: 'Precio',
          cost: 'Costo'
        }
        return `${fieldNames[field]}: ${change.before} → ${change.after}`
      }).join(', ')

      const movement = {
        movementId: generateMovementId(),
        type: MOVEMENT_TYPES.UPDATE,
        productId: oldProduct.productId,
        productName: newProduct.name,
        userId: user.value.uid,
        userName: user.value.displayName || user.value.email?.split('@')[0] || 'Usuario',
        userEmail: user.value.email,
        userRole: userProfile.value.role,
        timestamp: Timestamp.now(),
        changes: changes,
        metadata: {
          action: 'Producto actualizado',
          description: `Se actualizó el producto "${newProduct.name}". Cambios: ${changeDescriptions}`,
          firestoreDocId: productId,
          changesCount: Object.keys(changes).length
        }
      }

      await addDoc(movementsRef, movement)
      console.log('Movimiento de actualización registrado:', movement.movementId)
    } catch (err) {
      console.error('Error registrando actualización:', err)
    }
  }

  const logProductDeletion = async (productData, productId) => {
    try {
      const adminUserId = await findAdminUserId()
      if (!adminUserId) {
        throw new Error('No se pudo encontrar el administrador')
      }

      const movementsRef = collection(db, `users/${adminUserId}/movements`)
      
      const movement = {
        movementId: generateMovementId(),
        type: MOVEMENT_TYPES.DELETE,
        productId: productData.productId,
        productName: productData.name,
        userId: user.value.uid,
        userName: user.value.displayName || user.value.email?.split('@')[0] || 'Usuario',
        userEmail: user.value.email,
        userRole: userProfile.value.role,
        timestamp: Timestamp.now(),
        changes: {
          deleted: {
            code: productData.code || null,
            sku: productData.sku || null,
            name: productData.name,
            description: productData.description || null,
            category: productData.category,
            status: productData.status,
            stock: productData.stock,
            minStock: productData.minStock,
            price: productData.price,
            cost: productData.cost || 0
          }
        },
        metadata: {
          action: 'Producto eliminado',
          description: `Se eliminó el producto "${productData.name}". Stock al momento de eliminación: ${productData.stock} unidades`,
          firestoreDocId: productId,
          valueLost: productData.price * productData.stock
        }
      }

      await addDoc(movementsRef, movement)
      console.log('Movimiento de eliminación registrado:', movement.movementId)
    } catch (err) {
      console.error('Error registrando eliminación:', err)
    }
  }

  const logCyclicCount = async (productData, oldStock, newStock, notes = '') => {
    try {
      const adminUserId = await findAdminUserId()
      if (!adminUserId) {
        throw new Error('No se pudo encontrar el administrador')
      }

      const movementsRef = collection(db, `users/${adminUserId}/movements`)
      
      const difference = newStock - oldStock
      
      const movement = {
        movementId: generateMovementId(),
        type: MOVEMENT_TYPES.CYCLE_COUNT,
        productId: productData.productId,
        productName: productData.name,
        userId: user.value.uid,
        userName: user.value.displayName || user.value.email?.split('@')[0] || 'Usuario',
        userEmail: user.value.email,
        userRole: userProfile.value.role,
        timestamp: Timestamp.now(),
        changes: {
          stock: {
            before: oldStock,
            after: newStock,
            difference: difference,
            differenceType: difference > 0 ? 'SURPLUS' : difference < 0 ? 'SHORTAGE' : 'MATCH'
          },
          notes: notes || 'Sin observaciones'
        },
        metadata: {
          action: 'Conteo cíclico',
          description: difference === 0 
            ? `Conteo del producto "${productData.name}". Stock coincide: ${newStock} unidades`
            : `Conteo del producto "${productData.name}". ${difference > 0 ? 'Excedente' : 'Faltante'} de ${Math.abs(difference)} unidades (${oldStock} → ${newStock})`,
          firestoreDocId: productData.id,
          notes: notes,
          difference: difference,
          percentageDifference: oldStock > 0 ? ((difference / oldStock) * 100).toFixed(2) : 0
        }
      }

      await addDoc(movementsRef, movement)
      console.log('Movimiento de conteo cíclico registrado:', movement.movementId)
    } catch (err) {
      console.error('Error registrando conteo cíclico:', err)
    }
  }

  const loadMovements = async (limitCount = 50, productId = null) => {
    try {
      loading.value = true
      error.value = null

      const adminUserId = await findAdminUserId()
      if (!adminUserId) {
        throw new Error('No se pudo encontrar el administrador')
      }

      const movementsRef = collection(db, `users/${adminUserId}/movements`)
      
      let q = query(
        movementsRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      )

      if (productId) {
        q = query(
          movementsRef,
          where('productId', '==', productId),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        )
      }

      const querySnapshot = await getDocs(q)
      
      movements.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }))

      return movements.value
    } catch (err) {
      console.error('Error cargando movimientos:', err)
      error.value = 'Error al cargar el historial'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getMovementStats = computed(() => {
    const total = movements.value.length
    const byType = {
      CREATE: movements.value.filter(m => m.type === MOVEMENT_TYPES.CREATE).length,
      UPDATE: movements.value.filter(m => m.type === MOVEMENT_TYPES.UPDATE).length,
      DELETE: movements.value.filter(m => m.type === MOVEMENT_TYPES.DELETE).length,
      CYCLE_COUNT: movements.value.filter(m => m.type === MOVEMENT_TYPES.CYCLE_COUNT).length
    }

    return {
      total,
      byType
    }
  })

  return {
    movements,
    loading,
    error,
    MOVEMENT_TYPES,
    logProductCreation,
    logProductUpdate,
    logProductDeletion,
    logCyclicCount,
    loadMovements,
    getMovementStats
  }
}