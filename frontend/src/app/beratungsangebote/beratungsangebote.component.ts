import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-beratungsangebote',
  templateUrl: './beratungsangebote.component.html',
  styleUrls: ['./beratungsangebote.component.css']
})
export class BeratungsangeboteComponent implements OnInit {
  tags: any[] = [];
  zielgruppen: any[] = [];
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



  constructor(private dataService: DataService, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.loadData();
  }
  

  loadData() {
    this.dataService.getTags().subscribe( 
      response => {
        this.tags = response.data;
        this.filteredTags = [...this.tags];
        // console.log('Tags:', this.tags);
        // console.log('Filtered Tags:', this.tags);
        this.visibleTags = this.showAllTags ? this.filteredTags : this.filteredTags.slice(0, this.maxVisibleItems);
      }
    )
    this.dataService.getAngebote().subscribe(
      response => {
        this.angebote = response.data
        // console.log('Angebote:', this.angebote);
      }
    )
    this.dataService.getAngebotTags().subscribe(
      response => {
        this.angebotTags = response.data
        // console.log('AngebotTags Response:', this.angebotTags);
      }
    )
    this.dataService.getZielgruppen().subscribe(
      response => {
        this.zielgruppen = response.data;
        this.filteredZielgruppen = [...this.zielgruppen];
        // console.log('Zielgruppen:', this.zielgruppen);
        // console.log('Filtered Zielgruppen:', this.filteredZielgruppen);
        this.visibleZielgruppen = this.showAllZielgruppen ? this.filteredZielgruppen : this.filteredZielgruppen.slice(0, this.maxVisibleItems);
      }
    )
    this.dataService.getAngebotZielgruppe().subscribe(
      response => {
        this.angeboteZielgruppen = response.data
        // console.log('Angebote_Zielgruppen:', this.angeboteZielgruppen); // Neu
      }
    )
}

  toggleTag(tagId: number): void {
    if (this.selectedTags.has(tagId)) {
      this.selectedTags.delete(tagId);
    } else {
      this.selectedTags.add(tagId);
    }
    this.filterData();
    this.sharedDataService.setSelectedTags(new Set(this.selectedTags));
  }
  
  toggleZielgruppe(zielgruppenId: number): void {
    if (this.selectedZielgruppen.has(zielgruppenId)) {
      this.selectedZielgruppen.delete(zielgruppenId);
    } else {
      this.selectedZielgruppen.add(zielgruppenId);
    }
    this.filterData();
    this.sharedDataService.setSelectedZielgruppen(new Set(this.selectedZielgruppen));
  }

  toggleShowAllTags(): void {
    this.showAllTags = !this.showAllTags;
    this.updateVisibleItems(); // Sichtbare Tags aktualisieren
  }
  
  toggleShowAllZielgruppen(): void {
    this.showAllZielgruppen = !this.showAllZielgruppen;
    this.updateVisibleItems(); // Sichtbare Zielgruppen aktualisieren
  }
  
  updateVisibleItems(): void {
    this.visibleTags = this.showAllTags ? this.filteredTags : this.filteredTags.slice(0, this.maxVisibleItems);
    this.visibleZielgruppen = this.showAllZielgruppen ? this.filteredZielgruppen : this.filteredZielgruppen.slice(0, this.maxVisibleItems);
  }  

  private previouslyVisibleDetails: Set<number> = new Set();
  
  filterData(): void {
    console.log('Aktuelle ausgewählte Tags:', Array.from(this.selectedTags));
    console.log('Aktuelle ausgewählte Zielgruppen:', Array.from(this.selectedZielgruppen));
  
    const selectedTagIds = Array.from(this.selectedTags);
    const selectedZielgruppenIds = Array.from(this.selectedZielgruppen);

    
    const validOffers = this.angebote.filter( (angebot) =>
      (selectedTagIds.length === 0 || selectedTagIds.every( (tagId) =>
        this.angebotTags.some((at: { AngebotID: number; TagID: number }) => at.AngebotID === angebot.ID && at.TagID === tagId)
      )) &&
      (selectedZielgruppenIds.length === 0 || selectedZielgruppenIds.every((zielgruppenId) =>
        this.angeboteZielgruppen.some((az: { AngebotID: number; ZielgruppeID: number }) => az.AngebotID === angebot.ID && az.ZielgruppeID === zielgruppenId)
      ))
    );

    // Sichtbare Details vor dem Aktualisieren der Filter speichern
    this.previouslyVisibleDetails = new Set(this.visibleDetails);

    // Nach dem Filtern nur die Details wiederherstellen, die noch gültig sind
    this.visibleDetails = new Set([...this.previouslyVisibleDetails].filter(id =>
      validOffers.some(angebot => angebot.ID === id)
    ));

  
    const validTagIds = new Set(
      this.angebotTags
        .filter((at: { AngebotID: number; TagID: number }) => validOffers.some((offer) => offer.ID === at.AngebotID))
        .map((at) => at.TagID)
    );
  
    const validZielgruppenIds = new Set(
      this.angeboteZielgruppen
        .filter((az: { AngebotID: number; ZielgruppeID: number }) => validOffers.some((offer) => offer.ID === az.AngebotID))
        .map((az) => az.ZielgruppeID)
    );
  
    this.filteredTags = this.tags.map(tag => ({
      ...tag,
      disabled: !validTagIds.has(tag.ID),
    }));
  
    this.filteredZielgruppen = this.zielgruppen.map(ziel => ({
      ...ziel,
      disabled: !validZielgruppenIds.has(ziel.ID),
    }));
  
    // Sichtbare Items aktualisieren
    this.updateVisibleItems();

    // Nur neue Ergebnisse senden, ohne UI-Zustände zu beeinflussen
    this.sharedDataService.setFilteredResults(validOffers);
    this.sharedDataService.setVisibleDetails(new Set(this.visibleDetails));


  }
  
  
}
