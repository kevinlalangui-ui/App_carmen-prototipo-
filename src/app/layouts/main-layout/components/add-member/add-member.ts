import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SociosService } from '../../../../core/services/socios/socios.service';
import { EmailValidator } from '../../../../core/validators/email.validator';
import { DniValidator } from '../../../../core/validators/dni.validator';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-member.html',
  styleUrl: './add-member.scss',
})
export class AddMember {
  fntoggleAddMember = output();
  fnSocioGuardado   = output();

  formAddMember: FormGroup;

  private sociosService = inject(SociosService);

  constructor(private formBuilder: FormBuilder) {
    this.formAddMember = this.formBuilder.group({
      name:      ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email:     ['', [Validators.required, EmailValidator]],
      phone:     ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      dni:       ['', [Validators.required, DniValidator]],
      profesor:  [false, [Validators.required]],
      activo:    [true,  [Validators.required]],
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
      tipo_socio:        formValue.profesor ? ['PROFESOR'] : ['REGULAR'],
      cuotas:            [],
      fecha_vencimiento: '',
      actividades:       {},
    };
  }

  guardar(): void {
    if (this.formAddMember.invalid) {
      this.formAddMember.markAllAsTouched();
      return;
    }

    this.sociosService.guardarSocio(this.mapToApiSocio(this.formAddMember.value)).subscribe({
      next: () => {
        this.fnSocioGuardado.emit();
        this.fntoggleAddMember.emit();
      },
      error: (err: any) => {
        console.error('Error ADD socio:', err);
      },
    });
  }
}
