import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { GastoIngresoService, Ingreso } from '../../services/gasto-ingreso.service';
import { AddIngresoComponent } from '../add-ingreso/add-ingreso';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';

@Component({
  selector: 'app-lista-ingresos',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './lista-ingresos.html',
  styleUrl: './lista-ingresos.scss',
})
export class ListaIngresosComponent implements OnInit {
  private ingresoService = inject(GastoIngresoService);
  private dialog         = inject(MatDialog);
  private confirmDialog  = inject(ConfirmDialogService);
  private cdr            = inject(ChangeDetectorRef);

  ingresos   = signal<Ingreso[]>([]);
  searchTerm = signal('');
  cargando   = false;
  errorCarga: string | null = null;

  ingresosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.ingresos().filter(i =>
      i.descripcion.toLowerCase().includes(term) ||
      i.fechaIngreso.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.cargarIngresos();
  }

  cargarIngresos(): void {
    this.cargando = true;
    this.errorCarga = null;

    this.ingresoService.getIngresos().subscribe({
      next: (data) => {
        console.log('Ingreso raw:', JSON.stringify(data[0]));
        this.ingresos.set(data);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error GET /ingresos/all:', err);
        this.errorCarga = 'No se pudo cargar la lista de ingresos.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirAddIngreso(): void {
    const dialogRef = this.dialog.open(AddIngresoComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((result: Omit<Ingreso, 'id'> | undefined) => {
      if (!result) return;
      this.ingresoService.addIngreso(result).subscribe({
        next: (nuevo) => this.ingresos.update(lista => [...lista, nuevo]),
        error: (err)  => console.error('Error añadiendo ingreso:', err),
      });
    });
  }

  eliminarIngreso(id: string | undefined, descripcion: string, monto: number): void {
    if (!id) return;
    this.confirmDialog.confirm({
      title:       'Eliminar ingreso',
      message:     `¿Eliminar el ingreso "${descripcion}" de ${monto}€?`,
      confirmText: 'Sí, eliminar',
      cancelText:  'Cancelar',
    }).subscribe((confirmed) => {
      if (!confirmed) return;
      this.ingresoService.deleteIngreso(id).subscribe({
        next: () => this.ingresos.update(lista => lista.filter(i => i.id !== id)),
        error: (err) => console.error('Error eliminando ingreso:', err),
      });
    });
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }
}