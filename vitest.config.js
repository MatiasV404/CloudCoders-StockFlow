import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    // Entorno de testing
    environment: 'happy-dom',
    
    // Archivos de test
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/unit/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', 'cypress'],
    
    // Globales disponibles sin importar
    globals: true,
    
    // Configuración de cobertura
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,vue}'],
      exclude: [
        'src/main.js',
        'src/firebase/**',
        'src/router/**',
        '**/*.spec.js',
        '**/*.test.js'
      ]
    },
    
    // Setup files
    setupFiles: ['./tests/setup.js'],
    
    // Alias para imports
    alias: {
      '@': '/src'
    }
  }
})
