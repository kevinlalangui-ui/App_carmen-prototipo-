import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SociosService {

  private URL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getSocios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/socio/all`);
  }

  guardar(payload: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/socio/add`, payload);
  }

  deleteSocio(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.delete<any>(`${this.URL}/socio/delete`, { params });
  }

  update(socio: any): Observable<any> {
    const { id, ...body } = socio;
  return this.http.patch<any>(`${this.URL}/socio/update?id=${id}`, body);
  }
  inscribir(socioId: string, actividadId: string, cursoId: string): Observable<any> {
    return this.http.post<any>(
      `${this.URL}/socio/inscribir/${socioId}/${actividadId}/${cursoId}`,
      {}
    );
  }
}
