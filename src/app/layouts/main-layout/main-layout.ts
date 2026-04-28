import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { AddMember } from './components/add-member/add-member';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Member } from './components/member/member';
import { DeleteMember } from './components/delete-member/delete-member';
import { AddCurso } from './components/add-curso/add-curso';
import { CursosMember } from './components/cursos-member/cursos-member';

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
  contrasena: string;
  selected: boolean;
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
    FormsModule, // ← añadir para ngModel
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private dialog = inject(MatDialog);
  private router = inject(Router);

  filtrosAbiertos = false;
  filtros = [
    { label: 'Activo', activo: false },
    { label: 'Inactivo', activo: false },
    { label: 'Profesor', activo: false },
    { label: 'A → Z', activo: false },
    { label: 'Z → A', activo: false },
    { label: '0 → 9', activo: false },
    { label: '9 → 0', activo: false },
  ];

  socios: Socio[] = [
    {
      id: '01',
      nombres: 'Felipe Carlos',
      apellidos: 'Guzmán Segundo',
      correo: 'FelipeCarlosGuzman@gmail.com',
      tel: '+34 652 25 35 97',
      dni: '52316377W',
      estado: 'Activo',
      fechaVenc: '05/01/2027',
      profesor: 'Si',
      contrasena: 'vW2O8a9z7',
      selected: false,
    },
  ];
  //Aqui para saber si estan todos marcados, SE GUARDA EN LA VARIABLE SOCIO
  get allSelected(): boolean {
    return this.socios.length > 0 && this.socios.every((s) => s.selected);
  }
  //Esto para saber si hay alguno que no esta seleccionado, SE GUARDA EN LA VARIABLE SOCIO
  get someSelected(): boolean {
    return this.socios.some((s) => s.selected) && !this.allSelected;
  }

  get selectedSocios(): Socio[] {
    return this.socios.filter((s) => s.selected);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.socios.forEach((s) => (s.selected = checked));
  }

  onCheckChange(): void {}

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }
  toggleChip(filtro: any) {
    filtro.activo = !filtro.activo;
  }
  //AQui el Padre recibe el socio y lo pasa al dialog
  openAddMember(socio?: Socio) {
    const dialogRef = this.dialog.open(AddMember, {
      width: '480px',
      data: socio ?? null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (socio) {
        const index = this.socios.indexOf(socio);
        this.socios[index] = { ...socio, ...result };
      } else {
        this.socios.push(result);
      }
    });
  }
  openMember(socio?: Socio) {
    const esNuevo = !socio;
    const dialogRef = this.dialog.open(Member, {
      width: '480px',
      data: socio ?? null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (esNuevo) {
        this.socios.push({
          id: String(this.socios.length + 1).padStart(2, '0'),
          nombres: result.nombres,
          apellidos: result.apellidos,
          correo: result.correo,
          tel: result.tel,
          dni: result.dni,
          estado: result.estado ?? 'Activo',
          fechaVenc: '',
          profesor: result.profesor ?? 'No',
          contrasena: '',
          selected: false,
        });
      } else {
        const index = this.socios.indexOf(socio!);
        this.socios[index] = { ...socio!, ...result };
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  onEliminar() {
    const dialogRef = this.dialog.open(DeleteMember, { width: '400px' });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      console.log('Miembro eliminado'); // aquí llamarás al servicio
    });
  }
  onModificar() {
    console.log('Modificar');
  }
  openAddCurso() {
    this.dialog.open(AddCurso, { width: '400px' });
  }

  // botón "Curso" en el menú de 3 puntos
  onCurso() {
    this.dialog.open(CursosMember, { width: '440px' });
  }
  onPagos() {
    console.log('Pagos');
  }
  onCorreo() {
    console.log('Correo', this.selectedSocios);
  }
}
