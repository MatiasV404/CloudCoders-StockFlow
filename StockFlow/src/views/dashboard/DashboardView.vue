<script setup>
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
</script>

<template>
  <DashboardLayout>
    <div class="dashboard-content" data-aos="fade-up">
      <div class="welcome-card">
        <h2>¡Bienvenido a StockFlow! 👋</h2>
        <p>Gestiona tu inventario de manera eficiente</p>
      </div>

      <div class="stats-grid" data-aos="fade-up" data-aos-delay="100">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>Total Productos</h3>
            <p class="stat-number">0</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>Stock Bajo</h3>
            <p class="stat-number">0</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>Valor Total</h3>
            <p class="stat-number">$0</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔄</div>
          <div class="stat-info">
            <h3>Movimientos Hoy</h3>
            <p class="stat-number">0</p>
          </div>
        </div>
      </div>

      <div class="quick-actions" data-aos="fade-up" data-aos-delay="200">
        <h3>Acciones Rápidas</h3>
        <div class="actions-grid">
          <button class="action-btn">
            <span class="action-icon">➕</span>
            Agregar Producto
          </button>
          <button class="action-btn">
            <span class="action-icon">📋</span>
            Ver Inventario
          </button>
          <button class="action-btn">
            <span class="action-icon">📈</span>
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  background: linear-gradient(135deg, #4285f4 0%, #3367d6 100%);
  color: white;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 10px 25px rgba(66, 133, 244, 0.2);
}

.welcome-card h2 {
  margin: 0 0 10px 0;
  font-size: 2rem;
  font-weight: 600;
}

.welcome-card p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  border-left: 4px solid #4285f4;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  min-width: 60px;
  text-align: center;
}

.stat-info h3 {
  margin: 0 0 8px 0;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.quick-actions h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-btn {
  background: white;
  border: 2px solid #e9ecef;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: #495057;
}

.action-btn:hover {
  border-color: #4285f4;
  color: #4285f4;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-icon {
  font-size: 1.5rem;
}
</style>