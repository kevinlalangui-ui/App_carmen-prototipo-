import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../services/curso';

@Component({
  selector: 'app-add-curso',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './add-curso.html',
  styleUrl: './add-curso.scss',
})
export class AddCurso {
  private dialogRef = inject(MatDialogRef<AddCurso>);
  private cursoService = inject(CursoService);

  nombreCurso = '';

  confirm() {
    if (!this.nombreCurso.trim()) return;
    this.cursoService.addCurso(this.nombreCurso.trim());
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
