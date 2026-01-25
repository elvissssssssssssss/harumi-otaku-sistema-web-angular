// src/app/features/admin/pedidos/pedidos.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrdenDetalle, OrdenEstadoHistorialItem, OrdenListItem } from '../../../core/models/orden.model';
import { OrdenesServices } from '../../../services/ordenes.service';
import { AdminServices } from '../../../services/admin.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent implements OnInit {
  ordenes: OrdenListItem[] = [];
  selectedOrden: OrdenDetalle | null = null;
  historial: OrdenEstadoHistorialItem[] = [];

  isLoading = false;
  isLoadingDetalle = false;
  isLoadingHistorial = false;

  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  // por ahora fijo; cuando metas JWT esto sale del token
  adminUsuarioId = 1;

  formEstado: FormGroup;
  formPago: FormGroup;

  constructor(
    private ordenesService: OrdenesServices,
    private adminService: AdminServices,
    private fb: FormBuilder
  ) {
    this.formEstado = this.fb.group({
      estadoCodigo: ['', [Validators.required]],
      comentario: ['']
    });

    this.formPago = this.fb.group({
      resultado: ['CONFIRMADO', [Validators.required]],
      nota: ['']
    });
  }

  ngOnInit(): void {
    this.loadOrdenes();
  }

  loadOrdenes(): void {
    this.isLoading = true;
    this.mensajeError = null;

    // Admin: por ahora sin usuarioId para que devuelva "todas"
    this.ordenesService.getAll().subscribe({
      next: (data) => {
        this.ordenes = data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.mensajeError = 'Error al cargar órdenes';
      }
    });
  }

  verDetalle(ordenId: number): void {
    this.isLoadingDetalle = true;
    this.selectedOrden = null;
    this.historial = [];

    this.ordenesService.getById(ordenId).subscribe({
      next: (o) => {
        this.selectedOrden = o;
        this.isLoadingDetalle = false;

        // precargar formulario estado con algo (opcional)
        this.formEstado.reset({ estadoCodigo: '', comentario: '' });

        this.verHistorial(ordenId);
      },
      error: () => {
        this.isLoadingDetalle = false;
        this.mensajeError = 'No se pudo cargar el detalle de la orden';
      }
    });
  }

  verHistorial(ordenId: number): void {
    this.isLoadingHistorial = true;
    this.ordenesService.getHistorial(ordenId).subscribe({
      next: (h) => {
        this.historial = h ?? [];
        this.isLoadingHistorial = false;
      },
      error: () => {
        this.isLoadingHistorial = false;
        this.mensajeError = 'No se pudo cargar el historial';
      }
    });
  }

  cambiarEstado(): void {
    if (!this.selectedOrden) return;

    this.mensajeError = null;
    this.mensajeExito = null;

    if (this.formEstado.invalid) {
      this.formEstado.markAllAsTouched();
      return;
    }

    const { estadoCodigo, comentario } = this.formEstado.value;

    this.adminService.cambiarEstadoOrden(this.selectedOrden.id, this.adminUsuarioId, estadoCodigo, comentario).subscribe({
      next: () => {
        this.mensajeExito = 'Estado actualizado';
        this.loadOrdenes();
        this.verDetalle(this.selectedOrden!.id); // refresca detalle + historial
      },
      error: (err) => {
        this.mensajeError = err?.error?.message ?? 'Error al cambiar estado';
      }
    });
  }

  validarPago(): void {
    const pagoId = this.selectedOrden?.pago?.id;
    if (!pagoId) {
      this.mensajeError = 'La orden no tiene pago asociado';
      return;
    }

    const { resultado, nota } = this.formPago.value;

    this.adminService.validarPago(pagoId, this.adminUsuarioId, resultado, nota).subscribe({
      next: () => {
        this.mensajeExito = `Pago ${resultado}`;
        this.loadOrdenes();
        this.verDetalle(this.selectedOrden!.id);
      },
      error: (err) => {
        this.mensajeError = err?.error?.message ?? 'Error al validar pago';
      }
    });
  }

  // helper para mostrar solo "EN_REVISION"
  esPagoEnRevision(o: OrdenDetalle | null): boolean {
    return o?.pago?.estado === 'EN_REVISION';
  }

  // url voucher (si tu backend guarda "/uploads/vouchers/xxx.jpg")
  getFileUrl(path: string | null | undefined): string | null {
    if (!path || path.trim() === '') return null;
    if (path.startsWith('http')) return path;
    const cleaned = path.replace(/^wwwroot[\\/]+/, '').replace(/\\/g, '/');
    return `http://localhost:5295/${cleaned.startsWith('/') ? cleaned.substring(1) : cleaned}`;
  }
}
