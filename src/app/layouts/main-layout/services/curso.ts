import { Injectable, signal } from '@angular/core';

export interface Curso {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class CursoService {
  private nextId = 1;

  cursos = signal<Curso[]>([
    { id: this.nextId++, nombre: 'Ingles' },
    { id: this.nextId++, nombre: 'Yoga' },
    { id: this.nextId++, nombre: 'Aleman' },
  ]);

  addCurso(nombre: string) {
    this.cursos.update((lista) => [...lista, { id: this.nextId++, nombre }]);
  }
}
