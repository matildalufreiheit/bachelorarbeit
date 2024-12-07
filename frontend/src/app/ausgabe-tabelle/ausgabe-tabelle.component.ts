import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { SharedDataService } from '../services/shared-data.service';

interface Angebot {
  ID: number;
  InstitutionID: number;
  Zielgruppe: string; // Falls Zielgruppen-String existiert
  ZielgruppenIDs?: number[]; // Falls Zielgruppen als Array vorliegt
  Name: string;
  Beschreibung: string;
  URL: string;
  TagIDs?: number[];
  Arten?: string[];
  ArtIDs?: number[];
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
  

  arten: { ID: number; Art: string }[] = [];

  constructor(private dataService: DataService, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.getTags();
    this.getZielgruppen();
    this.getArten(); 
    this.getAngeboteZielgruppen(); 
    this.getAngebote();
  
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

  getAngebotsarten(): void {
    this.dataService.getAngebotsarten().subscribe(response => {
      this.arten = response.data; // Arten speichern
      console.log('Geladene Angebotsarten:', this.arten); // Debug-Ausgabe
    });
  }

  getAngebote(): void {
    this.dataService.getAngebote().subscribe({
      next: (response) => {
        console.log('Geladene Angebote:', response.data);
  
        this.filteredResults = response.data;       
              
        console.log('Gefilterte Ergebnisse:', this.filteredResults);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Angebote:', err);
      }
    });
  }
  
  
  // Neue Methode, um Arten aus der API zu laden
  getArten(): void {
    this.dataService.getArten().subscribe(response => {
        this.arten = response.data;
        console.log('Geladene Arten:', this.arten);
    });
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
