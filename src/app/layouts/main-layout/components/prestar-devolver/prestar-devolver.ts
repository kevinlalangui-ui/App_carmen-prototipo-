import { Component, inject, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { PrestamoService, Objeto } from '../../services/prestamo.service';

@Component({
  selector: 'app-prestar-devolver',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './prestar-devolver.html',
  styleUrl: './prestar-devolver.scss',
})
export class PrestarDevolverComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<PrestarDevolverComponent>);
  private prestamoService = inject(PrestamoService);
  private cdr = inject(ChangeDetectorRef);

  // Señales para los datos
  disponibles = signal<Objeto[]>([]);
  prestados = signal<Objeto[]>([]);

  // Señales para los términos de búsqueda (se actualizan con el input)
  busquedaPrestar = signal('');
  busquedaDevolver = signal('');

  // IDs seleccionados (propiedades normales)
  herramientaSeleccionadaId: string | undefined = undefined;
  herramientaDevueltaId: string | undefined = undefined;

  // Nombres seleccionados (propiedades normales, para mostrar en el campo)
  herramientaPrestarNombre = '';
  herramientaDevolverNombre = '';

  // Datos de formulario
  entidadAjena = '';
  anotacionesPrestamo = '';
  anotacionesDevolucion = '';

  // Errores
  errorEntidadAjena = '';
  errorAnotacionesPrestamo = '';
  errorAnotacionesDevolucion = '';

  // Computed que filtran las listas según la búsqueda
  disponiblesFiltrados = computed(() => {
    const term = this.busquedaPrestar().toLowerCase().trim();
    if (!term) return this.disponibles();
    return this.disponibles().filter(h => h.nombre.toLowerCase().includes(term));
  });

  prestadosFiltrados = computed(() => {
    const term = this.busquedaDevolver().toLowerCase().trim();
    if (!term) return this.prestados();
    return this.prestados().filter(h => h.nombre.toLowerCase().includes(term));
  });

  // Validaciones
  validarEntidadAjena(): void {
    if (!this.entidadAjena.trim()) {
      this.errorEntidadAjena = 'El nombre de la persona/entidad es obligatorio';
    } else {
      this.errorEntidadAjena = '';
    }
  }

  validarAnotacionesPrestamo(): void {
    const anot = this.anotacionesPrestamo.trim();
    if (!anot) {
      this.errorAnotacionesPrestamo = 'Las anotaciones son obligatorias';
    } else if (anot.length < 5) {
      this.errorAnotacionesPrestamo = 'Las anotaciones deben tener al menos 5 caracteres';
    } else {
      this.errorAnotacionesPrestamo = '';
    }
  }

  validarAnotacionesDevolucion(): void {
    const anot = this.anotacionesDevolucion.trim();
    if (!anot) {
      this.errorAnotacionesDevolucion = 'Las anotaciones de devolución son obligatorias';
    } else if (anot.length < 5) {
      this.errorAnotacionesDevolucion = 'Las anotaciones deben tener al menos 5 caracteres';
    } else {
      this.errorAnotacionesDevolucion = '';
    }
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.prestamoService.getDisponibles().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.disponibles.set(data);
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Error al cargando disponibles:', err),
    });

    this.prestamoService.getPrestados().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.prestados.set(data);
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Error al cargando prestados:', err),
    });
  }

  // Selección desde el autocomplete (Prestar)
  onSeleccionarHerramientaPrestar(event: any): void {
    const nombre = event.option.value;
    const herramienta = this.disponibles().find(h => h.nombre === nombre);
    if (herramienta) {
      this.herramientaSeleccionadaId = herramienta.id;
      this.herramientaPrestarNombre = herramienta.nombre;
      this.busquedaPrestar.set(herramienta.nombre);
    }
  }

  // Selección desde el autocomplete (Devolver)
  onSeleccionarHerramientaDevolver(event: any): void {
    const nombre = event.option.value;
    const herramienta = this.prestados().find(h => h.nombre === nombre);
    if (herramienta) {
      this.herramientaDevueltaId = herramienta.id;
      this.herramientaDevolverNombre = herramienta.nombre;
      this.busquedaDevolver.set(herramienta.nombre);
    }
  }

  // Limpiar selección (Prestar)
  limpiarSeleccionPrestar(): void {
    this.busquedaPrestar.set('');
    this.herramientaSeleccionadaId = undefined;
    this.herramientaPrestarNombre = '';
  }

  // Limpiar selección (Devolver)
  limpiarSeleccionDevolver(): void {
    this.busquedaDevolver.set('');
    this.herramientaDevueltaId = undefined;
    this.herramientaDevolverNombre = '';
  }

  // Prestar
  prestar(): void {
    this.validarEntidadAjena();
    this.validarAnotacionesPrestamo();

    if (this.errorEntidadAjena || this.errorAnotacionesPrestamo) return;
    if (!this.herramientaSeleccionadaId) {
      alert('Debes seleccionar una herramienta');
      return;
    }

    const herramienta = this.disponibles().find((h) => h.id === this.herramientaSeleccionadaId);
    if (!herramienta) {
      console.error('Herramienta seleccionada no encontrada');
      return;
    }

    const prestamoData = {
      esDeAva: true,
      entidadAjena: this.entidadAjena.trim(),
      anotaciones: this.anotacionesPrestamo.trim(),
    };

    this.prestamoService.prestarObjeto(herramienta.nombre, prestamoData).subscribe({
      next: () => {
        this.limpiarPrestamo();
        this.dialogRef.close(true);
      },
      error: (err) => console.error('Error al prestar:', err),
    });
  }

  // Devolver
  devolver(): void {
    this.validarAnotacionesDevolucion();
    if (!this.herramientaDevueltaId) {
      alert('Debes seleccionar una herramienta');
      return;
    }

    const herramienta = this.prestados().find((h) => h.id === this.herramientaDevueltaId);
    if (!herramienta) {
      console.error('Herramienta devuelta no encontrada');
      return;
    }

    this.prestamoService
      .devolverObjeto(herramienta.nombre, this.anotacionesDevolucion.trim())
      .subscribe({
        next: () => {
          this.limpiarDevolucion();
          this.dialogRef.close(true);
        },
        error: (err) => console.error('Error al devolver:', err),
      });
  }

  limpiarPrestamo(): void {
    this.herramientaSeleccionadaId = undefined;
    this.herramientaPrestarNombre = '';
    this.busquedaPrestar.set('');
    this.entidadAjena = '';
    this.anotacionesPrestamo = '';
  }

  limpiarDevolucion(): void {
    this.herramientaDevueltaId = undefined;
    this.herramientaDevolverNombre = '';
    this.busquedaDevolver.set('');
    this.anotacionesDevolucion = '';
  }

  close(): void {
    this.dialogRef.close();
  }
}