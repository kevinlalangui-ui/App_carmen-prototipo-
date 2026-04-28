import { Component, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/usuarios/auth.service';
import { EmailValidator } from '../../../../core/validators/email.validator';
import { DniValidator } from '../../../../core/validators/dni.validator';

@Component({
  selector: 'app-add-member',
  imports: [ReactiveFormsModule],
  templateUrl: './add-member.html',
  styleUrl: './add-member.scss',
})
export class AddMember {
  fnCloseAddMember = output();
  addMemberForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.addMemberForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, EmailValidator]],
      telefono: ['', [Validators.required]],
      dni: ['', [Validators.required, DniValidator]],
      estado_socio: ['no-activo', Validators.required],
      tipo_socio: ['alumno', Validators.required],
    });
  }

  guardar() {
    if (this.addMemberForm.invalid) {
      this.addMemberForm.markAllAsTouched();
      return;
    }

    const formValue = this.addMemberForm.value;

    const payload = {
      informacionPersonalModel: {
        identificacion: formValue.dni,
        nombres: formValue.nombre,
        apellidos: formValue.apellidos,
        correo: formValue.email,
        telefono: formValue.telefono,
        contrasena: null,
      },
      estado_Socio: formValue.estado_socio,
      tipo_socio: formValue.tipo_socio,
      ultimo_pago: null,
      fecha_vencimiento: null,
      historial_pagos: [],
      actividades: {},
    };

    this.authService.guardar(payload).subscribe({
      next: (data) => {
        console.log('Socio guardado:', data);
        this.fnCloseAddMember.emit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
