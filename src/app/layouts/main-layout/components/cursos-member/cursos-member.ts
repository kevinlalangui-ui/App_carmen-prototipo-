import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso.service';

interface CursoItem {
  id: string;
  actividadId: string;
  nombre: string;
  nombreActividad: string;
}

@Component({
  selector: 'app-cursos-add-member',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './cursos-member.html',
  styleUrl: './cursos-member.scss',
})
export class CursosMember implements OnInit {
  private dialogRef = inject(MatDialogRef<CursosMember>);
  private cursoService = inject(CursoService);

  cursos: CursoItem[] = [];
  apuntados = new Set<string>();
  cursosActualesNombres: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { cursosActuales: string[] }) {
    this.cursosActualesNombres = data?.cursosActuales ?? [];
  }

  ngOnInit(): void {
    this.cursoService.getActividades().subscribe((actividades: any[]) => {
      this.cursos = actividades.flatMap((a: any) =>
        (a.cursos ?? []).map((c: any) => ({
          id:              c.id              ?? '',
          actividadId:     a.id              ?? '',
          nombre:          c.nombreCurso     ?? c.nombre_curso ?? '',
          nombreActividad: a.nombreActividad ?? a.nombre_actividad ?? '',
        }))
      );

      // Pre-marcar como apuntados los cursos que ya tiene el socio (match por nombre)
      this.cursos.forEach(c => {
        if (this.cursosActualesNombres.includes(c.nombre)) {
          this.apuntados.add(c.id);
        }
      });
    });
  }

  estaApuntado(curso: CursoItem): boolean {
    return this.apuntados.has(curso.id);
  }

  yaEstabaApuntado(curso: CursoItem): boolean {
    return this.cursosActualesNombres.includes(curso.nombre);
  }

  toggleCurso(curso: CursoItem): void {
    if (this.apuntados.has(curso.id)) {
      this.apuntados.delete(curso.id);
    } else {
      this.apuntados.add(curso.id);
    }
  }

  close(): void {
    this.dialogRef.close(null);
  }

  guardar(): void {
    // Solo devuelve inscripciones nuevas (no las que ya tenía)
    const inscripciones = this.cursos
      .filter(c => this.apuntados.has(c.id) && !this.yaEstabaApuntado(c))
      .map(c => ({ actividadId: c.actividadId, cursoId: c.id }));

    this.dialogRef.close(inscripciones);
  }
}
