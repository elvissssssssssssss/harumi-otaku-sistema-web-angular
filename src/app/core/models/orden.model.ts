export interface OrdenListItem {
  id: number;
  usuarioId: number;
  pickupAt: string;
  totalAmount: number;
  estadoActualId: number;
  estadoCodigo: string | null;
  estadoNombre: string | null;
  createdAt: string;
  items: any[]; // en lista viene vacío, normal
}

export interface OrdenDetalle {
  id: number;
  usuarioId: number;
  pickupAt: string;
  totalAmount: number;
  estadoActualId: number;
  estadoCodigo: string;   // aquí sí viene
  estadoNombre: string;   // aquí sí viene
  createdAt: string;
  items: Array<{
    id: number;
    productoId: number;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
}
