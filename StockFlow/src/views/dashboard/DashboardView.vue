<script setup>
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
</script>

<template>
  <DashboardLayout>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6" data-aos="fade-up">
      <!-- Card de bienvenida -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 sm:p-8 rounded-2xl mb-6 sm:mb-8 shadow-lg">
        <h2 class="m-0 mb-2 text-2xl sm:text-3xl font-semibold">¡Bienvenido a StockFlow! 👋</h2>
        <p class="m-0 opacity-90 text-base sm:text-lg">Gestiona tu inventario de manera eficiente</p>
      </div>

      <!-- Grid de estadísticas mejorado -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8" data-aos="fade-up" data-aos-delay="100">
        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-blue-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">📦</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Total Productos</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800 truncate">0</p>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-green-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">📊</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Stock Bajo</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800 truncate">0</p>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-yellow-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">💰</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Valor Total</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800 truncate">$0</p>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex items-center gap-3 sm:gap-5 border-l-4 border-purple-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-3xl sm:text-4xl w-12 sm:w-16 flex-shrink-0 text-center">🔄</div>
          <div class="min-w-0 flex-1">
            <h3 class="m-0 mb-1 sm:mb-2 text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Movimientos Hoy</h3>
            <p class="m-0 text-2xl sm:text-3xl font-bold text-gray-800 truncate">0</p>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas mejoradas -->
      <div data-aos="fade-up" data-aos-delay="200">
        <h3 class="m-0 mb-4 sm:mb-5 text-gray-800 text-xl sm:text-2xl font-semibold">Acciones Rápidas</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button class="bg-white border-2 border-gray-200 p-4 sm:p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-sm text-left">
            <span class="text-xl sm:text-2xl flex-shrink-0">➕</span>
            <span class="truncate">Agregar Producto</span>
          </button>
          
          <button class="bg-white border-2 border-gray-200 p-4 sm:p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-sm text-left">
            <span class="text-xl sm:text-2xl flex-shrink-0">📋</span>
            <span class="truncate">Ver Inventario</span>
          </button>
          
          <button class="bg-white border-2 border-gray-200 p-4 sm:p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-sm text-left sm:col-span-2 lg:col-span-1">
            <span class="text-xl sm:text-2xl flex-shrink-0">📈</span>
            <span class="truncate">Generar Reporte</span>
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>