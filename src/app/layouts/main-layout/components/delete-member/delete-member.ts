import { Component, output } from '@angular/core';

@Component({
  selector: 'app-delete-member',
  imports: [],
  templateUrl: './delete-member.html',
  styleUrl: './delete-member.scss',
})
export class DeleteMember {
  fnCloseDeleteMember= output();

}
