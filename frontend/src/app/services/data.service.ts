import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  return this.http.get(`${this.apiUrl}/angebote`);
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
  return this.http.get(`${this.apiUrl}/arten`);
}

login(username: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { benutzername: username, passwort: password });
}

register(username: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, { benutzername: username, passwort: password });
}

getUsers(): Observable<any> {
  return this.http.get(`${this.apiUrl}/benutzer`);
}

deleteUser(userId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/benutzer/${userId}`);
}

deleteInstitutionByName(name: string): Observable<any> {
  const encodedName = encodeURIComponent(name); // Name für URL kodieren
  return this.http.delete(`${this.apiUrl}/institution/name/${encodedName}`);
}

getInstitutions(): Observable<any> {
  return this.http.get(`${this.apiUrl}/institutionen`).pipe(
    tap(response => console.log('API Antwort:', response))
  );
}

getArten(): Observable<any> {
  return this.http.get(`${this.apiUrl}/arten`);
}


getInstitutionById(id: number){
  return this.http.get(`${this.apiUrl}/institution/${id}`);
}

updateInstitution(id: number, updatedInstitution: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/update-institution/${id}`, updatedInstitution);
}

updateAngebot(id: number, angebot: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/angebote/${id}`, angebot);
}

updateTag(tagId: number, tagName: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/tags/${tagId}`, { tag: tagName });
}

updateZielgruppe(zielgruppeId: number, zielgruppeName: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/zielgruppen/${zielgruppeId}`, { name: zielgruppeName });
}

getAngebotsnamen(): Observable<any> {
  return this.http.get(`${this.apiUrl}/angebote/namen`);
}

deleteTagById(tagId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/tags/${tagId}`);
}

deleteZielgruppeById(zielgruppeId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/zielgruppe/${zielgruppeId}`);
}

getAngebotById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/angebote/${id}`);
}

deleteInstitution(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/institution/${id}`);
}



}

