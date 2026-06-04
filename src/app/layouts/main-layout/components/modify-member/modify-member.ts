import { Component, Inject, inject, output } from '@angular/core';
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
import{SociosService} from '../../../../core/services/socios/socios.service';

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
  //cerrar signal
  fntoggleModifyMember= output();
//dependencias
  private dialogRef = inject(MatDialogRef<ModifyMember>);
  formModifyMember: FormGroup;
  //signal que almacene el socios que queremos editar

  constructor(
    private formBuilder: FormBuilder,
    private sociosService :SociosService,
  ) {

    this.formModifyMember = this.formBuilder.group({
      "name":['',[Validators.required]],
      "apellidos":['',[Validators.required]],
      "email":['',[Validators.required,EmailValidator]],
      "phone":['',[Validators.required,Validators.minLength(9),Validators.maxLength(9)]],
      "dni":['',[Validators.required , DniValidator]],
      "profesor":[false,[Validators.required]],
      "activo":[true,[Validators.required]],
    });
  }

  guardarDatos() {
    if (this.formModifyMember.invalid) {
      alert("Formulario no válido");
      return;
    }

    this.sociosService.update(this.formModifyMember.value,).subscribe({
      next: (response) => {
        console.log(response);
        this.fntoggleModifyMember.emit()

      },
      error: (err) => {
        console.log(err)
      }
    });
  }

}
