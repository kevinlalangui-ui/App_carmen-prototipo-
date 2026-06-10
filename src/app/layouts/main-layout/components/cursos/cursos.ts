import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DeleteMember } from '../delete-member/delete-member';
import { AddCurso } from '../add-curso/add-curso';
import { ActividadService } from '../../../../core/services/actividad/actividad.service';

export interface Curso {
  id: string;
  actividadId: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  profesor: string;
  horario: string;
  dias: string;
  plazas: number;
  inscritos: number;
  activo: boolean;
  fechaFin: string;
  selected: boolean;
}

@Component({
  selector: 'app-cursos',
  standalone: true,
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.scss'],
  imports: [
    CommonModule,
    MatMenuModule,
    FormsModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CursosComponent implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private actividadService = inject(ActividadService);

  fabAbierto = false;
  filtrosAbiertos = false;
  textoBusqueda = '';

  filtros = [
    { label: 'Activos', activo: false },
    { label: 'Inactivos', activo: false },
    { label: 'Con plazas disponibles', activo: false },
    { label: 'Sin plazas', activo: false },
  ];

  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];

  get selectedCursos(): Curso[] {
    return this.cursos.filter((c) => c.selected);
  }
  get allSelected(): boolean {
    return this.cursos.length > 0 && this.cursos.every((c) => c.selected);
  }
  get someSelected(): boolean {
    return this.cursos.some((c) => c.selected) && !this.allSelected;
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.cursosFiltrados.forEach((c) => (c.selected = checked));
  }

  onCheckChange(): void {}

  ngOnInit(): void {
    this.actividadService.getAll().subscribe((actividades: any[]) => {
      this.cursos = actividades.flatMap((a: any) =>
        (a.cursos ?? []).map((c: any) => ({
          id:          c.id                        ?? '',
          actividadId: a.id                        ?? '',  // ← añadir
          nombre:      c.nombre_curso              ?? '',
          descripcion: a.nombre_actividad          ?? '',
          ubicacion:   c.lugar                     ?? '',
          profesor:    c.profesor?.nombre_profesor ?? '',
          horario:     c.duracion                  ?? '',
          dias:        (c.horarios ?? []).join(', '),
          plazas:      c.plazas                    ?? 0,
          inscritos:   (c.alumnos ?? []).length,
          activo:      c.fecha_fin ? new Date(c.fecha_fin) >= new Date() : true,
          fechaFin:    c.fecha_fin                 ?? '',
          selected:    false,
        }))
      );
      this.cursosFiltrados = [...this.cursos];
    });
  }

  filtrarCursos(): void {
    const texto = this.textoBusqueda.toLowerCase().trim();
    const filtrosActivos = this.filtros.filter((f) => f.activo).map((f) => f.label);

    this.cursosFiltrados = this.cursos.filter((c) => {
      const matchTexto =
        !texto ||
        c.nombre.toLowerCase().includes(texto) ||
        c.profesor.toLowerCase().includes(texto) ||
        c.ubicacion.toLowerCase().includes(texto) ||
        c.descripcion.toLowerCase().includes(texto);

      let matchFiltro = true;
      if (filtrosActivos.includes('Activos')) matchFiltro = matchFiltro && c.activo;
      if (filtrosActivos.includes('Inactivos')) matchFiltro = matchFiltro && !c.activo;
      if (filtrosActivos.includes('Con plazas disponibles'))
        matchFiltro = matchFiltro && c.inscritos < c.plazas;
      if (filtrosActivos.includes('Sin plazas'))
        matchFiltro = matchFiltro && c.inscritos >= c.plazas;

      return matchTexto && matchFiltro;
    });
  }

  toggleFiltros(): void {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  toggleChip(filtro: { label: string; activo: boolean }): void {
    filtro.activo = !filtro.activo;
    this.filtrarCursos();
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onEliminar(curso?: Curso): void {
    const dialogRef = this.dialog.open(DeleteMember, { width: '400px' });

    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (!confirmed) return;

      if (curso) {
        // Eliminar uno desde el menú de tres puntos
        this.actividadService.deleteCurso(curso.actividadId, curso.id).subscribe({
          next: () => {
            this.cursos = this.cursos.filter(c => c !== curso);
            this.cursosFiltrados = this.cursosFiltrados.filter(c => c !== curso);
          },
          error: (err: any) => console.error('Error DELETE curso:', err),
        });
      } else {
        // Eliminar seleccionados desde el botón de la toolbar
        const seleccionados = this.cursos.filter(c => c.selected);
        let completados = 0;

        seleccionados.forEach(c => {
          this.actividadService.deleteCurso(c.actividadId, c.id).subscribe({
            next: () => {
              completados++;
              if (completados === seleccionados.length) {
                this.cursos = this.cursos.filter(x => !x.selected);
                this.cursosFiltrados = this.cursosFiltrados.filter(x => !x.selected);
              }
            },
            error: (err: any) => console.error(`Error DELETE curso ${c.id}:`, err),
          });
        });
      }
    });
  }

  onModificar(): void {
    console.log('Modificar');
  }

  openAddCurso(): void {
    const dialogRef = this.dialog.open(AddCurso, {
      width: '400px',
      data: { cursosExistentes: this.cursos.map(c => c.descripcion).filter(Boolean) },
    });

    dialogRef.afterClosed().subscribe((payload: any) => {
      if (!payload) return;
      this.actividadService.add(payload).subscribe({
        next: () => {
          // Recargar la lista para ver la nueva actividad/curso
          this.actividadService.getAll().subscribe((actividades: any[]) => {
            this.cursos = actividades.flatMap((a: any) =>
              (a.cursos ?? []).map((c: any) => ({
                id:          c.id                         ?? '',
                actividadId: a.id                        ?? '',
                nombre:      c.nombre_curso               ?? '',
                descripcion: a.nombre_actividad           ?? '',
                ubicacion:   c.lugar                      ?? '',
                profesor:    c.profesor?.nombre_profesor  ?? '',
                horario:     c.duracion                   ?? '',
                dias:        (c.horarios ?? []).join(', '),
                plazas:      c.plazas                     ?? 0,
                inscritos:   (c.alumnos ?? []).length,
                activo:      c.fecha_fin ? new Date(c.fecha_fin) >= new Date() : true,
                fechaFin:    c.fecha_fin                  ?? '',
                selected:    false,
              }))
            );
            this.cursosFiltrados = [...this.cursos];
          });
        },
        error: (err: any) => console.error('Error ADD actividad:', err),
      });
    });
  }

  submit(): void {
    this.router.navigate(['/main']);
  }
  onPrestamos() {
    this.router.navigate(['/prestamos']);
  }
  onGastos() {
    this.router.navigate(['/gastos']);
  }
  onIngresos() {
    this.router.navigate(['/ingresos']);
  }

}
