import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CursoService {
  private URL = environment.apiURL;

  constructor(private http: HttpClient) {
  }
  getActividades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/actividad/all`);
  }
  addActividad(datos: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/actividad/add`, datos);
  }

}
