import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddMember } from './components/add-member/add-member';
import { AddCurso } from './components/add-curso/add-curso';
import { SociosService } from '../../core/services/socios/socios.service';
import { ActividadService } from '../../core/services/actividad/actividad.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayout {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private sociosService = inject(SociosService);
  private actividadService = inject(ActividadService);

  fabAbierto = false;

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  openMember(): void {
    const dialogRef = this.dialog.open(AddMember, {
      width: '480px',
      data: null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Socio creado, recargar lista si es necesario');
      }
    });
  }

  openAddCurso(): void {
    const dialogRef = this.dialog.open(AddCurso, {
      width: '480px',
      data: { cursosExistentes: [] }, 
    });
    dialogRef.afterClosed().subscribe((nuevoCurso) => {
      if (nuevoCurso) {
        console.log('Curso creado:', nuevoCurso);
      }
    });
  }
}