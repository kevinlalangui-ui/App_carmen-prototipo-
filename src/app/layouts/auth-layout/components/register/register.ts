import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/usuarios/auth.service';
import { AlertasService } from '../../../../core/utils/alertas.service'; // 👈

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  form: any;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertasService: AlertasService,
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      correo:     this.form.value.email,
      contrasena: this.form.value.password,
    };

    this.alertasService.showLoader('Iniciando sesión...', 'Espere unos segundos');

    this.authService.guardar(payload).subscribe({
      next: () => {
        this.alertasService.hide();
        this.router.navigate(['/main']);
      },
      error: (err) => {
        this.alertasService.hide();
        console.error(err);
      }
    });
  }
}
