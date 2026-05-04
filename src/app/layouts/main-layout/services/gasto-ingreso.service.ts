import { Injectable, signal } from '@angular/core';

export interface Gasto {
  id: number;
  monto: number;
  descripcion: string;
  fechaGasto: string;
}

export interface Ingreso {
  id: number;
  monto: number;
  descripcion: string;
  fechaIngreso: string;
}

@Injectable({ providedIn: 'root' })
export class GastoIngresoService {
  private nextIdGasto = 1;
  private nextIdIngreso = 1;

  // Datos mock de gastos
  private gastosSignal = signal<Gasto[]>([
    {
      id: this.nextIdGasto++,
      monto: 50.0,
      descripcion: 'construccion de escalera comunidad',
      fechaGasto: '17-04-2026',
    },
    {
      id: this.nextIdGasto++,
      monto: 105.0,
      descripcion: 'Compra de herramientas',
      fechaGasto: '10-04-2026',
    },
  ]);

  // Datos mock de ingresos
  private ingresosSignal = signal<Ingreso[]>([
    {
      id: this.nextIdIngreso++,
      monto: 500.0,
      descripcion: 'Suscripción trimestral',
      fechaIngreso: '01-04-2026',
    },
    { id: this.nextIdIngreso++, monto: 200.0, descripcion: 'Donación', fechaIngreso: '15-04-2026' },
  ]);

  // Getters
  getGastos(): Gasto[] {
    return this.gastosSignal();
  }

  getIngresos(): Ingreso[] {
    return this.ingresosSignal();
  }

  getTotalGastos(): number {
    return this.gastosSignal().reduce((total, g) => total + g.monto, 0);
  }

  getTotalIngresos(): number {
    return this.ingresosSignal().reduce((total, i) => total + i.monto, 0);
  }

  getBalance(): number {
    return this.getTotalIngresos() - this.getTotalGastos();
  }

  // Añadir gasto
  addGasto(gasto: Omit<Gasto, 'id'>): void {
    this.gastosSignal.update((lista) => [...lista, { id: this.nextIdGasto++, ...gasto }]);
  }

  // Añadir ingreso
  addIngreso(ingreso: Omit<Ingreso, 'id'>): void {
    this.ingresosSignal.update((lista) => [...lista, { id: this.nextIdIngreso++, ...ingreso }]);
  }

  // Eliminar gasto
  deleteGasto(id: number): void {
    this.gastosSignal.update((lista) => lista.filter((g) => g.id !== id));
  }

  // Eliminar ingreso
  deleteIngreso(id: number): void {
    this.ingresosSignal.update((lista) => lista.filter((i) => i.id !== id));
  }
}
