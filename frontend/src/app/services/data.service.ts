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

deleteInstitutionByName(name: string): Observable<any> {
  const encodedName = encodeURIComponent(name); // Name für URL kodieren
  return this.http.delete(`${this.apiUrl}/institution/name/${encodedName}`);
}

getInstitutions(): Observable<any> {
  return this.http.get(`${this.apiUrl}/institutionen`);
}


updateAngebot(id: number, angebot: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/angebote/${id}`, angebot);
}

getAngebotsnamen(): Observable<any> {
  return this.http.get(`${this.apiUrl}/angebote/namen`);
}

  
}

