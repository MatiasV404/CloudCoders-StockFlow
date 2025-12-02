// Comando para login con email y password
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').first().type(password)
  cy.get('button[type="submit"]').click()
})

// Comando para verificar que el usuario está en el dashboard
Cypress.Commands.add('shouldBeOnDashboard', () => {
  cy.url().should('include', '/dashboard')
  cy.contains('StockFlow').should('be.visible')
})

// Comando para verificar que el usuario está en inventario
Cypress.Commands.add('shouldBeOnInventory', () => {
  cy.url().should('include', '/inventory')
  cy.contains('Gestión de Inventario').should('be.visible')
})

// Comando para navegar al inventario desde el sidebar
Cypress.Commands.add('goToInventory', () => {
  cy.get('aside').contains('Inventario').click()
  cy.shouldBeOnInventory()
})

// Comando para abrir modal de agregar producto
Cypress.Commands.add('openAddProductModal', () => {
  cy.contains('button', 'Agregar').click()
  cy.get('[role="dialog"], .modal, [class*="modal"]').should('be.visible')
})

// Comando para llenar formulario de producto
Cypress.Commands.add('fillProductForm', (productData) => {
  if (productData.name) {
    cy.get('input[placeholder*="nombre"], input[name="name"]').clear().type(productData.name)
  }
  if (productData.code) {
    cy.get('input[placeholder*="código"], input[name="code"]').clear().type(productData.code)
  }
  if (productData.category) {
    cy.get('select').first().select(productData.category)
  }
  if (productData.stock) {
    cy.get('input[type="number"]').first().clear().type(productData.stock)
  }
  if (productData.price) {
    cy.get('input[placeholder*="precio"], input[name="price"]').clear().type(productData.price)
  }
})

// Comando para buscar producto en la tabla
Cypress.Commands.add('searchProduct', (searchTerm) => {
  cy.get('input[placeholder*="Buscar"]').clear().type(searchTerm)
})

// Comando para esperar a que cargue la aplicación
Cypress.Commands.add('waitForApp', () => {
  cy.get('[class*="loading"], [class*="spinner"]').should('not.exist')
})

// Comando para logout
Cypress.Commands.add('logout', () => {
  cy.get('button').contains('Cerrar sesión').click()
  cy.get('button').contains('Cerrar sesión').click() // Confirmar en modal
  cy.url().should('include', '/login')
})

// Comando para interceptar llamadas a Firebase
Cypress.Commands.add('mockFirebase', () => {
  cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
    statusCode: 200,
    body: {
      kind: 'identitytoolkit#VerifyPasswordResponse',
      localId: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      idToken: 'mock-id-token',
      registered: true,
      refreshToken: 'mock-refresh-token',
      expiresIn: '3600'
    }
  }).as('firebaseAuth')
})

// Comando para verificar toast de éxito
Cypress.Commands.add('shouldShowSuccessToast', (message) => {
  cy.get('[class*="toast"], [class*="notification"]')
    .should('be.visible')
    .and('contain', message || '')
})

// Comando para verificar toast de error
Cypress.Commands.add('shouldShowErrorToast', (message) => {
  cy.get('[class*="toast"], [class*="notification"], [class*="error"]')
    .should('be.visible')
    .and('contain', message || '')
})