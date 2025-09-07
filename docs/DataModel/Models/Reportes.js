{
  reporteId: string;
  periodo: string;             // formato "YYYY-MM"
  generado_por: string;        // referencia a usuarios.uid
  fecha_generacion: timestamp;
  resumen: {
    productos_totales: number;
    stock_total: number;
    productos_bajo_stock: object; // lista de productos en riesgo array<object>
    movimientos_totales: number;
    entradas: number;
    salidas: number
  };
  graficos: {
    stock_por_categoria: object;    // {categoria: cantidad}
    movimientos_por_tipo: object    // {"entrada": number; "salida": number}
  }
}
