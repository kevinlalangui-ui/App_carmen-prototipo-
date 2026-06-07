import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailValidator } from '../../../../core/validators/email.validator';
import { DniValidator } from '../../../../core/validators/dni.validator';
import { SociosService } from '../../../../core/services/socios/socios.service';

@Component({
  selector: 'app-modify-member',
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
  templateUrl: './modify-member.html',
  styleUrl: './modify-member.scss',
})
export class ModifyMember {
  formModifyMember: FormGroup;

  private dialogRef     = inject(MatDialogRef<ModifyMember>);
  private sociosService = inject(SociosService);

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public socio: any,
  ) {
    this.formModifyMember = this.formBuilder.group({
      name:      [socio?.nombres   ?? '', [Validators.required]],
      apellidos: [socio?.apellidos ?? '', [Validators.required]],
      email:     [socio?.correo    ?? '', [Validators.required, EmailValidator]],
      phone:     [socio?.tel       ?? '', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      dni:       [socio?.dni       ?? '', [Validators.required, DniValidator]],
      profesor:  [socio?.profesor === 'Si', [Validators.required]],
      activo:    [socio?.estado === 'Activo', [Validators.required]],
    });
  }

  private mapToApiSocio(formValue: any): any {
    return {
      informacion_personal: {
        nombres:        formValue.name,
        apellidos:      formValue.apellidos,
        correo:         formValue.email,
        telefono:       formValue.phone,
        identificacion: formValue.dni,
      },
      tipo_socio: formValue.profesor ? ['PROFESOR'] : ['REGULAR'],
      es_activo:  formValue.activo,
    };
  }

  guardarDatos(): void {
    if (this.formModifyMember.invalid) {
      this.formModifyMember.markAllAsTouched();
      return;
    }

    this.sociosService.update(this.mapToApiSocio(this.formModifyMember.value), this.socio?.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err: any) => console.error('Error UPDATE socio:', err),
    });
  }
}
