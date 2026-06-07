import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SociosService } from '../../../../core/services/socios/socios.service';

@Component({
  selector: 'app-delete-member',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './delete-member.html',
  styleUrl: './delete-member.scss',
})
export class DeleteMember {
  confirmText = '';

  private dialogRef     = inject(MatDialogRef<DeleteMember>);
  private sociosService = inject(SociosService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { ids: string[] }) {}

  confirm(): void {
    if (this.confirmText.toLowerCase() !== 'eliminar') return;

    const lista = this.data.ids;
    let completados = 0;

    lista.forEach(id => {
      this.sociosService.deleteSocio(id).subscribe({
        next: () => {
          completados++;
          if (completados === lista.length) {
            this.dialogRef.close(true);
          }
        },
        error: (err: any) => console.error(`Error DELETE socio ${id}:`, err),
      });
    });
  }
}
