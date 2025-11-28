/// <reference types="cypress" />

describe('Página de Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  describe('Renderizado inicial', () => {
    it('debería mostrar el título StockFlow', () => {
      cy.contains('StockFlow').should('be.visible')
    })

    it('debería mostrar el formulario de login', () => {
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('debería mostrar el botón de Google', () => {
      cy.contains('Google').should('be.visible')
    })

    it('debería mostrar opción para registrarse', () => {
      cy.contains('Regístrate').should('be.visible')
    })

    it('debería mostrar el checkbox de guardar sesión', () => {
      cy.get('input[type="checkbox"]').should('be.visible')
    })
  })

  describe('Toggle Login/Registro', () => {
    it('debería cambiar a modo registro al hacer clic', () => {
      cy.contains('Regístrate').click()
      cy.contains('Crear Cuenta').should('be.visible')
    })

    it('debería mostrar campo de confirmar contraseña en modo registro', () => {
      cy.contains('Regístrate').click()
      cy.get('input[type="password"]').should('have.length', 2)
    })

    it('debería volver a modo login desde registro', () => {
      cy.contains('Regístrate').click()
      cy.contains('Ya tengo cuenta').click()
      cy.contains('Iniciar Sesión').should('be.visible')
    })
  })

  describe('Validación de formulario', () => {
    it('debería requerir email', () => {
      cy.get('input[type="password"]').first().type('password123')
      cy.get('button[type="submit"]').click()
      cy.get('input[type="email"]:invalid').should('exist')
    })

    it('debería requerir contraseña', () => {
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('button[type="submit"]').click()
      cy.get('input[type="password"]:invalid').should('exist')
    })

    it('debería validar formato de email', () => {
      cy.get('input[type="email"]').type('invalid-email')
      cy.get('input[type="password"]').first().type('password123')
      cy.get('button[type="submit"]').click()
      cy.get('input[type="email"]:invalid').should('exist')
    })
  })

  describe('Toggle de visibilidad de contraseña', () => {
    it('debería mostrar/ocultar contraseña al hacer clic en el icono', () => {
      const password = 'mySecretPassword'
      
      // Escribir contraseña
      cy.get('input[type="password"]').first().type(password)
      
      // Verificar que está oculta
      cy.get('input[type="password"]').first().should('have.attr', 'type', 'password')
      
      // Hacer clic en el botón de mostrar (buscar el botón dentro del campo de contraseña)
      cy.get('input[type="password"]').first().parent().find('button').click()
      
      // Verificar que ahora está visible
      cy.get('input[type="text"]').first().should('have.value', password)
    })
  })

  describe('Validación en modo registro', () => {
    beforeEach(() => {
      cy.contains('Regístrate').click()
    })

    it('debería mostrar error si las contraseñas no coinciden', () => {
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').first().type('password123')
      cy.get('input[type="password"]').last().type('differentPassword')
      
      cy.contains('Las contraseñas no coinciden').should('be.visible')
    })

    it('debería deshabilitar el botón si las contraseñas no coinciden', () => {
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').first().type('password123')
      cy.get('input[type="password"]').last().type('differentPassword')
      
      cy.get('button[type="submit"]').should('be.disabled')
    })
  })

  describe('Elementos visuales', () => {
    it('debería tener un fondo con gradiente', () => {
      cy.get('div').first().should('have.class', 'bg-gradient-to-br')
    })

    it('debería mostrar información de contacto', () => {
      cy.contains('Contacto de Soporte').should('be.visible')
      cy.contains('stockflowsupport@stockflow.com').should('be.visible')
    })

    it('debería tener el logo/icono de la app', () => {
      cy.contains('📦').should('be.visible')
    })
  })
})
