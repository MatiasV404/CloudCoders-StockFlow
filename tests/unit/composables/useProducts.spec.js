import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Mock de useAuth
vi.mock('../../../src/composables/useAuth.js', () => ({
  useAuth: () => ({
    user: { value: { uid: 'test-user-123' } },
    userProfile: { value: { role: 'admin', projectCode: 'TEST123' } }
  })
}))

// Mock de useMovements
vi.mock('../../../src/composables/useMovements.js', () => ({
  useMovements: () => ({
    logProductCreation: vi.fn(),
    logProductUpdate: vi.fn(),
    logProductDeletion: vi.fn()
  })
}))

// Mock de Firebase Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-doc-id' }),
  updateDoc: vi.fn().mockResolvedValue(),
  deleteDoc: vi.fn().mockResolvedValue(),
  doc: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ docs: [] }),
  getDoc: vi.fn().mockResolvedValue({ exists: () => true, data: () => ({}) }),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn()
}))

// Importar después de los mocks
import { useProducts } from '../../../src/composables/useProducts.js'

describe('useProducts composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Categorías', () => {
    it('debería tener una lista de categorías predefinidas', () => {
      const { categories } = useProducts()
      
      expect(categories).toBeDefined()
      expect(Array.isArray(categories)).toBe(true)
      expect(categories.length).toBeGreaterThan(0)
    })

    it('debería incluir categorías específicas', () => {
      const { categories } = useProducts()
      
      expect(categories).toContain('Electrónica')
      expect(categories).toContain('Ropa')
      expect(categories).toContain('Alimentos')
      expect(categories).toContain('Hogar')
    })

    it('debería tener 20 categorías', () => {
      const { categories } = useProducts()
      
      expect(categories.length).toBe(20)
    })
  })

  describe('Estados de producto', () => {
    it('debería tener una lista de estados predefinidos', () => {
      const { statuses } = useProducts()
      
      expect(statuses).toBeDefined()
      expect(Array.isArray(statuses)).toBe(true)
    })

    it('debería incluir todos los estados necesarios', () => {
      const { statuses } = useProducts()
      
      expect(statuses).toContain('Activo')
      expect(statuses).toContain('Inactivo')
      expect(statuses).toContain('Agotado')
      expect(statuses).toContain('Descontinuado')
    })

    it('debería tener exactamente 4 estados', () => {
      const { statuses } = useProducts()
      
      expect(statuses.length).toBe(4)
    })
  })

  describe('Estados reactivos', () => {
    it('debería inicializar products como array vacío', () => {
      const { products } = useProducts()
      
      expect(products.value).toEqual([])
    })

    it('debería inicializar loading como false', () => {
      const { loading } = useProducts()
      
      expect(loading.value).toBe(false)
    })

    it('debería inicializar error como null', () => {
      const { error } = useProducts()
      
      expect(error.value).toBeNull()
    })
  })

  describe('Estadísticas computadas', () => {
    it('debería calcular totalProducts como 0 con array vacío', () => {
      const { stats } = useProducts()
      
      expect(stats.value.totalProducts).toBe(0)
    })

    it('debería calcular lowStock como 0 con array vacío', () => {
      const { stats } = useProducts()
      
      expect(stats.value.lowStock).toBe(0)
    })

    it('debería calcular outOfStock como 0 con array vacío', () => {
      const { stats } = useProducts()
      
      expect(stats.value.outOfStock).toBe(0)
    })

    it('debería calcular totalValue como 0 con array vacío', () => {
      const { stats } = useProducts()
      
      expect(stats.value.totalValue).toBe(0)
    })
  })

  describe('Funciones exportadas', () => {
    it('debería exportar loadProducts como función', () => {
      const { loadProducts } = useProducts()
      
      expect(typeof loadProducts).toBe('function')
    })

    it('debería exportar subscribeToProducts como función', () => {
      const { subscribeToProducts } = useProducts()
      
      expect(typeof subscribeToProducts).toBe('function')
    })

    it('debería exportar addProduct como función', () => {
      const { addProduct } = useProducts()
      
      expect(typeof addProduct).toBe('function')
    })

    it('debería exportar updateProduct como función', () => {
      const { updateProduct } = useProducts()
      
      expect(typeof updateProduct).toBe('function')
    })

    it('debería exportar deleteProduct como función', () => {
      const { deleteProduct } = useProducts()
      
      expect(typeof deleteProduct).toBe('function')
    })
  })
})
