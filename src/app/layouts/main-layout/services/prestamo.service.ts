import { Injectable, signal } from '@angular/core';

export interface objeto {
  id: number;
  nombre: string;
  referencia: string;
  descripcion: string;
  sitioGuardado: string;
  prestadoActual: boolean;
}

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private nextId = 1;

  objetos = signal<objeto[]>([
    {
      id: this.nextId++,
      nombre: 'Martillo',
      referencia: '',
      descripcion: 'Martillo de carpintero',
      sitioGuardado: 'Cajón rojo',
      prestadoActual: false,
    },
    {
      id: this.nextId++,
      nombre: 'Taladro',
      referencia: '',
      descripcion: 'Taladro percutor',
      sitioGuardado: 'Estante azul',
      prestadoActual: true,
    },
    {
      id: this.nextId++,
      nombre: 'Destornillador',
      referencia: '',
      descripcion: 'Destornillador de estrella',
      sitioGuardado: 'Cajón pequeño',
      prestadoActual: false,
    },
  ]);

  getObjetos() {
    return this.objetos();
  }
  //metodo obtener solo disponibles
  getDisponibles() {
    return this.objetos().filter((o) => !o.prestadoActual);
  }
  //metodo obtener solo prestados
  getPrestados() {
    return this.objetos().filter((o) => o.prestadoActual);
  }

  addObjeto(nombre: string, descripcion: string, sitioGuardado: string) {
    this.objetos.update((lista) => [
      ...lista,
      {
        id: this.nextId++,
        nombre,
        referencia: '',
        descripcion,
        sitioGuardado,
        prestadoActual: false,
      },
    ]);
  }

  prestarObjeto(id: number) {
    this.objetos.update((lista) =>
      lista.map((objeto) => (objeto.id === id ? { ...objeto, prestadoActual: true } : objeto)),
    );
  }

  devolverObjeto(id: number) {
    this.objetos.update((lista) =>
      lista.map((objeto) => (objeto.id === id ? { ...objeto, prestadoActual: false } : objeto)),
    );
  }

  eliminarObjeto(id: number) {
    this.objetos.update((lista) => lista.filter((objeto) => objeto.id !== id));
  }
}
