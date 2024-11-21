import { Component } from '@angular/core';
import { MeiliSearch } from 'meilisearch';

@Component({
  selector: 'app-semantische-suche',
  templateUrl: './semantische-suche.component.html',
  styleUrls: ['./semantische-suche.component.css']
})
export class SemantischeSucheComponent {
  searchQuery = '';
  searchResults: any[] = [];
  showResults = false;
  searchLoading = false;
  searchPlaceHolder = 'Zu welchem Thema suchst du eine Beratungsstelle? Gib hier ein Stichwort ein!';
  visibleDetails: Set<number> = new Set(); // Set für sichtbare Details

  async search(query: string) {
    if (query.trim()) {
      this.searchLoading = true;
      this.showResults = true;
  
      try {
        const response = await fetch(`http://localhost:3000/meilisearch/search?q=${query}`);
        const data = await response.json();
        this.searchResults = data.hits; // `hits` enthält die Suchergebnisse
  
        // Debugging: Ausgabe der Suchergebnisse
        console.log('Suchergebnisse:', this.searchResults);
      } catch (error) {
        console.error('Fehler bei der Suche:', error);
      } finally {
        this.searchLoading = false;
      }
    }
  }
    

  get canDeleteSearchterm(): boolean {
    return this.searchQuery.length > 0;
  }
  // Suchleiste leeren
  clearSearch() {
    this.searchQuery = '';
    this.showResults = false;
    this.searchResults = [];
  }
}

