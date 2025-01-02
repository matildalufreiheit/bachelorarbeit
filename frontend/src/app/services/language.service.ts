import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('de'); // Standardsprache ist Deutsch
  currentLang$ = this.currentLang.asObservable(); // Observable, um auf Sprachänderungen zu reagieren

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('de'); // Standardsprache setzen
  }

  // Sprache wechseln
  switchLanguage(): void {
    const newLang = this.currentLang.getValue() === 'de' ? 'en' : 'de';
    this.currentLang.next(newLang); // Sprache ändern
    this.translate.use(newLang); // ngx-translate Sprache wechseln
  }

  // Aktuelle Sprache abrufen
  getCurrentLanguage(): string {
    return this.currentLang.getValue();
  }
}
