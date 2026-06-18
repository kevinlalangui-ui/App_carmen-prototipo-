import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Objeto, Prestamo } from '../../services/prestamo.service';

interface PrestamoGlobal {
  herramienta: string;
  descripcion: string;
  prestamo: Prestamo;
}

interface DisplayItem {
  herramienta: string;
  descripcion: string;
  fechaInicio: Date;
  entidad: string;
  fechaFin: Date | null;
  anotacionInicio: string;
  anotacionFin: string;
}

@Component({
  selector: 'app-historial-prestamos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './historial-prestamos.html',
  styleUrls: ['./historial-prestamos.scss']
})
export class HistorialPrestamosComponent {
  filtroBusqueda = signal('');

  private datosCompletos: DisplayItem[] = [];
  titulo: string = '';

  get datosMostrar(): DisplayItem[] {
    const term = this.filtroBusqueda().toLowerCase().trim();
    if (!term) return this.datosCompletos;
    return this.datosCompletos.filter(item =>
      item.herramienta.toLowerCase().includes(term) ||
      item.descripcion.toLowerCase().includes(term)
    );
  }

  constructor(
    public dialogRef: MatDialogRef<HistorialPrestamosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Objeto | { prestamos: PrestamoGlobal[] }
  ) {
    const toDate = (dateStr: any): Date | null => {
      if (!dateStr) return null;
      if (dateStr instanceof Date) return dateStr;
      if (typeof dateStr === 'string') {
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    };

    let items: DisplayItem[] = [];

    if ('nombre' in data && data.prestamos) {
      this.titulo = `Historial de préstamos: ${data.nombre}`;
      items = (data.prestamos || []).map(p => ({
        herramienta: data.nombre,
        descripcion: data.descripcion || 'Sin descripción',
        fechaInicio: toDate(p.inicioPrestamo?.fecha) || new Date(0),
        entidad: p.entidadAjena || 'No registrada',
        fechaFin: toDate(p.finPrestamo?.fecha),
        anotacionInicio: p.inicioPrestamo?.anotaciones || '',
        anotacionFin: p.finPrestamo?.anotaciones || ''
      }));
    } else {
      const globalData = data as { prestamos: PrestamoGlobal[] };
      this.titulo = 'Historial global de préstamos';
      items = (globalData.prestamos || []).map(item => ({
        herramienta: item.herramienta,
        descripcion: item.descripcion || 'Sin descripción',
        fechaInicio: toDate(item.prestamo.inicioPrestamo?.fecha) || new Date(0),
        entidad: item.prestamo.entidadAjena || 'No registrada',
        fechaFin: toDate(item.prestamo.finPrestamo?.fecha),
        anotacionInicio: item.prestamo.inicioPrestamo?.anotaciones || '',
        anotacionFin: item.prestamo.finPrestamo?.anotaciones || ''
      }));
    }

    this.datosCompletos = items.sort((a, b) => {
      const aActivo = a.fechaFin === null;
      const bActivo = b.fechaFin === null;
      if (aActivo && !bActivo) return -1;
      if (!aActivo && bActivo) return 1;
      const timeA = a.fechaInicio?.getTime() || 0;
      const timeB = b.fechaInicio?.getTime() || 0;
      return timeB - timeA;
    });
  }

  limpiarFiltro(): void {
    this.filtroBusqueda.set('');
  }
}