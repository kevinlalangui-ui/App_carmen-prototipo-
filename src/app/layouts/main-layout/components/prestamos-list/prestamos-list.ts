import { Component, inject, OnInit, signal, computed,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  styleUrl: './prestamos-list.scss',
})
export class PrestamosListComponent implements OnInit {
  private prestamoService = inject(PrestamoService);
  private dialog = inject(MatDialog);
  private confirmDialog = inject(ConfirmDialogService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);


  todas = signal<Objeto[]>([]);
  prestadas = signal<Objeto[]>([]);
  disponibles = signal<Objeto[]>([]);
  searchTerm = signal('');
  fabAbierto = false;

  todasFiltradas = computed(() =>
    this.todas().filter((h) => h.nombre.toLowerCase().includes(this.searchTerm().toLowerCase())),
  );

  prestadasFiltradas = computed(() =>
    this.prestadas().filter((h) =>
      h.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()),
    ),
  );

  disponiblesFiltradas = computed(() =>
    this.disponibles().filter((h) =>
      h.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()),
    ),
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
      if (result){
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

  // Devuelve el nombre de la persona/entidad a la que se prestó la herramienta
  getPrestadoA(objeto: Objeto): string {
    // Buscar el préstamo activo (sin fecha de fin)
    const prestamoActivo = objeto.prestamos?.find(p => !p.finPrestamo);
    return prestamoActivo?.entidadAjena || 'No disponible';
  }
  submit(): void {
    this.router.navigate(['/main']);
  }
  onPrestamos() {
    this.router.navigate(['/prestamos']);
  }
  onGastos() {
    this.router.navigate(['/gastos']);
  }
  onIngresos() {
    this.router.navigate(['/ingresos']);
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}

