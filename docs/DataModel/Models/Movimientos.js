{
  movimientoId: string;
  productoId: string;          // referencia a productos.id
  nombre_producto: string;     // denormalizado para consultas rápidas
  tipo: string;                // "entrada" | "salida" | "ajuste"
  cantidad: number;
  usuarioId: string;           // referencia a usuarios.uid
  fecha: timestamp;
  nota: string
}
