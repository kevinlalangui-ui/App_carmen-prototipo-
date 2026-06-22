import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GastoIngresoService, Ingreso, Gasto } from '../../services/gasto-ingreso.service';
import { AddIngresoComponent } from '../add-ingreso/add-ingreso';
import { AddGastoComponent } from '../add-gasto/add-gasto';

export interface Movimiento {
  id: string;
  fecha: Date;
  descripcion: string;
  monto: number;
  tipo: 'Ingreso' | 'Gasto';
  origen: 'Manual' | 'Automático';
}

@Component({
  selector: 'app-contabilidad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './contabilidad.html',
  styleUrls: ['./contabilidad.scss'],
})
export class ContabilidadComponent implements OnInit {
  private gastoIngresoService = inject(GastoIngresoService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private confirmDialog = inject(ConfirmDialogService);

  movimientos = signal<Movimiento[]>([]);
  cargando = signal(false);
  errorCarga = signal<string | null>(null);

  filtroTipo = signal<'todos' | 'Ingreso' | 'Gasto'>('todos');
  filtroOrigen = signal<'todos' | 'Manual' | 'Automático'>('todos');
  searchTerm = signal('');

  displayedColumns: string[] = ['fecha', 'descripcion', 'origen', 'tipo', 'monto', 'acciones'];

  movimientosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const tipo = this.filtroTipo();
    const origen = this.filtroOrigen();

    return this.movimientos().filter(m => {
      const matchTerm = !term ||
        m.descripcion.toLowerCase().includes(term) ||
        m.fecha.toLocaleDateString().includes(term);
      const matchTipo = tipo === 'todos' || m.tipo === tipo;
      const matchOrigen = origen === 'todos' || m.origen === origen;
      return matchTerm && matchTipo && matchOrigen;
    });
  });

  totalIngresos = computed(() =>
    this.movimientosFiltrados().filter(m => m.tipo === 'Ingreso').reduce((sum, m) => sum + m.monto, 0)
  );

  totalGastos = computed(() =>
    this.movimientosFiltrados().filter(m => m.tipo === 'Gasto').reduce((sum, m) => sum + m.monto, 0)
  );

  balance = computed(() => this.totalIngresos() - this.totalGastos());

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.errorCarga.set(null);

    Promise.all([
      this.gastoIngresoService.getIngresos().toPromise(),
      this.gastoIngresoService.getGastos().toPromise(),
    ])
      .then(([ingresos, gastos]) => {
        const movs: Movimiento[] = [];

        (ingresos || []).forEach((i: Ingreso) => {
          const esAutomatico = i.descripcion?.startsWith('Nuevo socio:') || i.descripcion?.startsWith('Renovación socio:');
          movs.push({
            id: i.id || '',
            fecha: new Date(i.fechaIngreso),
            descripcion: i.descripcion,
            monto: i.monto,
            tipo: 'Ingreso',
            origen: esAutomatico ? 'Automático' : 'Manual',
          });
        });

        (gastos || []).forEach((g: Gasto) => {
          movs.push({
            id: g.id || '',
            fecha: new Date(g.fecha_gasto),
            descripcion: g.descripcion,
            monto: g.monto,
            tipo: 'Gasto',
            origen: 'Manual',
          });
        });

        movs.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

        this.movimientos.set(movs);
        this.cargando.set(false);
        this.cdr.detectChanges();
      })
      .catch((err) => {
        console.error('Error cargando datos de contabilidad:', err);
        this.errorCarga.set('No se pudieron cargar los datos financieros.');
        this.cargando.set(false);
        this.cdr.detectChanges();
      });
  }

  abrirAddIngreso(): void {
  const dialogRef = this.dialog.open(AddIngresoComponent, { width: '500px' });
  dialogRef.afterClosed().subscribe((result: Omit<Ingreso, 'id'> | undefined) => {
    if (result) {
      this.gastoIngresoService.addIngreso(result).subscribe({
        next: () => {
          console.log('Ingreso añadido correctamente');
          this.cargarDatos(); 
        },
        error: (err) => {
          console.error('Error añadiendo ingreso:', err);
        },
      });
    }
  });
}

abrirAddGasto(): void {
  const dialogRef = this.dialog.open(AddGastoComponent, { width: '500px' });
  dialogRef.afterClosed().subscribe((result: Omit<Gasto, 'id'> | undefined) => {
    if (result) {
      this.gastoIngresoService.addGasto(result).subscribe({
        next: () => {
          console.log('Gasto añadido correctamente');
          this.cargarDatos(); 
        },
        error: (err) => {
          console.error('Error añadiendo gasto:', err);
        },
      });
    }
  });
}

  eliminarMovimiento(mov: Movimiento): void {
  this.confirmDialog.confirm({
    title: 'Eliminar movimiento',
    message: `¿Estás seguro de que quieres eliminar el ${mov.tipo.toLowerCase()} "${mov.descripcion}" de ${mov.monto}€?`,
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar',
  }).subscribe((confirmed) => {
    if (!confirmed) return;
    const deleteFn = mov.tipo === 'Ingreso'
      ? this.gastoIngresoService.deleteIngreso(mov.id)
      : this.gastoIngresoService.deleteGasto(mov.id);

    deleteFn.subscribe({
      next: () => this.cargarDatos(),
      error: (err) => console.error(`Error eliminando ${mov.tipo.toLowerCase()}:`, err),
    });
  });
}

  clearSearch(): void {
    this.searchTerm.set('');
  }

  onTipoChange(value: string): void {
    this.filtroTipo.set(value as 'todos' | 'Ingreso' | 'Gasto');
  }

  onOrigenChange(value: string): void {
    this.filtroOrigen.set(value as 'todos' | 'Manual' | 'Automático');
  }
}