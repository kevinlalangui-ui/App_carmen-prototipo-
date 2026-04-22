import { Component, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import{AuthService} from '../../../../core/services/usuarios/auth.service';
import{EmailValidator} from '../../../../core/validators/email.validator';
import{DniValidator} from '../../../../core/validators/dni.validator';
import {NgClass} from '@angular/common';
import { submit } from '@angular/forms/signals';
@Component({
  selector: 'app-add-member',
  imports: [ReactiveFormsModule],
  templateUrl: './add-member.html',
  styleUrl: './add-member.scss',
})
export class AddMember {
  fnCloseAddMember= output();
  addMemberForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    ) {
    this.addMemberForm = this.formBuilder.group({
      "nombre": ["", Validators.required],
      "apellidos": ["", Validators.required],
      "email": ["", [Validators.required,EmailValidator]],
      "telefono": ["", [Validators.required]],
      "dni":["", [Validators.required ,DniValidator]],
      estado_socio: ["no-activo", Validators.required], // 'no-activo' será el valor inicial
      tipo_socio: ["alumno", Validators.required]

    })
  }

  guardar(){
    if(this.addMemberForm.invalid){
      alert("Formulario no válido")
      return;
    }
    this.authService.guardar(this.addMemberForm.value).subscribe({
      next: (data )=> {
        console.log(data);

      },
      error:(err) => {
        console.log(err)
      }

    })

  }
}
