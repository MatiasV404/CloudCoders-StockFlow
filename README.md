# 📦 StockFlow - Sistema de gestión de inventario

StockFlow es una aplicación web moderna para la gestión eficiente de inventarios, desarrollada con Vue 3, Firebase y Tailwind CSS. Permite a los usuarios gestionar sus productos de manera segura y en tiempo real.

## 🚀 Características principales

### ✨ Funcionalidades actuales
- **🔐 Autenticación completa**
  - Registro e inicio de sesión con email y contraseña
  - Autenticación con Google
  - Sesiones persistentes
  - Rutas protegidas

- **📊 Dashboard interactivo**
  - Estadísticas en tiempo real del inventario
  - Resumen de productos, stock bajo y valor total
  - Productos recientes
  - Acciones rápidas para gestión

- **📋 Gestión de inventario**
  - CRUD completo de productos (crear, leer, actualizar, eliminar)
  - Búsqueda avanzada por nombre, código y categoría
  - Filtros por categoría y estado
  - Control de stock mínimo con alertas automáticas
  - Estados automáticos basados en stock

- **📱 Diseño responsivo**
  - Sidebar colapsible adaptativo
  - Optimizado para móvil, tablet y desktop
  - Interfaz moderna con Tailwind CSS
  - Animaciones fluidas con AOS

- **🔥 Tiempo real**
  - Sincronización automática entre dispositivos
  - Updates instantáneos en toda la aplicación
  - Base de datos Firestore con reglas de seguridad

### 🔮 Funcionalidades futuras
- **📈 Reportes y análisis**
- **📤 Exportación de datos**
- **🔔 Notificaciones de stock**
- **📸 Imágenes de productos**

## 🛠️ Stack tecnológico

- **Frontend**: Vue 3 + Vite
- **Estilos**: Tailwind CSS 4
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Hosting**: Firebase Hosting
- **Animaciones**: AOS (Animate On Scroll)

## 📁 Estructura del proyecto

```
StockFlow/
├── src/
│   ├── components/
│   │   ├── layout/           # Layout components (Sidebar, Dashboard)
│   │   ├── inventory/        # Componentes de inventario
│   │   └── common/           # Componentes reutilizables
│   ├── views/
│   │   ├── auth/            # Vistas de autenticación
│   │   ├── dashboard/       # Dashboard principal
│   │   └── inventory/       # Gestión de inventario
│   ├── composables/         # Lógica de negocio reutilizable
│   ├── firebase/           # Configuración de Firebase
│   └── router/             # Configuración de rutas
├── public/                 # Archivos estáticos
├── firestore.rules        # Reglas de seguridad
├── firebase.json          # Configuración de Firebase
└── deploy.sh             # Script de despliegue
```

---

# 🚀 Guía de instalación y desarrollo local

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

### 1. **Node.js y npm**
- **Node.js** versión 16 o superior
- **npm** versión 8 o superior

```bash
# Verificar instalación
node --version
npm --version
```

**Descargar**: [https://nodejs.org/](https://nodejs.org/)

### 2. **Git**
```bash
# Verificar instalación
git --version
```

**Descargar**: [https://git-scm.com/](https://git-scm.com/)

### 3. **Firebase CLI**
```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Verificar instalación
firebase --version
```


## 💻 Instalación Local

### 1. **Clonar el Repositorio**
```bash
# Clonar el proyecto
git clone https://github.com/MatiasV404/CloudCoders-StockFlow.git

# Navegar al directorio
cd stockflow/StockFlow
```

### 2. **Instalar Dependencias**
```bash
# Instalar todas las dependencias
npm install
```

### 3. **Configurar Variables de Entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
# .env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**⚠️ Importante**: 
- Las variables de configuración solo la poseen los colaboradores.

### 4. **Configurar Firebase CLI**
```bash
# Autenticarse en Firebase
firebase login
```

## 🚀 Comandos de desarrollo

### **Desarrollo local**
```bash
# Servidor de desarrollo (http://localhost:{puerto})
npm run dev
```

### **Build de producción**
```bash
# Construir para producción
npm run build
```

### **Deploy a Firebase**
```bash
# Deploy completo
./deploy.sh

# Deploy solo hosting
npm run deploy:hosting

# Deploy solo reglas de Firestore
npm run deploy:rules

# Deploy todo
npm run deploy:all
```

## 🔧 Comandos útiles

### **Desarrollo**
```bash
# Instalar dependencias
npm install

# Actualizar dependencias
npm update

# Limpiar cache
npm run clean
```

## 🐛 Solución de problemas comunes

### **Error: Firebase not configured**
- Verificar que el archivo `.env` existe
- Confirmar que todas las variables están configuradas
- Reiniciar el servidor de desarrollo

### **Error: Permission denied en Firestore**
- Verificar reglas de Firestore
- Confirmar que el usuario está autenticado

### **Error: Build failed**
- Verificar que todas las dependencias están instaladas
- Limpiar `node_modules` y reinstalar
- Verificar sintaxis en archivos Vue

### **Error: Firebase deploy failed**
- Verificar autenticación: `firebase login`
- Confirmar proyecto correcto: `firebase use {project_id}`
- Verificar permisos en Firebase Console

## 📚 Estructura de Datos

### **Productos** (`/users/{uid}/products/{productId}`)
```javascript
{
  id: "auto-generated",
  name: "Nombre del producto",
  code: "Código del producto",
  sku: "SKU del producto", 
  description: "Descripción detallada",
  category: "Categoría del producto",
  status: "Estado del producto",
  stock: 0, // int: Cantidad actual del producto en stock
  minStock: 0, // int: Cantidad mínima del producto en stock
  price: 0.0, // float: Precio de venta unitario del producto
  cost: 0.0, // float: Precio de costo unitario del producto
  userId: "user-uid",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```
