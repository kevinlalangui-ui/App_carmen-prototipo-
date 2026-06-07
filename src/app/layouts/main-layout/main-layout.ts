import { Component, inject, OnInit, signal } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { SociosService } from '../../core/services/socios/socios.service';
import { ActividadesService } from '../../core/services/actividades/actividades.service';

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
  private dialog           = inject(MatDialog);
  private router           = inject(Router);
  private sociosService    = inject(SociosService);
  private actividadService = inject(ActividadesService);

  // Variables
  filtrosAbiertos = false;
  sortColumn: 'nombres' | 'apellidos' | null = null;
  sortAsc = true;
  estadoFiltro: 'todos' | 'Activo' | 'Inactivo' = 'todos';
  profesorFiltro: 'todos' | 'Si' | 'No' = 'todos';
  textoBusqueda = '';
  cargando = false;
  errorCarga: string | null = null;
  fabAbierto = false;
  cursosDisponibles: any[] = [];

  filtros = [
    { label: 'Activo',   activo: false },
    { label: 'Inactivo', activo: false },
    { label: 'Profesor', activo: false },
    { label: 'A → Z',    activo: false },
    { label: 'Z → A',    activo: false },
    { label: '0 → 9',    activo: false },
    { label: '9 → 0',    activo: false },
  ];

  socios: Socio[] = [];

  // ── Ciclo de vida ────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.cargarSocios();
  }

  // ── Carga ────────────────────────────────────────────────────────────────
  cargarSocios(): void {
    this.cargando = true;
    this.errorCarga = null;

    this.sociosService.getSocios().subscribe({
      next: (data: any[]) => {
        this.socios = (data ?? []).map((s: any) => this.mapearSocio(s));
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error GET /socio/all:', err);
        this.errorCarga = 'No se pudo cargar la lista de socios.';
        this.cargando = false;
      },
    });
  }

  private mapearSocio(s: any): Socio {
    const info = s.informacion_personal ?? {};
    const cursos: string[] = Object.values(s.actividades ?? {}).flatMap(
      (a: any) => (a.cursos ?? []).map((c: any) => c.nombreCurso ?? c.id ?? '')
    );
    return {
      id:             s.id               ?? s._id       ?? '',
      nombres:        info.nombres        ?? '',
      apellidos:      info.apellidos      ?? '',
      correo:         info.correo         ?? '',
      tel:            info.telefono       ?? '',
      dni:            info.identificacion ?? '',
      estado:         s.es_activo ? 'Activo' : 'Inactivo',
      fechaVenc:      s.fecha_vencimiento ?? '',
      profesor:       (Array.isArray(s.tipo_socio) ? s.tipo_socio : [])
        .some((t: string) => t?.toLowerCase() === 'profesor') ? 'Si' : 'No',
      cursos,
      cursosAbiertos: false,
      selected:       false,
    };
  }

  // ── Getters ──────────────────────────────────────────────────────────────
  get sociosFiltrados(): Socio[] {
    let lista = this.socios;
    if (this.estadoFiltro !== 'todos')   lista = lista.filter(s => s.estado === this.estadoFiltro);
    if (this.profesorFiltro !== 'todos') lista = lista.filter(s => s.profesor === this.profesorFiltro);
    if (this.textoBusqueda.trim()) {
      const texto = this.textoBusqueda.toLowerCase().trim();
      lista = lista.filter(s =>
        s.nombres.toLowerCase().includes(texto)   ||
        s.apellidos.toLowerCase().includes(texto) ||
        s.correo.toLowerCase().includes(texto)    ||
        s.dni.toLowerCase().includes(texto)
      );
    }
    return lista;
  }

  get allSelected(): boolean  { return this.sociosFiltrados.length > 0 && this.sociosFiltrados.every(s => s.selected); }
  get someSelected(): boolean { return this.sociosFiltrados.some(s => s.selected) && !this.allSelected; }
  get selectedSocios(): Socio[] { return this.socios.filter(s => s.selected); }

  // ── Acciones tabla ───────────────────────────────────────────────────────
  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.sociosFiltrados.forEach(s => (s.selected = checked));
  }

  onCheckChange(): void {}

  filtrarEstado(): void {
    this.estadoFiltro = this.estadoFiltro === 'todos' ? 'Activo' : this.estadoFiltro === 'Activo' ? 'Inactivo' : 'todos';
  }

  filtrarProfesor(): void {
    this.profesorFiltro = this.profesorFiltro === 'todos' ? 'Si' : this.profesorFiltro === 'Si' ? 'No' : 'todos';
  }

  sortBy(col: 'nombres' | 'apellidos'): void {
    if (this.sortColumn === col) { this.sortAsc = !this.sortAsc; } else { this.sortColumn = col; this.sortAsc = true; }
    this.socios.sort((a, b) => this.sortAsc ? a[col].localeCompare(b[col]) : b[col].localeCompare(a[col]));
  }

  toggleFiltros(): void { this.filtrosAbiertos = !this.filtrosAbiertos; }
  toggleChip(filtro: any): void { filtro.activo = !filtro.activo; }

  // ── Dialogs ──────────────────────────────────────────────────────────────
  openAddMember(): void {
    const ref = this.dialog.open(AddMember, { width: '480px' });
    ref.afterClosed().subscribe((ok: boolean) => { if (ok) this.cargarSocios(); });
  }

  onModificarSocio(socio: Socio): void {
    const ref = this.dialog.open(ModifyMember, { width: '480px', data: socio });
    ref.afterClosed().subscribe((ok: boolean) => { if (ok) this.cargarSocios(); });
  }

  onEliminar(socio?: Socio): void {
    const ids = socio
      ? [socio.id]
      : this.socios.filter(s => s.selected).map(s => s.id);

    const ref = this.dialog.open(DeleteMember, { width: '400px', data: { ids } });
    ref.afterClosed().subscribe((ok: boolean) => { if (ok) this.cargarSocios(); });
  }

  openAddCurso(): void {
    const ref = this.dialog.open(AddCurso, { data: { cursosExistentes: this.cursosDisponibles } });
    ref.afterClosed().subscribe((nuevoCurso: any) => {
      if (!nuevoCurso) return;
      this.actividadService.add(nuevoCurso).subscribe({
        next: () => this.cargarSocios(),
        error: (err: any) => console.error('Error ADD actividad:', err),
      });
    });
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  goToRegister(): void { this.router.navigate(['/register']); }
  cursos(): void       { this.router.navigate(['/cursos']); }
  submit(): void       { this.router.navigate(['/main']); }
  onPrestamos(): void  { this.router.navigate(['/prestamos']); }
  onGastos(): void     { this.router.navigate(['/gastos']); }
  onIngresos(): void   { this.router.navigate(['/ingresos']); }

  // ── Otros ────────────────────────────────────────────────────────────────
  onModificar(): void { console.log('Modificar'); }
  onPagos(): void     { console.log('Pagos'); }
  onCorreo(): void    { console.log('Correo', this.selectedSocios); }
}
