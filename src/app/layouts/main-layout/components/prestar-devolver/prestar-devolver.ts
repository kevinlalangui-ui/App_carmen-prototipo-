import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { PrestamoService, objeto } from '../../services/prestamo.service';

@Component({
  selector: 'app-prestar-devolver',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatTabsModule],
  templateUrl: './prestar-devolver.html',
  styleUrl: './prestar-devolver.scss',
})
export class PrestarDevolverComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<PrestarDevolverComponent>);
  private prestamoService = inject(PrestamoService);

  disponibles: objeto[] = [];
  prestados: objeto[] = [];

  //prestar
  herramientaSeleccionadaId: number | null = null;
  entidadAjena = '';
  anotacionesPrestamo = '';

  //devolver
  herramientaDevueltaId: number | null = null;
  anotacionesDevolucion = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.disponibles = this.prestamoService.getDisponibles();
    this.prestados = this.prestamoService.getPrestados();
  }

  prestar(): void {
    if (!this.herramientaSeleccionadaId || !this.entidadAjena.trim()) return;
    this.prestamoService.prestarObjeto(this.herramientaSeleccionadaId);
    this.limpiarPrestamo();
    this.cargarDatos();
  }

  devolver(): void {
    if (!this.herramientaDevueltaId) return;
    this.prestamoService.devolverObjeto(this.herramientaDevueltaId);
    this.limpiarDevolucion();
    this.cargarDatos();
  }

  limpiarPrestamo(): void {
    this.herramientaSeleccionadaId = null;
    this.entidadAjena = '';
    this.anotacionesPrestamo = '';
  }

  limpiarDevolucion(): void {
    this.herramientaDevueltaId = null;
    this.anotacionesDevolucion = '';
  }

  close(): void {
    this.dialogRef.close();
  }
}
