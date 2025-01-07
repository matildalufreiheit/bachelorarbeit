import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { SharedDataService } from '../services/shared-data.service';
import { LanguageService } from '../services/language.service';

interface Tag {
  ID: number;
  Tag: string; // Deutscher Name
  Tag_EN: string; // Englischer Name
  PreferredTag: string; // Bevorzugter Name basierend auf Sprache
}

interface Zielgruppe {
  ID: number;
  Name: string; // Deutscher Name
  Zielgruppe_EN: string; // Englischer Name
  PreferredTag: string; // Bevorzugter Name basierend auf Sprache
}

@Component({
  selector: 'app-beratungsangebote',
  templateUrl: './beratungsangebote.component.html',
  styleUrls: ['./beratungsangebote.component.css']
})
export class BeratungsangeboteComponent implements OnInit {
  tags: Tag[] = [];
  zielgruppen: Zielgruppe[] = [];  
  angebote: any[] = [];
  angebotTags: any[] = [];
  angeboteZielgruppen: { AngebotID: number; ZielgruppeID: number }[] = [];
  selectedTags: Set<number> = new Set();
  selectedZielgruppen: Set<number> = new Set();
  filteredTags: any[] = [];
  filteredZielgruppen: any[] = [];
  showAllTags = false;
  showAllZielgruppen = false;
  visibleTags: any[] = []; // Sichtbare Tags
  visibleZielgruppen: any[] = []; // Sichtbare Zielgruppen
  maxVisibleItems: number = 5; // Anzahl der standardmäßig sichtbaren Items
  visibleDetails: Set<number> = new Set();
  previouslyVisibleDetails: Set<number> = new Set();
  isDataLoaded: boolean = false;

  constructor(private dataService: DataService, private sharedDataService: SharedDataService, private languageService: LanguageService) {}

  ngOnInit(): void {
    console.log('Komponente wird initialisiert');
    this.loadData();
    this.updateVisibleItems();
  
    // Aktualisiere Daten bei Sprachwechsel
    this.languageService.currentLang$.subscribe(() => {
    console.log('Sprache geändert, Daten werden neu geladen');
    this.loadData(); // API-Daten für die neue Sprache laden
    this.filterData(); // Gefilterte Ergebnisse für die neue Sprache aktualisieren
  });
  
    // Überprüfe initiale Zustände
    console.log('Initiale States:');
    console.log('Selected Tags:', Array.from(this.selectedTags));
    console.log('Selected Zielgruppen:', Array.from(this.selectedZielgruppen));
  }
  

  loadData() {
    const lang = this.languageService.getCurrentLanguage();
    console.log('Aktuelle Sprache:', lang);
  
    let tagsLoaded = false;
    let zielgruppenLoaded = false;
    let angeboteLoaded = false;
    let angebotTagsLoaded = false;
    let angeboteZielgruppenLoaded = false;
  
    this.dataService.getTags(lang).subscribe({
      next: (response: { data: Tag[] }) => {
        this.tags = response.data;
        console.log('Geladene Tags:', this.tags);
        this.updateVisibleItems(); // Direkt aktualisieren
      },
      error: (err) => console.error('Fehler beim Laden der Tags:', err),
    });
    
    this.dataService.getZielgruppen(lang).subscribe({
      next: (response: { data: Zielgruppe[] }) => {
        this.zielgruppen = response.data;
        console.log('Geladene Zielgruppen:', this.zielgruppen);
        this.updateVisibleItems(); // Direkt aktualisieren
      },
      error: (err) => console.error('Fehler beim Laden der Zielgruppen:', err),
    });
    
  
    this.dataService.getAngebote().subscribe({
      next: (response: { data: any[] }) => {
        this.angebote = response.data;
        console.log('Geladene Angebote:', this.angebote);
        angeboteLoaded = true;
        this.checkDataLoaded(tagsLoaded, zielgruppenLoaded, angeboteLoaded, angebotTagsLoaded, angeboteZielgruppenLoaded);
      },
      error: (err) => console.error('Fehler beim Laden der Angebote:', err),
    });
  
    this.dataService.getAngebotTags().subscribe({
      next: (tagsResponse: any) => {
        console.log('API-Antwort von AngebotTags:', tagsResponse);
        this.angebotTags = Array.isArray(tagsResponse.data) ? tagsResponse.data : [];
        console.log('Geladene AngebotTags:', this.angebotTags);
      
        // Daten sind jetzt vollständig geladen
        this.isDataLoaded = true;
        this.filterData(); // Filterung starten
      },
      error: (err) => console.error('Fehler beim Laden von AngebotTags:', err),
    });
    
    this.dataService.getAngebotZielgruppe().subscribe({
      next: (zielgruppenResponse: any) => {
        this.angeboteZielgruppen = Array.isArray(zielgruppenResponse.data) ? zielgruppenResponse.data : [];
        console.log('Geladene AngebotZielgruppen:', this.angeboteZielgruppen);
    
        // Daten sind jetzt vollständig geladen
        this.isDataLoaded = true;
        this.filterData(); // Filterung starten
      },
      error: (err) => console.error('Fehler beim Laden von AngebotZielgruppen:', err),
    });
    
    
        
  }
  
