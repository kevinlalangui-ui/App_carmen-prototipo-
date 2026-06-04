import { Component, inject, input, output } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
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
  ids = input<string[]>([]);

  fnToggleDeleteMember = output();
  fnEliminado          = output();

  confirmText = '';

  private sociosService = inject(SociosService);

  confirm(): void {
    if (this.confirmText.toLowerCase() !== 'eliminar') return;

    const lista = this.ids();
    let completados = 0;

    lista.forEach(id => {
      this.sociosService.deleteSocio(id).subscribe({
        next: () => {
          completados++;
          if (completados === lista.length) {
            this.fnEliminado.emit();
            this.fnToggleDeleteMember.emit();
          }
        },
        error: (err: any) => console.error(`Error DELETE socio ${id}:`, err),
      });
    });
  }
}
