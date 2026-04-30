import { Routes } from '@angular/router';
import { PrestamosListComponent } from './layouts/main-layout/components/prestamos-list/prestamos-list';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'prestamos',
    component: PrestamosListComponent,
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./layouts/auth-layout/components/register/register').then((c) => c.Register),
  },
  {
    path: 'main',
    loadComponent: () => import('./layouts/main-layout/main-layout').then((c) => c.MainLayout),
  },
];
