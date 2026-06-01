import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SociosService } from '../../../../core/services/socios/socios.service';
import {EmailValidator} from '../../../../core/validators/email.validator';
import{DniValidator} from '../../../../core/validators/dni.validator';
import { maxLength } from '@angular/forms/signals';

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
  //nombre formulario reactivo
  formAddMember: FormGroup;
  private dialogRef = inject(MatDialogRef<AddMember>);

  constructor(
    private formBuilder: FormBuilder,
    private sociosService: SociosService,
  ) {
    this.formAddMember = this.formBuilder.group({
      "name":['',[Validators.required]],
      "apellidos":['',[Validators.required]],
      "email":['',[Validators.required,EmailValidator]],
      "phone":['',[Validators.required,Validators.minLength(9),Validators.maxLength(9)]],
      "dni":['',[Validators.required , DniValidator]],
      "profesor":[false,[Validators.required]],
      "activo":[true,[Validators.required]],
    })
  }

  guardar() {
    if (this.formAddMember.invalid) {
      this.formAddMember.markAllAsTouched();
      return;
    }
    this.sociosService.guardarSocio(this.formAddMember.value).subscribe({
      next: data => {
        console.log(data);
        this.dialogRef.close(data);
      },
      error:(err) =>{
        console.log(err);
      }
    });
  }
  cancel(): void {
    this.dialogRef.close(null);
  }

}
