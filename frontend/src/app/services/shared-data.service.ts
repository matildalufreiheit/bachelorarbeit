import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private selectedTagsSubject = new BehaviorSubject<Set<number>>(new Set());
  private selectedZielgruppenSubject = new BehaviorSubject<Set<string>>(new Set());

  selectedTags$ = this.selectedTagsSubject.asObservable();
  selectedZielgruppen$ = this.selectedZielgruppenSubject.asObservable();

  setSelectedTags(tags: Set<number>) {
    this.selectedTagsSubject.next(tags);
  }

  setSelectedZielgruppen(zielgruppen: Set<string>) {
    this.selectedZielgruppenSubject.next(zielgruppen);
  }
}
