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
  },
  {
    path:'not-found',
    loadComponent:()=>import("./features/not-found/not-found").then(c=>c.NotFound),
  },
  {
    path:'add-member',
    loadComponent:()=>import("./layouts/main-layout/components/add-member/add-member").then(c=>c.AddMember),
  },
  {path: '**', redirectTo: 'page-not-found', pathMatch: 'full'},

  {
    path: 'page-not-found',
    loadComponent: () => import("./features/not-found/not-found").then(c => c.NotFound),
  }
];

