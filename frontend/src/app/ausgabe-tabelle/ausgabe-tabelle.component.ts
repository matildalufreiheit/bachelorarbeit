import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ausgabe-tabelle',
  templateUrl: './ausgabe-tabelle.component.html',
  styleUrls: ['./ausgabe-tabelle.component.css']
})
export class AusgabeTabelleComponent {
  @Input() selectedTags: Set<number> = new Set();
  @Input() selectedZielgruppen: Set<number> = new Set();

  // Logik für die Ausgabe-Tabelle mit gefilterten Ergebnissen
  // kann hier später ergänzt werden
}

