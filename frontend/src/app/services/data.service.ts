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

  getZielgruppen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/zielgruppe`);
  }

  getAngebote(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/angebote`);
  }

  getAngebotTags(): Observable<any> {
    return this.http.get(`${this.apiUrl}/angebot_tags`);
  }

  getAngebotZielgruppe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/angebote_zielgruppe`);
  }

  addTag(tag: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tags`, { tag });
  }
  
  addZielgruppe(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/zielgruppe`, { name });
  }
  
  // createInstitution(institution: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/institution`, institution);
  // }

  createAngebot(angebot: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/angebote`, angebot);
  }
  
  // Bestehende Angebotsarten abrufen
getAngebotsarten(): Observable<any> {
  return this.http.get(`${this.apiUrl}/angebotsarten`);
}

login(username: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { benutzername: username, passwort: password });
}

register(username: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, { benutzername: username, passwort: password });
}
  
}

