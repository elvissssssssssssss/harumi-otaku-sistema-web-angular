import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

type SeriePoint = { label: string; value: number };
type TopProduct = { productoId: number; nombre: string; cantidad: number; ingreso: number };

type DashboardVm = {
  pedidosNuevos: number;
  ingresosTotales: number;
  ventasPorDia: SeriePoint[];
  topProductos: TopProduct[];
  totalUsuarios: number;
};

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements AfterViewInit, OnDestroy {
  // ViewChild para los canvas
  @ViewChild('platillosChart') platillosCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bubbleteaChart') bubbleteaCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ventasChart') ventasCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reservasChart') reservasCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('salesChart') salesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topProductsChart') topProductsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoriesChart') categoriesCanvas!: ElementRef<HTMLCanvasElement>;

  // Variables
  charts: Chart[] = [];
  filtroTiempo: string = 'semana';
  summaryCards: any[] = [];
  loading = true;
  error = '';

  // Colores kawaii palette
  colores = ["#f472b6", "#c084fc", "#9333ea", "#fb7185", "#38bdf8"];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cargarDatosDashboard();
      this.renderCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destruirCharts();
  }

  // ========== FILTROS ==========
  cambiarFiltro(): void {
    this.destruirCharts();
    this.renderCharts();
  }

  destruirCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  // ========== CARGA DE DATOS ==========
  cargarDatosDashboard(): void {
    this.loading = true;
    this.error = '';
    
    try {
      // TODO: Reemplaza esto con tu API real
      const dashboardData: DashboardVm = {
        pedidosNuevos: 45,
        ingresosTotales: 12500.50,
        ventasPorDia: [
          { label: 'Lun', value: 1200 },
          { label: 'Mar', value: 1800 },
          { label: 'Mie', value: 1500 },
          { label: 'Jue', value: 2200 },
          { label: 'Vie', value: 2800 },
          { label: 'Sab', value: 3200 },
          { label: 'Dom', value: 2500 }
        ],
        topProductos: [
          { productoId: 1, nombre: 'Kimbap', cantidad: 150, ingreso: 4500 },
          { productoId: 2, nombre: 'Tonkatsu', cantidad: 120, ingreso: 6000 },
          { productoId: 3, nombre: 'Bibimbap', cantidad: 200, ingreso: 8000 },
          { productoId: 4, nombre: 'Tteokbokki', cantidad: 80, ingreso: 2400 }
        ],
        totalUsuarios: 1250
      };

      this.actualizarCards(dashboardData);
      this.renderSalesChart(dashboardData.ventasPorDia);
      this.renderTopProductsChart(dashboardData.topProductos);
      this.renderCategoriesChart();
      
    } catch (err) {
      this.error = 'Error al cargar los datos del dashboard';
      console.error(err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  actualizarCards(vm: DashboardVm): void {
    this.summaryCards = [
      {
        value: vm.pedidosNuevos.toString(),
        label: 'Pedidos nuevos',
        icon: 'fa-shopping-bag',
        color: 'primary'
      },
      {
        value: vm.totalUsuarios.toString(),
        label: 'Usuarios registrados',
        icon: 'fa-user-plus',
        color: 'warning'
      },
      {
        value: `S/ ${vm.ingresosTotales.toFixed(2)}`,
        label: 'Ingresos totales',
        icon: 'fa-coins',
        color: 'success'
      }
    ];
  }

  // ========== RENDERIZADO DE GRÁFICOS ==========
  renderCharts(): void {
    // Esperar un tick para asegurar que los canvas estén disponibles
    setTimeout(() => {
      this.renderPlatillosChart();
      this.renderBubbleteaChart();
      this.renderVentasChart();
      this.renderReservasChart();
    }, 50);
  }

  renderPlatillosChart(): void {
    if (!this.platillosCanvas?.nativeElement) return;
    const ctx = this.platillosCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.obtenerDatosPlatillos();

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Kimbap", "Tonkatsu", "Tteokbokki", "Bibimbap"],
        datasets: [{
          label: "Ventas",
          data: data,
          backgroundColor: this.colores
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Top Platillos' }
        }
      }
    });
    this.charts.push(chart);
  }

  renderBubbleteaChart(): void {
    if (!this.bubbleteaCanvas?.nativeElement) return;
    const ctx = this.bubbleteaCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.obtenerDatosBubbletea();

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ["Café", "Matcha", "Fruta", "Taro"],
        datasets: [{
          data: data,
          backgroundColor: this.colores
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
    this.charts.push(chart);
  }

  renderVentasChart(): void {
    if (!this.ventasCanvas?.nativeElement) return;
    const ctx = this.ventasCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
        datasets: [{
          label: "Ventas (S/.)",
          data: this.obtenerDatosVentas(),
          backgroundColor: "#f472b6",
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
    this.charts.push(chart);
  }

  renderReservasChart(): void {
    if (!this.reservasCanvas?.nativeElement) return;
    const ctx = this.reservasCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
        datasets: [
          {
            label: "Reservas Online",
            data: this.obtenerDatosReservasA(),
            borderColor: this.colores[0],
            backgroundColor: this.colores[0],
            fill: false,
            tension: 0.3
          },
          {
            label: "Reservas Local",
            data: this.obtenerDatosReservasB(),
            borderColor: this.colores[2],
            backgroundColor: this.colores[2],
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
    this.charts.push(chart);
  }

  renderSalesChart(ventasPorDia: SeriePoint[]): void {
    if (!this.salesCanvas?.nativeElement) return;
    const ctx = this.salesCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ventasPorDia.map(p => p.label),
        datasets: [{
          label: 'Ventas',
          data: ventasPorDia.map(p => p.value),
          backgroundColor: 'rgba(13,110,253,0.1)',
          borderColor: 'rgba(13,110,253,1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
    this.charts.push(chart);
  }

  renderTopProductsChart(topProductos: TopProduct[]): void {
    if (!this.topProductsCanvas?.nativeElement) return;
    const ctx = this.topProductsCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = topProductos.map(p => p.nombre);
    const data = topProductos.map(p => p.cantidad);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Cantidad vendida',
          data,
          backgroundColor: 'rgba(25,135,84,0.7)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
    this.charts.push(chart);
  }

  renderCategoriesChart(): void {
    if (!this.categoriesCanvas?.nativeElement) return;
    const ctx = this.categoriesCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Platillos', 'Bebidas', 'Postres'],
        datasets: [{
          data: [45, 35, 20],
          backgroundColor: ['rgba(13,110,253,0.8)', 'rgba(220,53,69,0.8)', 'rgba(255,193,7,0.8)'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { position: 'right' } }
      }
    });
    this.charts.push(chart);
  }

  // ========== MÉTODOS DE DATOS ==========
  obtenerDatosPlatillos(): number[] {
    if (this.filtroTiempo === 'mes') return [120, 80, 150, 200];
    if (this.filtroTiempo === 'anio') return [1500, 1200, 1800, 2500];
    return [20, 10, 15, 25]; // semana
  }

  obtenerDatosBubbletea(): number[] {
    if (this.filtroTiempo === 'mes') return [30, 45, 120, 60];
    if (this.filtroTiempo === 'anio') return [350, 480, 1200, 650];
    return [15, 22, 62, 20]; // semana
  }

  obtenerDatosVentas(): number[] {
    if (this.filtroTiempo === 'mes') return [300, 450, 320, 500];
    if (this.filtroTiempo === 'anio') return [3500, 4200, 3800, 5100, 4900, 5500, 6000];
    return [150, 230, 180, 320, 290, 400, 380]; // semana
  }

  obtenerDatosReservasA(): number[] {
    if (this.filtroTiempo === 'mes') return [50, 70, 60, 90];
    if (this.filtroTiempo === 'anio') return [200, 280, 350, 420];
    return [10, 25, 15, 30]; // semana
  }

  obtenerDatosReservasB(): number[] {
    if (this.filtroTiempo === 'mes') return [80, 60, 90, 100];
    if (this.filtroTiempo === 'anio') return [350, 320, 400, 450];
    return [20, 15, 28, 40]; // semana
  }
}
