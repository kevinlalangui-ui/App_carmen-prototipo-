import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GastoIngresoService, Ingreso } from '../../services/gasto-ingreso.service';
import { AddIngresoComponent } from '../add-ingreso/add-ingreso';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-lista-ingresos',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule, MatTooltipModule],
  templateUrl: './lista-ingresos.html',
  styleUrl: './lista-ingresos.scss',
})
export class ListaIngresosComponent implements OnInit {
  private ingresoService = inject(GastoIngresoService);
  private dialog = inject(MatDialog);

  ingresos: Ingreso[] = [];

  displayedColumns: string[] = ['fecha', 'descripcion', 'monto', 'acciones'];

  ngOnInit(): void {
    this.cargarIngresos();
  }

  cargarIngresos(): void {
    this.ingresos = [...this.ingresoService.getIngresos()];
  }

  abrirAddIngreso(): void {
    const dialogRef = this.dialog.open(AddIngresoComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarIngresos();
      }
    });
  }

  eliminarIngreso(id: number, descripcion: string, monto: number): void {
    if (confirm(`¿Eliminar ingreso "${descripcion}" de ${monto}€?`)) {
      this.ingresoService.deleteIngreso(id);
      this.cargarIngresos();
    }
  }
}
