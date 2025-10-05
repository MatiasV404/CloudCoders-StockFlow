# 📋 Notas de Versión - StockFlow

## v1.2.1 - Alertas migradas a modales personalizados

**Posted on 06-10-2025**

**UPDATED: Alertas y confirmacione personalizadas**
- [REFACTORING] Cerrar sesión: Las acciones de cierre de sesión se migraron a modales reutilizables.

## v1.2.0 - Códigos QR y Trazabilidad de Productos

**Posted on 05-10-2025**

**NEW: Sistema de Códigos QR**
- [FEAT] ID único legible para cada producto (formato PRD-XXXXX-XXXXX)
- [FEAT] Generación automática de código QR al crear productos
- [FEAT] Visualización de QR en modal de producto
- [FEAT] Descarga de QR como imagen PNG
- [FEAT] Impresión de QR con información del producto
- [FEAT] Copia rápida de ID al portapapeles

**NEW: Búsqueda Mejorada**
- [FEAT] Búsqueda de productos por ID único
- [FEAT] Badge visual de productId en tabla de inventario
- [FEAT] Preparación para escaneo de QR (próxima versión)

**REFACTORING: Modelo de Datos**
- [REFACTORING] Campo productId agregado a productos
- [REFACTORING] Función generateProductId() en useProducts
- [REFACTORING] Búsqueda mejorada incluyendo productId

## v1.1.0 - Sistema de roles y colaboración

**Posted on 05-10-2025**

**NEW: Sistema de Roles**
- [FEAT] Rol de Administrador con acceso completo al sistema
- [FEAT] Rol de Operario con acceso limitado al inventario
- [FEAT] Código de proyecto único para vincular operarios con administradores
- [FEAT] Sistema de permisos granular por rol

**NEW: Colaboración en tiempo real**
- [FEAT] Inventario compartido entre admin y operarios del mismo proyecto
- [FEAT] Validación de código de proyecto para unirse a equipos
- [FEAT] Sincronización automática de productos entre usuarios vinculados

**REFACTORING: Arquitectura de Datos**
- [REFACTORING] Reestructuración de reglas de Firestore para soporte multi-usuario
- [REFACTORING] Optimización del router guard para prevenir bucles infinitos
- [REFACTORING] Mejora en el manejo de suscripciones en tiempo real
- [REFACTORING] Simplificación del flujo de autenticación

## v1.0.0 - Release inicial

**Posted on 04-10-2025**
**NEW: Sistema de Autenticación**
- [FEAT] Login y registro con email/contraseña mediante Firebase Auth
- [FEAT] Autenticación con cuenta de Google
- [FEAT] Persistencia de sesión de usuario
- [FEAT] Rutas protegidas con guards de autenticación

**NEW: Dashboard Interactivo**
- [FEAT] Métricas en tiempo real: total de productos, stock bajo y valor total del inventario
- [FEAT] Vista de productos recientes
- [FEAT] Accesos rápidos para agregar productos

**NEW: Gestión de Inventario**
- [FEAT] CRUD completo de productos (crear, leer, actualizar, eliminar)
- [FEAT] Búsqueda avanzada por nombre, código, categoría y SKU
- [FEAT] Filtros por categoría y estado del producto
- [FEAT] Control de stock actual y stock mínimo
- [FEAT] Gestión de precios de costo y venta
- [FEAT] Estados automáticos basados en stock (Activo, Bajo Stock, Agotado, Descontinuado)
- [FEAT] Alertas automáticas de stock bajo
- [FEAT] Modal para agregar y editar productos

**NEW: Interfaz de Usuario**
- [FEAT] Diseño responsivo optimizado para móvil, tablet y escritorio
- [FEAT] Sidebar colapsible adaptativo
- [FEAT] Tema oscuro en toda la aplicación
- [FEAT] Animaciones suaves con AOS
- [FEAT] Estilos modernos con Tailwind CSS 4

**NEW: Base de Datos**
- [FEAT] Integración con Firebase Firestore
- [FEAT] Sincronización en tiempo real de datos
- [FEAT] Estructura de datos por usuario con subcollections
- [FEAT] Reglas de seguridad implementadas

**NEW: Deploy**
- [FEAT] Script automatizado de despliegue a Firebase Hosting
- [FEAT] Configuración de variables de entorno