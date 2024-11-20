import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { SharedDataService } from '../services/shared-data.service';

interface Angebot {
  ID: number;
  InstitutionID: number;
  Art: string;
  Zielgruppe: string; // Falls Zielgruppen-String existiert
  ZielgruppenIDs?: number[]; // Falls Zielgruppen als Array vorliegt
  Name: string;
  Beschreibung: string;
  URL: string;
  TagIDs?: number[];
}

@Component({
  selector: 'app-ausgabe-tabelle',
  templateUrl: './ausgabe-tabelle.component.html',
  styleUrls: ['./ausgabe-tabelle.component.css']
})
export class AusgabeTabelleComponent implements OnInit {
  tags: any[] = [];
  zielgruppen: any[] = [];
  selectedTags: Set<number> = new Set();
  selectedZielgruppen: Set<number> = new Set();
  showAllTags = false;
  showAllZielgruppen = false;
  filteredResults: Angebot[] = [];
  visibleDetails: Set<number> = new Set(); // Set für sichtbare Details
  angeboteZielgruppen: { AngebotID: number; ZielgruppeID: number }[] = []; // Neu hinzugefügt

  constructor(private dataService: DataService, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.getTags();
    this.getZielgruppen();
    this.getAngeboteZielgruppen(); // Neu hinzugefügt
  
    this.sharedDataService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
      this.getAngebote();
    });
  
    this.sharedDataService.selectedZielgruppen$.subscribe(zielgruppen => {
      this.selectedZielgruppen = zielgruppen;
      this.getAngebote();
    });
  
    this.getAngebote(); // Initiales Laden der Daten
  }
  

  getTags(): void {
    this.dataService.getTags().subscribe(response => {
      this.tags = response.data;
    });
  }

  getZielgruppen(): void {
    this.dataService.getZielgruppen().subscribe(response => {
      this.zielgruppen = response.data;
    });
  }

  getAngebote(): void {
    this.dataService.getAngebote().subscribe(response => {
      console.log('Geladene Angebote:', response.data);
  
      // Berechnung der ZielgruppenIDs für jedes Angebot
      response.data.forEach((item: Angebot) => {
        item.ZielgruppenIDs = this.angeboteZielgruppen
          .filter((az: { AngebotID: number; ZielgruppeID: number }) => az.AngebotID === item.ID) // Verknüpfung finden
          .map((az: { AngebotID: number; ZielgruppeID: number }) => az.ZielgruppeID); // ZielgruppenIDs extrahieren
  
        console.log('Angebot:', item.ID, 'berechnete ZielgruppenIDs:', item.ZielgruppenIDs);
      });
  
      // Filterung basierend auf Tags und Zielgruppen
      this.filteredResults = response.data.filter((item: Angebot) => {
        console.log('Angebot:', item.ID, 'TagIDs:', item.TagIDs, 'ZielgruppenIDs:', item.ZielgruppenIDs);
  
        // Prüfe, ob die Tags passen
        const tagMatch = !this.selectedTags.size || 
          Array.from(this.selectedTags).some((tagId: number) => item.TagIDs?.includes(tagId));
  
        // Prüfe, ob die Zielgruppen passen
        const zielgruppeMatch = !this.selectedZielgruppen.size || 
          Array.from(this.selectedZielgruppen).some((zielgruppenId: number) => item.ZielgruppenIDs?.includes(zielgruppenId));
  
        console.log('Angebot:', item.ID, 'Tag Match:', tagMatch, 'Zielgruppe Match:', zielgruppeMatch);
  
        return tagMatch && zielgruppeMatch; // Nur Angebote behalten, die beide Bedingungen erfüllen
      });
  
      console.log('Gefilterte Ergebnisse:', this.filteredResults);
    });
  }
  
  
  getAngeboteZielgruppen(): void {
    this.dataService.getAngebotZielgruppe().subscribe(response => {
      this.angeboteZielgruppen = response.data;
      console.log('Angebote_Zielgruppen:', this.angeboteZielgruppen);
    });
  }
   
  
  toggleDetails(id: number): void {
    if (this.visibleDetails.has(id)) {
      this.visibleDetails.delete(id);
    } else {
      this.visibleDetails.add(id);
    }
  }

  isDetailsVisible(id: number): boolean {
    return this.visibleDetails.has(id);
  }

  toggleTag(id: number): void {
    if (this.selectedTags.has(id)) {
      this.selectedTags.delete(id);
    } else {
      this.selectedTags.add(id);
    }
    this.getAngebote();
  }

  toggleZielgruppe(id: number): void {
    if (this.selectedZielgruppen.has(id)) {
      this.selectedZielgruppen.delete(id);
    } else {
      this.selectedZielgruppen.add(id);
    }
    this.getAngebote();
  }

  toggleShowAllTags(): void {
    this.showAllTags = !this.showAllTags;
  }

  toggleShowAllZielgruppen(): void {
    this.showAllZielgruppen = !this.showAllZielgruppen;
  }
}
