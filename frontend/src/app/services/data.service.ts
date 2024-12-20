import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
//import { Angebot } from '../shared/angebot';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  // ----------------------------------------------------------  Angebote
  getAngebote(): Observable<any> {
    return this.http.get(`${this.apiUrl}/angebote`);
  }

  createAngebot(angebot: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/angebote`, angebot);
  }

  updateAngebot(id: number, angebot: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/angebote/${id}`, angebot);
  }

  getAngebotsnamen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/angebote/namen`);
  }

  getAngebotById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/angebote/${id}`);
  }


  // -------------------------------------------------------------  Tags
  getTags(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tags`);
  }

  updateTag(tagId: number, tagName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/tags/${tagId}`, { tag: tagName });
  }

  deleteTagById(tagId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tags/${tagId}`);
  }

  addTag(tag: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tags`, { tag });
  }

  // ----------------------------------------------------------- Institutionen
  getInstitutions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/institutionen`).pipe(
      tap(response => console.log('API Antwort:', response))
    );
  }

  getInstitutionById(id: number){
    return this.http.get(`${this.apiUrl}/institutionen/${id}`);
  }

  deleteInstitutionByName(name: string): Observable<any> {
    const encodedName = encodeURIComponent(name); // Name für URL kodieren
    return this.http.delete(`${this.apiUrl}/institutionen/name/${encodedName}`);
  }

  updateInstitution(id: number, updatedInstitution: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/institutionen/${id}`, updatedInstitution);
  }

  deleteInstitution(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/institutionen/${id}`);
  }


  // -------------------------------------------------------------  Zielgruppen
  getZielgruppen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/zielgruppen`);
  }

  addZielgruppe(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/zielgruppen`, { name });
  }

  updateZielgruppe(zielgruppeId: number, zielgruppeName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/zielgruppen/${zielgruppeId}`, { name: zielgruppeName });
  }

  deleteZielgruppeById(zielgruppeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/zielgruppen/${zielgruppeId}`);
  }


  // -------------------------------------------------------------  Benutzer
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/benutzer/login`, { benutzername: username, passwort: password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/benutzer/register`, { benutzername: username, passwort: password });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/benutzer`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/benutzer/${userId}`);
  }


  // -------------------------------------------------------------  Arten  ----> 2x???
  getAngebotsarten(): Observable<any> {
    return this.http.get(`${this.apiUrl}/arten`);
  }

  getArten(): Observable<any> {
    return this.http.get(`${this.apiUrl}/arten`);
  }


  // -------------------------------------------------------------  n:m
  getAngebotTags(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nm/angebot_tags`);
  }

  getAngebotZielgruppe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nm/angebot_zielgruppe`);
  }

}
