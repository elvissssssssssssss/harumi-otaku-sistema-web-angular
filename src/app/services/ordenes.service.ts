import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenDetalle, OrdenListItem } from '../core/models/orden.model';

@Injectable({ providedIn: 'root' })
export class OrdenesServices {
  private baseUrl = 'http://localhost:5295';
  private apiUrl = `${this.baseUrl}/api/ordenes`;

  constructor(private http: HttpClient) {}

  getAll(usuarioId?: number): Observable<OrdenListItem[]> {
    let params = new HttpParams();
    if (usuarioId != null) params = params.set('usuarioId', String(usuarioId));
    return this.http.get<OrdenListItem[]>(this.apiUrl, { params });
  }

  getById(id: number, usuarioId?: number): Observable<OrdenDetalle> {
    let params = new HttpParams();
    if (usuarioId != null) params = params.set('usuarioId', String(usuarioId));
    return this.http.get<OrdenDetalle>(`${this.apiUrl}/${id}`, { params });
  }

  getHistorial(id: number, usuarioId?: number) {
    let params = new HttpParams();
    if (usuarioId != null) params = params.set('usuarioId', String(usuarioId));
    return this.http.get<any[]>(`${this.apiUrl}/${id}/historial-estados`, { params });
  }
}
