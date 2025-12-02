import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de useAuth
vi.mock('../../../src/composables/useAuth.js', () => ({
  useAuth: () => ({
    user: { value: { uid: 'test-user-123', displayName: 'Test User', email: 'test@example.com' } },
    userProfile: { value: { role: 'admin', projectCode: 'TEST123' } }
  })
}))

// Mock de Firebase Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-movement-id' }),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ docs: [] }),
  where: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ seconds: Date.now() / 1000 }))
  }
}))

// Importar después de los mocks
import { useMovements } from '../../../src/composables/useMovements.js'

describe('useMovements composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estados reactivos', () => {
    it('debería inicializar movements como array vacío', () => {
      const { movements } = useMovements()
      
      expect(movements.value).toEqual([])
    })

    it('debería inicializar loading como false', () => {
      const { loading } = useMovements()
      
      expect(loading.value).toBe(false)
    })

    it('debería inicializar error como null', () => {
      const { error } = useMovements()
      
      expect(error.value).toBeNull()
    })
  })

  describe('Funciones de logging', () => {
    it('debería exportar logProductCreation como función', () => {
      const { logProductCreation } = useMovements()
      
      expect(typeof logProductCreation).toBe('function')
    })

    it('debería exportar logProductUpdate como función', () => {
      const { logProductUpdate } = useMovements()
      
      expect(typeof logProductUpdate).toBe('function')
    })

    it('debería exportar logProductDeletion como función', () => {
      const { logProductDeletion } = useMovements()
      
      expect(typeof logProductDeletion).toBe('function')
    })

    it('debería exportar logCyclicCount como función', () => {
      const { logCyclicCount } = useMovements()
      
      expect(typeof logCyclicCount).toBe('function')
    })
  })

  describe('Funciones de carga', () => {
    it('debería exportar loadMovements como función', () => {
      const { loadMovements } = useMovements()
      
      expect(typeof loadMovements).toBe('function')
    })
  })

  describe('Estadísticas de movimientos', () => {
    it('debería exportar getMovementStats como objeto computado', () => {
      const { getMovementStats } = useMovements()
      
      expect(getMovementStats).toBeDefined()
      expect(getMovementStats.value).toBeDefined()
    })

    it('debería tener estadísticas por tipo inicializadas en 0', () => {
      const { getMovementStats } = useMovements()
      
      expect(getMovementStats.value.byType).toBeDefined()
      expect(getMovementStats.value.byType.CREATE).toBe(0)
      expect(getMovementStats.value.byType.UPDATE).toBe(0)
      expect(getMovementStats.value.byType.DELETE).toBe(0)
      expect(getMovementStats.value.byType.CYCLE_COUNT).toBe(0)
    })

    it('debería tener total de movimientos en 0 inicialmente', () => {
      const { getMovementStats } = useMovements()
      
      expect(getMovementStats.value.total).toBe(0)
    })
  })

  describe('Constantes', () => {
    it('debería exportar MOVEMENT_TYPES', () => {
      const { MOVEMENT_TYPES } = useMovements()
      
      expect(MOVEMENT_TYPES).toBeDefined()
      expect(MOVEMENT_TYPES.CREATE).toBe('CREATE')
      expect(MOVEMENT_TYPES.UPDATE).toBe('UPDATE')
      expect(MOVEMENT_TYPES.DELETE).toBe('DELETE')
      expect(MOVEMENT_TYPES.CYCLE_COUNT).toBe('CYCLE_COUNT')
    })
  })
})
