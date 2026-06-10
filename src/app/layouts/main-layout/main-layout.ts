import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { AddMember } from './components/add-member/add-member';
import { ModifyMember } from './components/modify-member/modify-member';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeleteMember } from './components/delete-member/delete-member';
import { AddCurso } from './components/add-curso/add-curso';
import { CursosMember } from './components/cursos-member/cursos-member';
import { RouterModule } from '@angular/router';
import { SociosService } from '../../core/services/socios/socios.service';
import { ActividadService } from '../../core/services/actividad/actividad.service';

interface Socio {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  tel: string;
  dni: string;
  estado: string;
  fechaVenc: string;
  profesor: string;
  selected: boolean;
  cursos: string[];
  cursosAbiertos: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  private dialog          = inject(MatDialog);
  private router          = inject(Router);
  private sociosService    = inject(SociosService);
  private actividadService = inject(ActividadService);
  private cdr             = inject(ChangeDetectorRef);

  filtrosAbiertos = false;
  sortColumn: 'nombres' | 'apellidos' | null = null;
  sortAsc = true;
  estadoFiltro: 'todos' | 'Activo' | 'Inactivo' = 'todos';
  profesorFiltro: 'todos' | 'Si' | 'No' = 'todos';
  textoBusqueda = '';


  cargando = true;
  errorCarga: string | null = null;

  filtros = [
    { label: 'Activo', activo: false },
    { label: 'Inactivo', activo: false },
    { label: 'Profesor', activo: false },
    { label: 'A → Z', activo: false },
    { label: 'Z → A', activo: false },
    { label: '0 → 9', activo: false },
    { label: '9 → 0', activo: false },
  ];

  socios: Socio[] = [];
  cursosDisponibles: string[] = [];


  ngOnInit(): void {
    this.cargarSocios();
    this.cargarActividades();
  }


