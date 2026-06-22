import { Routes } from '@angular/router';
import { PrestamosListComponent } from './layouts/main-layout/components/prestamos-list/prestamos-list';
import { SociosComponent } from './layouts/main-layout/components/socios/socios';
import { ContabilidadComponent } from './layouts/main-layout/components/contabilidad/contabilidad';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./layouts/auth-layout/components/login/register').then(c => c.Register)
  },
  {
    path: 'main',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(c => c.MainLayout),
    children: [
      { path: 'socios', component: SociosComponent },
      { path: 'contabilidad', component: ContabilidadComponent }, // Unifica ingresos y gastos
      { path: 'prestamos', component: PrestamosListComponent },
      { path: 'cursos', loadComponent: () => import('./layouts/main-layout/components/cursos/cursos').then(c => c.CursosComponent) },
      { path: '', redirectTo: 'socios', pathMatch: 'full' }
    ]
  }
];