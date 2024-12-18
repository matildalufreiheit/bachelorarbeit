import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private selectedTagsSubject = new BehaviorSubject<Set<number>>(new Set());
  private selectedZielgruppenSubject = new BehaviorSubject<Set<number>>(new Set());

  selectedTags$ = this.selectedTagsSubject.asObservable();
  selectedZielgruppen$ = this.selectedZielgruppenSubject.asObservable();

  setSelectedTags(tags: Set<number>): void {
    this.selectedTagsSubject.next(tags);
  }

  setSelectedZielgruppen(zielgruppen: Set<number>): void {
    this.selectedZielgruppenSubject.next(zielgruppen);
  }

  private filteredResults = new BehaviorSubject<any[]>([]);
  filteredResults$ = this.filteredResults.asObservable();

  setFilteredResults(results: any[]) {
    this.filteredResults.next(results);
  }

  private visibleDetails = new BehaviorSubject<Set<number>>(new Set());
  visibleDetails$ = this.visibleDetails.asObservable();

  setVisibleDetails(details: Set<number>) {
    this.visibleDetails.next(details);
  }


}

