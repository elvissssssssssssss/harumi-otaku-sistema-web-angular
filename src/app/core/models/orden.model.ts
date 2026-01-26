export interface OrdenListItem {
  id: number;
  usuarioId: number;
  pickupAt: string;
  totalAmount: number;
  estadoActualId: number;
  estadoCodigo: string | null;
  estadoNombre: string | null;
  createdAt: string;
  items: any[];
}
export interface OrdenDetalle {
  id: number;
  usuarioId: number;
  pickupAt: string;
  totalAmount: number;
  estadoActualId: number;
  estadoCodigo: string;
  estadoNombre: string;
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
export interface OrdenEstadoHistorial {
  id: number;
  ordenId: number;
  estadoId: number;
  estadoCodigo: string;
  estadoNombre: string;
  cambiadoPorUsuarioId: number;
  comentario: string;
  fechaCambio: string;
}
export interface OrdenEstadoHistorialItem {
  id: number;
  ordenId: number;
  estadoId: number;
  estadoCodigo: string;
  estadoNombre: string;
  cambiadoPorUsuarioId: number;
  comentario: string;
  fechaCambio: string;
}
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
  estadoCodigo: string; // aquí sí viene
  estadoNombre: string; // aquí sí viene
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

export interface OrdenEstadoHistorialItem {
  id: number;
  ordenId: number;
  estadoId: number;
  estadoCodigo: string;
  estadoNombre: string;
  cambiadoPorUsuarioId: number;
  comentario: string;
  fechaCambio: string;
}
