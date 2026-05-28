import { Component, inject, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface CursoForm {
  nombre:      string;
  descripcion: string;
  ubicacion:   string;
  profesor:    string;
  horario:     string;
  plazas:      number | null;
  activo:      boolean;
}

const NUEVO_CURSO_KEY = '__nuevo__';

@Component({
  selector: 'app-add-curso',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './add-curso.html',
  styleUrl: './add-curso.scss',
})
export class AddCurso {
  private dialogRef = inject(MatDialogRef<AddCurso>);

  cursosExistentes: string[] = [];
  profesores: string[] = ['Laura Sánchez', 'Patricia Herrera', 'Javier Castro'];

  nombreSeleccionado = '';
  mostrarInputNuevo  = false;
  nombreNuevo        = '';

  curso: CursoForm = {
    nombre:      '',
    descripcion: '',
    ubicacion:   '',
    profesor:    '',
    horario:     '',
    plazas:      null,
    activo:      true,
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.cursosExistentes = data?.cursosExistentes ?? [];
  }

  onNombreChange(): void {
    if (this.nombreSeleccionado === NUEVO_CURSO_KEY) {
      this.mostrarInputNuevo = true;
      this.curso.nombre      = '';
    } else {
      this.mostrarInputNuevo = false;
      this.curso.nombre      = this.nombreSeleccionado;
    }
  }

  get nombreFinal(): string {
    return this.mostrarInputNuevo ? this.nombreNuevo.trim() : this.curso.nombre.trim();
  }

  get puedeGuardar(): boolean {
    return this.nombreFinal.length > 0;
  }

  confirm(): void {
    if (!this.puedeGuardar) return;
    this.curso.nombre = this.nombreFinal;
    this.dialogRef.close(this.curso);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
