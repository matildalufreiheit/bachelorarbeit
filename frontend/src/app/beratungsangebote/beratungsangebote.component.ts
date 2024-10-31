import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-beratungsangebote',
  templateUrl: './beratungsangebote.component.html',
  styleUrls: ['./beratungsangebote.component.css']
})
export class BeratungsangeboteComponent implements OnInit {
  tags: any[] = [];
  zielgruppen: any[] = [];
  selectedTags: Set<number> = new Set(); // Enthält die IDs der ausgewählten Tags
  selectedZielgruppen: Set<string> = new Set(); // Enthält die IDs der ausgewählten Zielgruppen

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getTags();
    this.getZielgruppen();
  }

  // Tags abrufen
  getTags(): void {
    this.dataService.getTags().subscribe(response => {
      this.tags = response.data;
    });
  }

  // Zielgruppen abrufen
  getZielgruppen(): void {
    this.dataService.getZielgruppen().subscribe(response => {
      this.zielgruppen = response.data;
    });
  }

  // Tag auswählen oder abwählen
  toggleTag(id: number): void {
    if (this.selectedTags.has(id)) {
      this.selectedTags.delete(id);
    } else {
      this.selectedTags.add(id);
    }
  }

  toggleZielgruppe(zielgruppe: string): void {
    if (this.selectedZielgruppen.has(zielgruppe)) {
      this.selectedZielgruppen.delete(zielgruppe);
    } else {
      this.selectedZielgruppen.add(zielgruppe);
    }
  }
  
  
}


