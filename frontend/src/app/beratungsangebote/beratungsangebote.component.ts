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
  selectedTags: Set<number> = new Set();
  selectedZielgruppen: Set<string> = new Set();
  filteredTags: any[] = [];
  filteredZielgruppen: any[] = [];
  showAllTags = false;
  showAllZielgruppen = false;

  constructor(private dataService: DataService, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    try {
      const tagsResponse = await this.dataService.getTags().toPromise();
      const angeboteResponse = await this.dataService.getAngebote().toPromise();
      const angebotTagsResponse = await this.dataService.getAngebotTags().toPromise();
      const zielgruppenResponse = await this.dataService.getZielgruppen().toPromise();
  
      console.log('Tags:', tagsResponse.data);
      console.log('Angebote:', angeboteResponse.data);
      console.log('AngebotTags Response:', angebotTagsResponse);
      console.log('Zielgruppen:', zielgruppenResponse.data);
  
      // Sicherstellen, dass die Daten Arrays sind
      this.tags = Array.isArray(tagsResponse.data) ? tagsResponse.data : [];
      this.angebote = Array.isArray(angeboteResponse.data) ? angeboteResponse.data : [];
      this.angebotTags = Array.isArray(angebotTagsResponse.data) ? angebotTagsResponse.data : [];
      this.zielgruppen = Array.isArray(zielgruppenResponse.data) ? zielgruppenResponse.data : [];
  
      this.filteredTags = [...this.tags]; // Initial alle Tags anzeigen
      this.filteredZielgruppen = [...this.zielgruppen]; // Initial alle Zielgruppen anzeigen

    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
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
  
  toggleZielgruppe(zielgruppe: string): void {
    if (this.selectedZielgruppen.has(zielgruppe)) {
      this.selectedZielgruppen.delete(zielgruppe);
    } else {
      this.selectedZielgruppen.add(zielgruppe);
    }
    this.filterData();
    this.sharedDataService.setSelectedZielgruppen(new Set(this.selectedZielgruppen));
  }
  

  toggleShowAllTags(): void {
    this.showAllTags = !this.showAllTags;
  }

  toggleShowAllZielgruppen(): void {
    this.showAllZielgruppen = !this.showAllZielgruppen;
  }

  filterData(): void {
    console.log('Aktuelle ausgewählte Tags:', Array.from(this.selectedTags));
    console.log('Aktuelle ausgewählte Zielgruppen:', Array.from(this.selectedZielgruppen));
    console.log('AngebotTags:', this.angebotTags);
    console.log('Angebote:', this.angebote);
  
    if (this.selectedTags.size === 0 && this.selectedZielgruppen.size === 0) {
      // Wenn keine Tags und keine Zielgruppen ausgewählt sind, zeige alles an
      this.filteredTags = [...this.tags];
      this.filteredZielgruppen = [...this.zielgruppen];
      return;
    }
  
    const selectedTagIds = Array.from(this.selectedTags);
    const selectedZielgruppen = Array.from(this.selectedZielgruppen);
  
    // Finde gültige Angebote basierend auf den ausgewählten Tags und Zielgruppen
    const validOffers = this.angebote.filter((angebot) =>
      (selectedTagIds.length === 0 || selectedTagIds.every((tagId) =>
        this.angebotTags.some((at) => at.AngebotID === angebot.ID && at.TagID === tagId)
      )) &&
      (selectedZielgruppen.length === 0 || selectedZielgruppen.includes(angebot.Zielgruppe))
    );
  
    console.log('Gültige Angebote:', validOffers);
  
    // Finde gültige Tag-IDs basierend auf den gültigen Angeboten
    const validTagIds = new Set(
      this.angebotTags
        .filter((at) => validOffers.some((offer) => offer.ID === at.AngebotID))
        .map((at) => at.TagID)
    );
  
    // Finde gültige Zielgruppen basierend auf den gültigen Angeboten
    const validZielgruppen = new Set(validOffers.map((offer) => offer.Zielgruppe));
  
    // Filtere die Tags und Zielgruppen, die noch gültig sind
    this.filteredTags = this.tags.filter((tag) => validTagIds.has(tag.ID));
    this.filteredZielgruppen = this.zielgruppen.filter((ziel) => validZielgruppen.has(ziel));
  
    console.log('Gefilterte Tags:', this.filteredTags);
    console.log('Gefilterte Zielgruppen:', this.filteredZielgruppen);

    
  }
  
  
}
