import { Component,signal } from '@angular/core';
import{AddMember} from './components/add-member/add-member';
import { DeleteMember } from './components/delete-member/delete-member';

@Component({
  selector: 'app-main-layout',
  imports: [AddMember, DeleteMember],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  openAddMember = signal<boolean>(false);
  showAddMember() {
    this.openAddMember.update((state) => !state);
  }

  openDeleteMember = signal<boolean>(false);
  showDeleteMember() {
    this.openDeleteMember.update((state) => !state);
  }
}
