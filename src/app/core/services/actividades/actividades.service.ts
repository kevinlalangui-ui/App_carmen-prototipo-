import { Injectable } from '@angular/core';
import{environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  private URL= environment.apiURL;
  constructor(private http:HttpClient) {
  }
  addTweet(datos:any):Observable<any>{
    return this.http.post<any>(`${this.URL}/actividad/add`, datos)
  }

}
