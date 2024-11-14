import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  // Tags abrufen
  getTags(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tags`);
  }

  // Einzigartige Zielgruppen abrufen
  //getZielgruppen(): Observable<any> {
  //  return this.http.get(`${this.apiUrl}/zielgruppen`);
  //}

  getZielgruppen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/zielgruppen`).pipe(
      map((response: any) => {
        // Zielgruppen aufteilen
        response.data = response.data.map((ziel: string) =>
          ziel.split(',').map((z) => z.trim())
        ).flat();
        return response;
      })
    );
  }

  getAngebote(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/angebote`);
  }

    // Neue Methode zum Abrufen der Angebot_Tags-Daten
    getAngebotTags(): Observable<any> {
      return this.http.get(`${this.apiUrl}/angebot_tags`);
  }
  
}

