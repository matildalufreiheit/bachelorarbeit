import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

interface Angebot {
  ID: number;
  InstitutionID: number;
  Art: string;
  Zielgruppe: string;
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
  selectedZielgruppen: Set<string> = new Set();
  showAllTags = false;
  showAllZielgruppen = false;
  filteredResults: Angebot[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getTags();
    this.getZielgruppen();
    this.getAngebote(); // Holen der Angebote beim Start
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
      this.filteredResults = response.data.filter((item: Angebot) => {
        const tagMatch = !this.selectedTags.size || item.TagIDs?.some((id: number) => this.selectedTags.has(id));
        const zielgruppeMatch = !this.selectedZielgruppen.size || this.selectedZielgruppen.has(item.Zielgruppe);
        return tagMatch && zielgruppeMatch;
      });
    });
  }

  toggleTag(id: number): void {
    if (this.selectedTags.has(id)) {
      this.selectedTags.delete(id);
    } else {
      this.selectedTags.add(id);
    }
    this.getAngebote();
  }

  toggleZielgruppe(zielgruppe: string): void {
    if (this.selectedZielgruppen.has(zielgruppe)) {
      this.selectedZielgruppen.delete(zielgruppe);
    } else {
      this.selectedZielgruppen.add(zielgruppe);
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
