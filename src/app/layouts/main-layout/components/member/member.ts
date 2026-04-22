import { Component, inject, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
  ],
  templateUrl: './member.html',
  styleUrl: './member.scss',
})
export class Member {
  private dialogRef = inject(MatDialogRef<Member>);
  private fb = inject(FormBuilder);

  form : FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      name:      [data?.nombres   ?? ''],
      apellidos: [data?.apellidos ?? ''],
      email:     [data?.correo    ?? ''],
      phone:     [data?.tel       ?? ''],
      dni:       [data?.dni       ?? ''],
      profesor:  [data?.profesor === 'Si' ? true : false],
      activo:    [data?.estado === 'Activo' ? true : false],
    });
  }

  esEdicion(): boolean { return !!this.data; }

  guardar() {
    const val = this.form.value;
    this.dialogRef.close({
      nombres:   val.name,
      apellidos: val.apellidos,
      correo:    val.email,
      tel:       val.phone,
      dni:       val.dni,
      profesor:  val.profesor ? 'Si' : 'No',
      estado:    val.activo ? 'Activo' : 'Inactivo',
    });
  }

  cancel() { this.dialogRef.close(null); }
}
