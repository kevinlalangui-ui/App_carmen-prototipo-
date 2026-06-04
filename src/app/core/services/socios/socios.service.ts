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
//listo
  getSocios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/socio/all`);
  }
//listo--
  guardarSocio(datos: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/socio/add`, datos);
  }
//listo--
  deleteSocio(id: string): Observable<any> {
    return this.http.delete<any>(`${this.URL}/socio/delete/${id}`);
  }
//listo
  update(id: string, datos:string): Observable<any> {
    return this.http.patch<any>(`${this.URL}/socio/update/${id}`,datos);
  }
}
