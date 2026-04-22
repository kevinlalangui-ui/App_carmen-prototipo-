import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-member',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './delete-member.html',
  styleUrl: './delete-member.scss',
})
export class DeleteMember {
  private dialogRef = inject(MatDialogRef<DeleteMember>);

  confirmText = '';

  confirm() {
    if (this.confirmText !== 'eliminar') return;
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
