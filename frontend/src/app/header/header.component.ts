import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  fontSizeMenuVisible = false;

  // Schriftgrößen-Dropdown anzeigen/verstecken
  toggleFontSizeMenu(): void {
    this.fontSizeMenuVisible = !this.fontSizeMenuVisible;
  }

  // Schriftgröße ändern
  changeFontSize(size: string): void {
    if (size === 'small') {
      document.body.style.fontSize = '14px';
    } else if (size === 'large') {
      document.body.style.fontSize = '18px';
    }
  }

  // Sprachwechsel-Logik
  setLanguage(lang: string): void {
    console.log('Sprache geändert zu:', lang);
    // Sprachwechsel-Logik muss implementiert werden TODO
  }
}
