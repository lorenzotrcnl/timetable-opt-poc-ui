import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataJsonService {
  
  constructor(private http: HttpClient) {}

  getDataFromJSON(jsonUrl: string): Observable<any> {
    return this.http.get<any>(jsonUrl);
  }

}
