import { Routes } from '@angular/router';
import { AddMember } from './layouts/main-layout/components/add-member/add-member';

export const routes: Routes = [
  {
    path: '',
    loadComponent:()=>import("./layouts/main-layout/main-layout").then(c =>c.MainLayout),
  },
  {
    path:'info',
    loadComponent:()=>import("./layouts/main-layout/components/info-member/info-member").then(c=>c.InfoMember),
  }
];

