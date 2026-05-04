import { Routes } from '@angular/router';
import { PrestamosListComponent } from './layouts/main-layout/components/prestamos-list/prestamos-list';
import { ListaGastosComponent } from './layouts/main-layout/components/lista-gastos/lista-gastos';
import { ListaIngresosComponent } from './layouts/main-layout/components/lista-ingresos/lista-ingresos';

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
    path: 'gastos',
    component: ListaGastosComponent,
  },
  {
    path: 'ingresos',
    component: ListaIngresosComponent,
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
