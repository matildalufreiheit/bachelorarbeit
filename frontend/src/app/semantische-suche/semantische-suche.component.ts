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

  // Meilisearch-Client einrichten
  client = new MeiliSearch({
    host: 'http://localhost:7700', // TODO: Ersetzen durch  der URL des Meilisearch-Servers
    apiKey: 'dein_api_schlüssel'   // TODO: Meilisearch-API-Schlüssel
  });

  get canDeleteSearchterm(): boolean {
    return this.searchQuery.length > 0;
  }

  // Suchanfrage durchführen
  async fetchSearch() {
    if (this.searchQuery.trim()) {
      this.searchLoading = true;
      this.showResults = true;
      const index = this.client.index('beratungsangebote'); // TODO: Name des Indexes von Meilisearch

      try {
        const response = await index.search(this.searchQuery);
        this.searchResults = response.hits;
      } catch (error) {
        console.error('Fehler bei der Suche:', error);
      } finally {
        this.searchLoading = false;
      }
    }
  }

  // Suchleiste leeren
  clearSearch() {
    this.searchQuery = '';
    this.showResults = false;
    this.searchResults = [];
  }
}

