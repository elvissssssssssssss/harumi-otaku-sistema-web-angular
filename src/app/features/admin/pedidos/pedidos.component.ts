import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrdenDetalle, OrdenEstadoHistorialItem, OrdenListItem } from '../../../core/models/orden.model';
import { OrdenesService } from '../../../services/ordenes.service';
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

  // temporal: como tu API necesita usuarioId en GET /api/ordenes
  usuarioIdDemo = 1;

  // admin para PATCH
  adminUsuarioId = 2;

  formEstado: FormGroup;

  constructor(
    private ordenesService: OrdenesService,
    private adminService: AdminServices,
    private fb: FormBuilder
  ) {
    this.formEstado = this.fb.group({
      estadoCodigo: ['', [Validators.required]],
      comentario: ['']
    });
  }

  ngOnInit(): void {
    this.loadOrdenes();
  }

  loadOrdenes(): void {
    this.isLoading = true;
    this.mensajeError = null;

    this.ordenesService.listar(this.usuarioIdDemo).subscribe({
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

    this.ordenesService.detalle(this.usuarioIdDemo, ordenId).subscribe({
      next: (o) => {
        this.selectedOrden = o;
        this.isLoadingDetalle = false;

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

    this.ordenesService.historial(this.usuarioIdDemo, ordenId).subscribe({
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

    this.adminService
      .cambiarEstadoOrden(this.selectedOrden.id, this.adminUsuarioId, estadoCodigo, comentario)
      .subscribe({
        next: () => {
          this.mensajeExito = 'Estado actualizado';
          this.loadOrdenes();
          this.verDetalle(this.selectedOrden!.id);
        },
        error: (err) => {
          this.mensajeError = err?.error?.message ?? 'Error al cambiar estado';
        }
      });
  }
}
