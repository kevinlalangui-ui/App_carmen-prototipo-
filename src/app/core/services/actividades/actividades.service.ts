import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {

  private URL = environment.apiURL;

  constructor(private http: HttpClient) {}

  // GET /actividad/all
  getActividades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/actividad/all`);
  }

  // POST /actividad/add
  addActividad(datos: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/actividad/add`, datos);
  }

  // PATCH /actividad/update?id=
  updateActividad(id: string, datos: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.patch<any>(`${this.URL}/actividad/update`, datos, { params });
  }

  // DELETE /actividad/delete?id=
  deleteActividad(id: string): Observable<void> {
    const params = new HttpParams().set('id', id);
    return this.http.delete<void>(`${this.URL}/actividad/delete`, { params });
  }
}
