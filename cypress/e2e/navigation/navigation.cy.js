/// <reference types="cypress" />

describe('Navegación de la aplicación', () => {
  describe('Rutas públicas', () => {
    it('debería cargar la página de login', () => {
      cy.visit('/login')
      cy.contains('StockFlow').should('be.visible')
    })

    it('debería redirigir / a /login', () => {
      cy.visit('/')
      cy.url().should('include', '/login')
    })
  })

  describe('Rutas protegidas (sin auth)', () => {
    it('debería redirigir /dashboard a /login sin autenticación', () => {
      cy.visit('/dashboard', { failOnStatusCode: false })
      cy.url().should('include', '/login')
    })

    it('debería redirigir /inventory a /login sin autenticación', () => {
      cy.visit('/inventory', { failOnStatusCode: false })
      cy.url().should('include', '/login')
    })

    it('debería redirigir /movements a /login sin autenticación', () => {
      cy.visit('/movements', { failOnStatusCode: false })
      cy.url().should('include', '/login')
    })

    it('debería redirigir /cyclic-count a /login sin autenticación', () => {
      cy.visit('/cyclic-count', { failOnStatusCode: false })
      cy.url().should('include', '/login')
    })

    it('debería redirigir /setup a /login sin autenticación', () => {
      cy.visit('/setup', { failOnStatusCode: false })
      cy.url().should('include', '/login')
    })
  })

  describe('Comportamiento del navegador', () => {
    it('debería mantener la URL después de refresh en login', () => {
      cy.visit('/login')
      cy.reload()
      cy.url().should('include', '/login')
    })
  })

  describe('Links y elementos de navegación en Login', () => {
    beforeEach(() => {
      cy.visit('/login')
    })

    it('debería tener todos los elementos de navegación visibles', () => {
      // Verificar elementos principales
      cy.contains('StockFlow').should('be.visible')
      cy.contains('Iniciar sesión').should('be.visible')
      cy.contains('Registro').should('be.visible')
    })

    it('debería cambiar entre modos de login y registro', () => {
      // Verificar modo inicial
      cy.contains('Iniciar Sesión').should('be.visible')
      
      // Cambiar a registro
      cy.contains('Regístrate').click()
      cy.contains('Crear Cuenta').should('be.visible')
      
      // Volver a login
      cy.contains('Ya tengo cuenta').click()
      cy.contains('Iniciar Sesión').should('be.visible')
    })
  })
})

describe('Responsividad', () => {
  describe('Mobile viewport', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
      cy.visit('/login')
    })

    it('debería mostrar el formulario correctamente en móvil', () => {
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('debería ser responsive el contenedor principal', () => {
      cy.get('form').should('be.visible')
    })
  })

  describe('Tablet viewport', () => {
    beforeEach(() => {
      cy.viewport('ipad-2')
      cy.visit('/login')
    })

    it('debería mostrar correctamente en tablet', () => {
      cy.contains('StockFlow').should('be.visible')
      cy.get('form').should('be.visible')
    })
  })

  describe('Desktop viewport', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080)
      cy.visit('/login')
    })

    it('debería mostrar correctamente en desktop', () => {
      cy.contains('StockFlow').should('be.visible')
      cy.get('form').should('be.visible')
    })
  })
})
