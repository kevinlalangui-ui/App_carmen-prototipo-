import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { PrestamoService, objeto } from '../../services/prestamo.service';
import { AddPrestamo } from '../add-prestamo/add-prestamo';
import { PrestarDevolverComponent } from '../prestar-devolver/prestar-devolver';

@Component({
  selector: 'app-prestamos-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatTabsModule],
  templateUrl: './prestamos-list.html',
  styleUrl: './prestamos-list.scss',
})
export class PrestamosListComponent implements OnInit {
  private prestamoService = inject(PrestamoService);
  private dialog = inject(MatDialog);

  todas: objeto[] = [];
  prestadas: objeto[] = [];
  disponibles: objeto[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.todas = this.prestamoService.getObjetos();
    this.prestadas = this.prestamoService.getPrestados();
    this.disponibles = this.prestamoService.getDisponibles();
  }

  abrirAddPrestamo(): void {
    const dialogRef = this.dialog.open(AddPrestamo, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarDatos();
      }
    });
  }

  abrirPrestarDevolver(): void {
    const dialogRef = this.dialog.open(PrestarDevolverComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cargarDatos();
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta herramienta?')) {
      this.prestamoService.eliminarObjeto(id);
      this.cargarDatos();
    }
  }
}
