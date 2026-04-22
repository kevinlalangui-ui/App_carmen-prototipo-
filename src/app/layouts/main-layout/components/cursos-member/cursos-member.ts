import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CursoService, Curso } from '../../services/curso';

@Component({
  selector: 'app-cursos-member',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './cursos-member.html',
  styleUrl: './cursos-member.scss',
})
export class CursosMember {
  private dialogRef = inject(MatDialogRef<CursosMember>);
  cursoService = inject(CursoService);

  apuntados = new Set<number>(); // ids de cursos en los que está el socio

  toggleCurso(curso: Curso) {
    if (this.apuntados.has(curso.id)) {
      this.apuntados.delete(curso.id);
    } else {
      this.apuntados.add(curso.id);
    }
  }

  estaApuntado(curso: Curso) {
    return this.apuntados.has(curso.id);
  }

  close() {
    this.dialogRef.close(Array.from(this.apuntados));
  }
  guardar() {
    this.dialogRef.close(Array.from(this.apuntados));
  }
}
