import { Routes } from '@angular/router';
import { PrestamosListComponent } from './layouts/main-layout/components/prestamos-list/prestamos-list';
import { ListaGastosComponent } from './layouts/main-layout/components/lista-gastos/lista-gastos';
import { ListaIngresosComponent } from './layouts/main-layout/components/lista-ingresos/lista-ingresos';
import { SociosComponent } from './layouts/main-layout/components/socios/socios';

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
      { path: 'prestamos', component: PrestamosListComponent },
      { path: 'gastos', component: ListaGastosComponent },
      { path: 'ingresos', component: ListaIngresosComponent },
      { path: 'cursos', loadComponent: () => import('./layouts/main-layout/components/cursos/cursos').then(c => c.CursosComponent) },
      { path: '', redirectTo: 'socios', pathMatch: 'full' }
    ]
  }
];