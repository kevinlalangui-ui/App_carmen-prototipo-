import { Component, inject, Inject, signal, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ActividadesService } from '../../../../core/services/actividades/actividades.service';

// Modelo local de curso para la vista de inscripción
interface CursoItem {
  id:     string;
  nombre: string;
}

@Component({
  selector: 'app-cursos-add-member',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './cursos-member.html',
  styleUrl: './cursos-member.scss',
})
export class CursosMember implements OnInit {
  private dialogRef         = inject(MatDialogRef<CursosMember>);
  private actividadesService = inject(ActividadesService);

  // Objeto compatible con la plantilla existente: cursoService.cursos()
  cursoService = {
    cursos: signal<CursoItem[]>([]),
  };

  apuntados = new Set<string>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: { cursosActuales: string[] }) {
    if (data?.cursosActuales) {
      data.cursosActuales.forEach((id) => this.apuntados.add(id));
    }
  }

  ngOnInit(): void {
    this.actividadesService.getActividades().subscribe({
      next: (actividades: any[]) => {
        const cursos: CursoItem[] = actividades.flatMap((a: any) =>
          (a.cursos ?? []).map((c: any) => ({
            id:     c.id          ?? '',
            nombre: c.nombre_curso ?? '',
          }))
        );
        this.cursoService.cursos.set(cursos);
      },
      error: (err: any) => console.error('Error cargando cursos:', err),
    });
  }

  toggleCurso(curso: CursoItem): void {
    if (this.apuntados.has(curso.id)) {
      this.apuntados.delete(curso.id);
    } else {
      this.apuntados.add(curso.id);
    }
  }

  estaApuntado(curso: CursoItem): boolean {
    return this.apuntados.has(curso.id);
  }

  close(): void {
    this.dialogRef.close(null);
  }

  guardar(): void {
    this.dialogRef.close(Array.from(this.apuntados));
  }
}
