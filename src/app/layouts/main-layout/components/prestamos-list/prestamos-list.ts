import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PrestamoService, Objeto } from '../../services/prestamo.service';
import { AddPrestamo } from '../add-prestamo/add-prestamo';
import { PrestarDevolverComponent } from '../prestar-devolver/prestar-devolver';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';
import { HistorialPrestamosComponent } from '../historial-prestamos/historial-prestamos';

@Component({
  selector: 'app-prestamos-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './prestamos-list.html',
  styleUrls: ['./prestamos-list.scss'],
})
export class PrestamosListComponent implements OnInit {
  private prestamoService = inject(PrestamoService);
  private dialog = inject(MatDialog);
  private confirmDialog = inject(ConfirmDialogService);
  private cdr = inject(ChangeDetectorRef);

  todas = signal<Objeto[]>([]);
  prestadas = signal<Objeto[]>([]);
  disponibles = signal<Objeto[]>([]);
  searchTerm = signal('');

  todasFiltradas = computed(() =>
    this.todas().filter((h) =>
      h.nombre.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  prestadasFiltradas = computed(() =>
    this.prestadas().filter((h) =>
      h.nombre.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  disponiblesFiltradas = computed(() =>
    this.disponibles().filter((h) =>
      h.nombre.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.prestamoService.getObjetos().subscribe({
      next: (data) => {
        this.todas.set(data);
        this.prestadas.set(data.filter((o) => o.prestadoActual));
        this.disponibles.set(data.filter((o) => !o.prestadoActual));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar objetos', err),
    });
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  abrirAddPrestamo(): void {
    const dialogRef = this.dialog.open(AddPrestamo, { width: '500px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => this.cargarDatos());
      }
    });
  }

  abrirPrestarDevolver(): void {
    const dialogRef = this.dialog.open(PrestarDevolverComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => this.cargarDatos());
      }
    });
  }

  verHistorialGlobal(): void {
    const todosLosPrestamos: { herramienta: string; descripcion: string; prestamo: any }[] = [];
    this.todas().forEach((objeto) => {
      if (objeto.prestamos && objeto.prestamos.length > 0) {
        objeto.prestamos.forEach((p) => {
          todosLosPrestamos.push({
            herramienta: objeto.nombre,
            descripcion: objeto.descripcion,
            prestamo: p,
          });
        });
      }
    });
    this.dialog.open(HistorialPrestamosComponent, {
      width: '95vw',
      maxWidth: '95vw',
      height: '90vh',
      maxHeight: '90vh',
      data: { prestamos: todosLosPrestamos },
    });
  }

  eliminar(nombre: string): void {
    this.confirmDialog
      .confirm({
        title: 'Eliminar herramienta',
        message: `¿Estás seguro de que quieres eliminar "${nombre}"?`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.prestamoService.eliminarObjeto(nombre).subscribe({
            next: () => this.cargarDatos(),
            error: (err) => console.error('Error al Eliminar', err),
          });
        }
      });
  }

  getPrestadoA(objeto: Objeto): string {
    const prestamoActivo = objeto.prestamos?.find((p) => !p.finPrestamo);
    return prestamoActivo?.entidadAjena || 'No disponible';
  }

  obtenerAnotacionActiva(objeto: Objeto): string {
    if (!objeto.prestamos || objeto.prestamos.length === 0) {
      return 'Sin anotaciones';
    }
    const ultimo = objeto.prestamos[objeto.prestamos.length - 1];
    if (ultimo.finPrestamo) {
      return ultimo.finPrestamo.anotaciones || 'Sin anotaciones';
    } else {
      return ultimo.inicioPrestamo?.anotaciones || 'Sin anotaciones';
    }
  }
}