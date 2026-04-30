import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { PrestamoService } from '../../services/prestamo.service';

@Component({
  selector: 'app-add-prestamo',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './add-prestamo.html',
  styleUrl: './add-prestamo.scss',
})
export class AddPrestamo {
  private dialogRef = inject(MatDialogRef<AddPrestamo>);
  private prestamoService = inject(PrestamoService);

  nombre = '';
  descripcion = '';
  sitioGuardado = '';

  confirm() {
    if (!this.nombre.trim()) return;
    this.prestamoService.addObjeto(this.nombre, this.descripcion, this.sitioGuardado);
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
