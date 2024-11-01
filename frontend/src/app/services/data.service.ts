import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  getZielgruppen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/zielgruppen`);
  }

  getAngebote(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/angebote`);
  }
  
}

