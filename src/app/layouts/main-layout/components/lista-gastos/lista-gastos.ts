import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GastoIngresoService, Gasto } from '../../services/gasto-ingreso.service';
import { AddGastoComponent } from '../add-gasto/add-gasto';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-lista-gastos',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './lista-gastos.html',
  styleUrl: './lista-gastos.scss',
})
export class ListaGastosComponent implements OnInit {
  private gastoService = inject(GastoIngresoService);
  private dialog = inject(MatDialog);

  gastos: Gasto[] = [];
  displayedColumns: string[] = ['fecha', 'descripcion', 'monto', 'acciones'];

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.gastos = [...this.gastoService.getGastos()];
  }

  abrirAddGasto(): void {
    const dialogRef = this.dialog.open(AddGastoComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarGastos();
      }
    });
  }

  eliminarGasto(id: number, descripcion: string, monto: number): void {
    if (confirm(`¿Eliminar gasto "${descripcion}" de ${monto}€?`)) {
      this.gastoService.deleteGasto(id);
      this.cargarGastos();
    }
  }
}