  cargarSocios(): void {
    this.cargando = true;
    this.errorCarga = null;

    this.sociosService.getSocios().subscribe({
      next: (data: any[]) => {
        console.log('RAW socio[6]:', JSON.stringify(data[6], null, 2));
        this.socios = (data ?? []).map((s: any) => this.mapearSocio(s));
        this.socios = (data ?? []).map((s: any) => this.mapearSocio(s));
        this.cargando = false;
        this.cdr.detectChanges();

      },
      error: (err: any) => {
        console.error('Error GET /socio/all:', err);
        this.errorCarga = 'No se pudo cargar la lista de socios.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarActividades(): void {
    this.actividadService.getAll().subscribe({
      next: (data: any[]) => {
        this.cursosDisponibles = data.flatMap((a: any) =>
          (a.cursos ?? []).map((c: any) => c.nombre_curso ?? '')  // era c.nombreCurso
        );
      },
      error: (err: any) => console.error('Error cargando actividades:', err),
    });
  }

  private mapToApiSocio(s: any): any {
    return {
      informacion_personal: {
        nombres:        s.nombres,
        apellidos:      s.apellidos,
        correo:         s.correo,
        telefono:       s.tel,
        identificacion: s.dni,
        contrasena:     null,
        numero_fiscal:  null,
      },
      tipo_socio:        s.profesor === 'Si' ? ['PROFESOR'] : ['REGULAR'],
      cuotas:            s.cuotas ?? [],
      fecha_vencimiento: s.fechaVenc ?? '',
      actividades:       s.actividades ?? {},
    };
  }


  private mapearSocio(s: any): Socio {
    const info = s.informacion_personal ?? {};

    const cursos: string[] = Object.values(s.actividades ?? {}).flatMap(
      (a: any) => (a.cursos ?? []).map((c: any) => c.nombre_curso ?? c.id ?? '')  // era c.nombreCurso
    );

    return {
      id:        s.id               ?? s._id ?? '',
      nombres:   info.nombres        ?? '',
      apellidos: info.apellidos      ?? '',
      correo:    info.correo         ?? '',
      tel:       info.telefono       ?? '',
      dni:       info.identificacion ?? '',
      estado:    s.es_activo ? 'Activo' : 'Inactivo',
      fechaVenc: s.fecha_vencimiento ?? '',
      profesor:  (Array.isArray(s.tipo_socio) ? s.tipo_socio : [])
                   .some((t: string) => t?.toLowerCase() === 'profesor') ? 'Si' : 'No',
      cursos,
      cursosAbiertos: false,
      selected:       false,
    };
  }


  get sociosFiltrados(): Socio[] {
    let lista = this.socios;

    if (this.estadoFiltro !== 'todos') {
      lista = lista.filter((s) => s.estado === this.estadoFiltro);
    }
    if (this.profesorFiltro !== 'todos') {
      lista = lista.filter((s) => s.profesor === this.profesorFiltro);
    }
    if (this.textoBusqueda.trim()) {
      const texto = this.textoBusqueda.toLowerCase().trim();
      lista = lista.filter(
        (s) =>
          s.nombres.toLowerCase().includes(texto) ||
          s.apellidos.toLowerCase().includes(texto) ||
          s.correo.toLowerCase().includes(texto) ||
          s.dni.toLowerCase().includes(texto),
      );
    }
    return lista;
  }

  get allSelected(): boolean {
    return this.sociosFiltrados.length > 0 && this.sociosFiltrados.every((s) => s.selected);
  }

  get someSelected(): boolean {
    return this.sociosFiltrados.some((s) => s.selected) && !this.allSelected;
  }

  get selectedSocios(): Socio[] {
    return this.socios.filter((s) => s.selected);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.sociosFiltrados.forEach((s) => (s.selected = checked));
  }

  fabAbierto = false;
  onCheckChange(): void {}

  filtrarEstado(): void {
    this.estadoFiltro =
      this.estadoFiltro === 'todos'   ? 'Activo'   :
      this.estadoFiltro === 'Activo'  ? 'Inactivo' : 'todos';
  }

  filtrarProfesor(): void {
    this.profesorFiltro =
      this.profesorFiltro === 'todos' ? 'Si'  :
      this.profesorFiltro === 'Si'    ? 'No'  : 'todos';
  }

  sortBy(col: 'nombres' | 'apellidos'): void {
    if (this.sortColumn === col) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = col;
      this.sortAsc = true;
    }
    this.socios.sort((a, b) => {
      const valA = a[col].toLowerCase();
      const valB = b[col].toLowerCase();
      return this.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  toggleFiltros(): void {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  toggleChip(filtro: any): void {
    filtro.activo = !filtro.activo;
  }

  openAddMember(socio?: Socio): void {
  if (socio) {
    const dialogRef = this.dialog.open(ModifyMember, {
      width: '480px',
      data: socio,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      this.sociosService.update({ id: socio.id, ...this.mapToApiSocio(result) }).subscribe({
        next: () => {
          const index = this.socios.findIndex((s) => s.id === socio.id);
          if (index !== -1) {
            this.socios = [
              ...this.socios.slice(0, index),
              { ...socio, ...result },
              ...this.socios.slice(index + 1),
            ];
          }
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error UPDATE socio:', err),
      });
    });
  } else {
    const dialogRef = this.dialog.open(AddMember, {
      width: '480px',
      data: null,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      this.sociosService.guardar(this.mapToApiSocio(result)).subscribe({
        next: (nuevo: any) => {
          this.socios = [
            ...this.socios,
            {
              ...result,
              id: nuevo.id,
              cursosAbiertos: false,
              selected: false,
              cursos: [],
            },
          ];
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error ADD socio:', err),
      });
    });
    }
  }

  openMember(): void {
    const nextNumero = this.socios.length + 1;
    const dialogRef = this.dialog.open(AddMember, {
      data: { nextNumero },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      this.sociosService.guardar(this.mapToApiSocio(result)).subscribe({
        next: (nuevo: any) => {
          this.socios = [
            ...this.socios,
            {
              ...result,
              id: nuevo.id,
              cursosAbiertos: false,
              selected: false,
              cursos: [],
            },
          ];
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error ADD socio (Member):', err),
      });
    });
  }

  goToRegister(): void { this.router.navigate(['/register']); }
  cursos(): void       { this.router.navigate(['/cursos']); }

  onEliminar(socio?: Socio): void {
    const dialogRef = this.dialog.open(DeleteMember, { width: '400px' });

    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (!confirmed) return;

      if (socio) {

        this.sociosService.deleteSocio(socio.id).subscribe({
          next: () => {
            this.socios = this.socios.filter((s) => s !== socio);
          },
          error: (err: any) => console.error('Error DELETE socio:', err),
        });
      } else {

        const seleccionados = this.socios.filter((s) => s.selected);
        let completados = 0;

        seleccionados.forEach((s) => {
          this.sociosService.deleteSocio(s.id).subscribe({
            next: () => {
              completados++;

              if (completados === seleccionados.length) {
                this.socios = this.socios.filter((x) => !x.selected);
              }
            },
            error: (err: any) => console.error(`Error al eliminar socio ${s.id}:`, err),
          });
        });
      }
    });
  }

  onModificar(): void { console.log('Modificar'); }

  openAddCurso(): void {
    const dialogRef = this.dialog.open(AddCurso, {
      data: { cursosExistentes: this.cursosDisponibles },
    });
    dialogRef.afterClosed().subscribe((nuevoCurso: any) => {
      if (!nuevoCurso) return;
      this.actividadService.add(nuevoCurso).subscribe({
        next: () => this.cargarActividades(),
        error: (err: any) => console.error('Error ADD actividad:', err),
      });
    });
  }

  onPagos(): void  { console.log('Pagos'); }
  onCorreo(): void { console.log('Correo', this.selectedSocios); }
  submit(): void   { this.router.navigate(['/main']); }

  onPrestamos(): void { this.router.navigate(['/prestamos']); }
  onGastos(): void    { this.router.navigate(['/gastos']); }
  onIngresos(): void  { this.router.navigate(['/ingresos']); }

}
