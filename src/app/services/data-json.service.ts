import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import JSZip from 'jszip';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataJsonService {
  
  constructor(private http: HttpClient) {}

  getDataFromJSON(jsonUrl: string): Observable<any> {
    return this.http.get<any>(jsonUrl);
  }

  getDataFromZip(filePath: string): Observable<JSZip> {
    return this.http.get(filePath, { responseType: 'arraybuffer' }).pipe(
      switchMap((data: ArrayBuffer) => {
        const zip = new JSZip();
        return from(zip.loadAsync(data));
      })
    );
  }

}
