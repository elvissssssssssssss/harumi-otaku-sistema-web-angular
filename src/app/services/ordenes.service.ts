import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenDetalle, OrdenEstadoHistorialItem, OrdenListItem } from '../core/models/orden.model';

@Injectable({ providedIn: 'root' })
export class OrdenesService {
  private baseUrl = 'http://localhost:5295';

  constructor(private http: HttpClient) {}

  listar(usuarioId: number): Observable<OrdenListItem[]> {
    const params = new HttpParams().set('usuarioId', String(usuarioId));
    return this.http.get<OrdenListItem[]>(`${this.baseUrl}/api/ordenes`, { params });
  }

  detalle(usuarioId: number, id: number): Observable<OrdenDetalle> {
    const params = new HttpParams().set('usuarioId', String(usuarioId));
    return this.http.get<OrdenDetalle>(`${this.baseUrl}/api/ordenes/${id}`, { params });
  }

  historial(usuarioId: number, id: number): Observable<OrdenEstadoHistorialItem[]> {
    const params = new HttpParams().set('usuarioId', String(usuarioId));
    return this.http.get<OrdenEstadoHistorialItem[]>(
      `${this.baseUrl}/api/ordenes/${id}/historial-estados`,
      { params }
    );
  }

  crearDesdeCarrito(usuarioId: number, pickupAt: string): Observable<{ id: number }> {
    const params = new HttpParams().set('usuarioId', String(usuarioId));
    return this.http.post<{ id: number }>(
      `${this.baseUrl}/api/ordenes`,
      { pickupAt },
      { params }
    );
  }
}
