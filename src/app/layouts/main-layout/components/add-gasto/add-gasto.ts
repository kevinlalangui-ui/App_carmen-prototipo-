import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GastoIngresoService } from '../../services/gasto-ingreso.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NativeDateAdapter, MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-gasto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],

  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  templateUrl: './add-gasto.html',
  styleUrl: './add-gasto.scss',
})
export class AddGastoComponent {
  private dialogRef = inject(MatDialogRef<AddGastoComponent>);
  private gastoService = inject(GastoIngresoService);

  monto: number | null = null;
  descripcion = '';
  fecha = '';
  fechaDate: Date | null = null;
  errorMonto = '';

  onFechaChange(event: any): void {
    if (event.value) {
      this.fecha = formatDate(event.value, 'dd-MM-yyyy', 'en-US');
    }
  }

  validarMonto(): boolean {
    if (this.monto === null || this.monto === undefined) {
      this.errorMonto = '';
      return false;
    }
    if (this.monto <= 0) {
      this.errorMonto = 'El monto debe ser mayor que 0';
      return false;
    }
    this.errorMonto = '';
    return true;
  }

  confirm(): void {
    if (!this.validarMonto()) {
      return;
    }

    if (!this.monto || !this.descripcion.trim() || !this.fecha.trim()) {
      return;
    }
    this.gastoService.addGasto({
      monto: this.monto,
      descripcion: this.descripcion.trim(),
      fechaGasto: this.fecha,
    });
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
