{
  id: string;                 // ID interno
  codigo_SKU: string;
  nombre_producto: string;
  categoria: string;
  descripcion: string;
  unidad_medida: string;      // ej: "unidad"; "kg"; "litros"
  stock: number;
  stock_minimo: number;
  precio_venta: number;
  estado_producto: string;    // "activo" | "inactivo"
  proveedorId: string;        // referencia a proveedores.proveedorId
  fecha_creacion: timestamp;
  ultima_actualizacion: timestamp
}
