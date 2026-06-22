import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


function telefonoOEmailRequerido(group: AbstractControl): ValidationErrors | null {
  const email = group.get('email')?.value;
  const phone = group.get('phone')?.value;
  return email || phone ? null : { telefonoOEmail: true };
}

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-member.html',
  styleUrl: './add-member.scss',
})
export class AddMember {
  private dialogRef = inject(MatDialogRef<AddMember>);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;

  socioNumero: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.socioNumero = data?.id ?? 0;

    this.form = this.fb.group({
      name:      [data?.nombres   ?? '', Validators.required],
      apellidos: [data?.apellidos ?? '', Validators.required],
      email:     [data?.correo    ?? ''],
      phone:     [data?.tel       ?? ''],
      dni:       [data?.dni       ?? ''],
      profesor:  [data?.profesor === 'Si' ? true : false],
      activo:    [true],
    }, { validators: telefonoOEmailRequerido });
  }

  esEdicion(): boolean {
    return !!this.data;
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
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

  cancel() {
    this.dialogRef.close(null);
  }
}