  checkDataLoaded(
    tagsLoaded: boolean,
    zielgruppenLoaded: boolean,
    angeboteLoaded: boolean,
    angebotTagsLoaded: boolean,
    angebotZielgruppenLoaded: boolean
  ): void {
    console.log('Datenlade-Status überprüfen:');
    console.log('Tags geladen:', tagsLoaded);
    console.log('Zielgruppen geladen:', zielgruppenLoaded);
    console.log('Angebote geladen:', angeboteLoaded);
    console.log('AngebotTags geladen:', angebotTagsLoaded);
    console.log('AngeboteZielgruppen geladen:', angebotZielgruppenLoaded);
  
    if (
      tagsLoaded &&
      zielgruppenLoaded &&
      angeboteLoaded &&
      angebotTagsLoaded &&
      angebotZielgruppenLoaded
    ) {
      this.isDataLoaded = true;
      console.log('Alle Daten erfolgreich geladen.');
      this.filterData(); // Filterlogik ausführen
    } else {
      console.warn('Nicht alle Daten wurden geladen.');
    }
  }
  
   

  toggleTag(tagId: number): void {
    if (this.selectedTags.has(tagId)) {
      this.selectedTags.delete(tagId);
    } else {
      this.selectedTags.add(tagId);
    }
    console.log('Aktuelle ausgewählte Tags:', Array.from(this.selectedTags));
    this.filterData();
  }  
  
  
  toggleZielgruppe(zielgruppenId: number): void {
    if (this.selectedZielgruppen.has(zielgruppenId)) {
      this.selectedZielgruppen.delete(zielgruppenId);
    } else {
      this.selectedZielgruppen.add(zielgruppenId);
    }
    console.log('Aktuelle ausgewählte Zielgruppen:', Array.from(this.selectedZielgruppen));
    this.filterData();
  }
  

  toggleShowAllTags(): void {
    this.showAllTags = !this.showAllTags;
    console.log('Show all tags toggled:', this.showAllTags);
    this.updateVisibleItems();
  }

  toggleShowAllZielgruppen(): void {
    this.showAllZielgruppen = !this.showAllZielgruppen;
    console.log('Show all zielgruppen toggled:', this.showAllZielgruppen);
    this.updateVisibleItems();
  }

  updateVisibleItems(): void {
    // Verwende gefilterte Tags für Sichtbarkeit
    this.visibleTags = this.showAllTags
      ? this.filteredTags
      : this.filteredTags.slice(0, this.maxVisibleItems);
  
    // Verwende gefilterte Zielgruppen für Sichtbarkeit
    this.visibleZielgruppen = this.showAllZielgruppen
      ? this.filteredZielgruppen
      : this.filteredZielgruppen.slice(0, this.maxVisibleItems);
  
    console.log('Visible tags:', this.visibleTags);
    console.log('Visible zielgruppen:', this.visibleZielgruppen);
  }
  
  

  // filterData(): void {
  //   const selectedTagIds = Array.from(this.selectedTags);
  //   const selectedZielgruppenIds = Array.from(this.selectedZielgruppen);
  
  //   const validOffers = this.angebote.filter((angebot) =>
  //     (selectedTagIds.length === 0 || selectedTagIds.every((tagId) =>
  //       this.angebotTags.some((at) => at.AngebotID === angebot.ID && at.TagID === tagId)
  //     )) &&
  //     (selectedZielgruppenIds.length === 0 || selectedZielgruppenIds.every((zielgruppenId) =>
  //       this.angeboteZielgruppen.some((az) => az.AngebotID === angebot.ID && az.ZielgruppeID === zielgruppenId)
  //     ))
  //   );
  //   console.log('Selected Tags:', selectedTagIds);
  //   console.log('Selected Zielgruppen:', selectedZielgruppenIds);    
  //   console.log('Gefilterte gültige Angebote:', validOffers);
  // }

  filterData(): void {
    if (!this.isDataLoaded) {
      console.warn('Daten noch nicht vollständig geladen. Filter wird übersprungen.');
      return;
    }
  
    const selectedTagIds = Array.from(this.selectedTags);
    const selectedZielgruppenIds = Array.from(this.selectedZielgruppen);
  
    const validOffers = this.angebote.filter((angebot) => {
      const hasValidTag =
        selectedTagIds.length === 0 ||
        this.angebotTags.some(
          (at) => at.AngebotID === angebot.ID && selectedTagIds.includes(at.TagID)
        );
  
      const hasValidZielgruppe =
        selectedZielgruppenIds.length === 0 ||
        this.angeboteZielgruppen.some(
          (az) => az.AngebotID === angebot.ID && selectedZielgruppenIds.includes(az.ZielgruppeID)
        );
  
      return hasValidTag && hasValidZielgruppe;
    });
  
    console.log('Gefilterte gültige Angebote:', validOffers);
  
    // Berechne gültige Tag- und Zielgruppen-IDs
    const validTagIds = new Set(
      this.angebotTags
        .filter((at) => validOffers.some((offer) => offer.ID === at.AngebotID))
        .map((at) => at.TagID)
    );
  
    const validZielgruppenIds = new Set(
      this.angeboteZielgruppen
        .filter((az) => validOffers.some((offer) => offer.ID === az.AngebotID))
        .map((az) => az.ZielgruppeID)
    );
  
    // Aktualisiere gefilterte Tags und Zielgruppen
    this.filteredTags = this.tags.map((tag) => ({
      ...tag,
      disabled: !validTagIds.has(tag.ID),
    }));
  
    this.filteredZielgruppen = this.zielgruppen.map((ziel) => ({
      ...ziel,
      disabled: !validZielgruppenIds.has(ziel.ID),
    }));
  
    // Sichtbare Items aktualisieren
    this.updateVisibleItems();
  
    // Gefilterte Ergebnisse speichern
    this.sharedDataService.setFilteredResults(validOffers);
  }
  
  
  
  
}

