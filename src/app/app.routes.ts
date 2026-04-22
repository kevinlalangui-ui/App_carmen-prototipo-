import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadComponent: () => import('./layouts/auth-layout/components/register/register').then(c => c.Register)
  },
  {
    path: 'main',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(c => c.MainLayout)
  }
];
