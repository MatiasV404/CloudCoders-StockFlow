<template>
  <DashboardLayout>
    <div class="max-w-6xl mx-auto" data-aos="fade-up">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl mb-8 shadow-lg">
        <h2 class="m-0 mb-2 text-3xl font-semibold">¡Bienvenido a StockFlow! 👋</h2>
        <p class="m-0 opacity-90 text-lg">Gestiona tu inventario de manera eficiente</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8" data-aos="fade-up" data-aos-delay="100">
        <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5 border-l-4 border-blue-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-4xl w-16 flex-shrink-0 text-center">📦</div>
          <div>
            <h3 class="m-0 mb-2 text-gray-500 text-sm font-medium uppercase tracking-wider">Total Productos</h3>
            <p class="m-0 text-3xl font-bold text-gray-800">0</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5 border-l-4 border-blue-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-4xl w-16 flex-shrink-0 text-center">📊</div>
          <div>
            <h3 class="m-0 mb-2 text-gray-500 text-sm font-medium uppercase tracking-wider">Stock Bajo</h3>
            <p class="m-0 text-3xl font-bold text-gray-800">0</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5 border-l-4 border-blue-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-4xl w-16 flex-shrink-0 text-center">💰</div>
          <div>
            <h3 class="m-0 mb-2 text-gray-500 text-sm font-medium uppercase tracking-wider">Valor Total</h3>
            <p class="m-0 text-3xl font-bold text-gray-800">$0</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5 border-l-4 border-blue-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div class="text-4xl w-16 flex-shrink-0 text-center">🔄</div>
          <div>
            <h3 class="m-0 mb-2 text-gray-500 text-sm font-medium uppercase tracking-wider">Movimientos Hoy</h3>
            <p class="m-0 text-3xl font-bold text-gray-800">0</p>
          </div>
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <h3 class="m-0 mb-5 text-gray-800 text-2xl font-semibold">Acciones Rápidas</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="bg-white border-2 border-gray-200 p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-sm">
            <span class="text-2xl">➕</span>
            Agregar Producto
          </button>
          
          <button class="bg-white border-2 border-gray-200 p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-sm">
            <span class="text-2xl">📋</span>
            Ver Inventario
          </button>
          
          <button class="bg-white border-2 border-gray-200 p-5 rounded-xl cursor-pointer transition-all flex items-center gap-3 font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-sm">
            <span class="text-2xl">📈</span>
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
</script>