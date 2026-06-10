import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class ActividadService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/actividad/all`);
  }

  add(actividad: any): Observable<any> {
    return this.http.post<any>(`${BASE}/actividad/add`, actividad);
  }

  update(id: string, actividad: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.patch<any>(`${BASE}/actividad/update`, actividad, { params });
  }

  deleteCurso(actividadId: string, cursoId: string): Observable<any> {
    const params = new HttpParams()
      .set('actividadId', actividadId)
      .set('cursoId', cursoId);
    return this.http.delete<any>(`${BASE}/actividad/curso/delete`, { params });
  }
}
