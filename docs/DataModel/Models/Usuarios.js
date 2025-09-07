{
  uid: string;                // ID único (Firebase Auth o UUID)
  nombre_usuario: string;
  email: string;
  rol: string;              // "admin" | "empleado"
  estado_usuario: string;     // "activo" | "inactivo"
  fecha_creacion: timestamp;
}
