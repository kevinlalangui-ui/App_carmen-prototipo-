import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Objeto, Prestamo } from '../../services/prestamo.service';

interface PrestamoGlobal {
  herramienta: string;
  prestamo: Prestamo;
}

interface DisplayItem {
  herramienta: string;
  fechaInicio: Date;
  entidad: string;
  fechaFin: Date | null;
  anotaciones: string;
}

@Component({
  selector: 'app-historial-prestamos',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './historial-prestamos.html',
  styleUrls: ['./historial-prestamos.scss']
})
export class HistorialPrestamosComponent {
  datosMostrar: DisplayItem[] = [];
  titulo: string = '';

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

    if ('nombre' in data && data.prestamos) {
      this.titulo = `Historial de préstamos: ${data.nombre}`;
      this.datosMostrar = (data.prestamos || []).map(p => ({
        herramienta: data.nombre,
        fechaInicio: toDate(p.inicioPrestamo?.fecha) || new Date(0),
        entidad: p.entidadAjena || 'No registrada',
        fechaFin: toDate(p.finPrestamo?.fecha),
        anotaciones: `${p.inicioPrestamo?.anotaciones || ''}${p.finPrestamo ? ' | Dev: ' + p.finPrestamo.anotaciones : ''}`
      }));
    } else {
      const globalData = data as { prestamos: PrestamoGlobal[] };
      this.titulo = 'Historial global de préstamos';
      this.datosMostrar = (globalData.prestamos || []).map(item => ({
        herramienta: item.herramienta,
        fechaInicio: toDate(item.prestamo.inicioPrestamo?.fecha) || new Date(0),
        entidad: item.prestamo.entidadAjena || 'No registrada',
        fechaFin: toDate(item.prestamo.finPrestamo?.fecha),
        anotaciones: `${item.prestamo.inicioPrestamo?.anotaciones || ''}${item.prestamo.finPrestamo ? ' | Dev: ' + item.prestamo.finPrestamo.anotaciones : ''}`
      }));
    }

    this.datosMostrar.sort((a, b) => {
      const timeA = a.fechaInicio?.getTime() || 0;
      const timeB = b.fechaInicio?.getTime() || 0;
      return timeB - timeA;
    });
  }
}