// Importar comandos personalizados
import './commands'

// Configuración global
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevenir que errores de Firebase rompan los tests
  if (err.message.includes('Firebase') || err.message.includes('auth')) {
    return false
  }
  return true
})

// Antes de cada test
beforeEach(() => {
  // Limpiar localStorage y sessionStorage
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
})
