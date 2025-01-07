import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { SharedDataService } from '../services/shared-data.service';
import { Angebot } from '../shared/angebot';
import { LanguageService } from '../services/language.service';


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
  allOffers: Angebot[] = []; // Alle Angebote speichern

  arten: { ID: number; Art: string }[] = [];

  constructor(private dataService: DataService, private sharedDataService: SharedDataService, private changeDetection: ChangeDetectorRef, private languageService: LanguageService) {}

  ngOnInit(): void {
    this.getTags();
    this.getZielgruppen();
    this.getArten(); 
    this.getAngeboteZielgruppen(); 
    this.getAngebote();

    // Sprache beobachten und bei Änderung Angebote neu laden
    this.languageService.currentLang$.subscribe(() => {
      this.getAngebote();
    });
  
    this.sharedDataService.selectedTags$.subscribe(tags => {
      this.selectedTags = tags;
      //this.getAngebote();
    });
  
    this.sharedDataService.selectedZielgruppen$.subscribe(zielgruppen => {
      this.selectedZielgruppen = zielgruppen;
      //this.getAngebote();
    });

    this.sharedDataService.filteredResults$.subscribe(results => {
      this.filteredResults = results.length > 0 ? results : this.allOffers; // Fallback auf alle Angebote
      console.log('filteredResults in Tabelle:', this.filteredResults);
      this.changeDetection.detectChanges();
    });

    this.sharedDataService.visibleDetails$.subscribe(details => {
      this.visibleDetails = details;
    });
    
  }

  getAngebotsarten(): void {
    this.dataService.getArten().subscribe(response => {
      this.arten = response.data; // Arten speichern
      console.log('Geladene Angebotsarten:', this.arten); // Debug-Ausgabe
    });
  }

  getAngebote(): void {
    const lang = this.languageService.getCurrentLanguage();
    this.dataService.getAngebote().subscribe({
      next: (response) => {
        console.log(`Geladene Angebote in Tabelle (${lang}):`, response.data);
  
        this.allOffers = response.data; // Alle Angebote speichern
        console.log('Alle Angebote gespeichert:', this.allOffers);
  
        // FilteredResults nur initial setzen, falls keine Filter aktiv sind
        if (this.filteredResults.length === 0) {
          this.filteredResults = this.allOffers;
        }
  
        this.changeDetection.detectChanges();
      },
      error: (err) => {
        console.error('Fehler beim Laden der Angebote:', err);
      },
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
    //this.getAngebote();
  }

  toggleZielgruppe(id: number): void {
    if (this.selectedZielgruppen.has(id)) {
      this.selectedZielgruppen.delete(id);
    } else {
      this.selectedZielgruppen.add(id);
    }
    //this.getAngebote();
  }

  toggleShowAllTags(): void {
    this.showAllTags = !this.showAllTags;
  }

  toggleShowAllZielgruppen(): void {
    this.showAllZielgruppen = !this.showAllZielgruppen;
  }

  public trackItem (index: number, item: Angebot) {
    return item.ID;
  }
  
}
