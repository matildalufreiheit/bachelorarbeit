import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Angebot } from '../shared/angebot';
import { DataService } from './data.service';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private selectedTagsSubject = new BehaviorSubject<Set<number>>(new Set());
  private selectedZielgruppenSubject = new BehaviorSubject<Set<number>>(new Set());

  selectedTags$ = this.selectedTagsSubject.asObservable();
  selectedZielgruppen$ = this.selectedZielgruppenSubject.asObservable();

  private filteredResults = new BehaviorSubject<Angebot[]>([]);
  filteredResults$ = this.filteredResults.asObservable();

  private visibleDetails = new BehaviorSubject<Set<number>>(new Set());
  visibleDetails$ = this.visibleDetails.asObservable();

  constructor(
    private dataService: DataService,
    private languageService: LanguageService
  ) {
    this.setupFilteredResults();
  }

  setSelectedTags(tags: Set<number>): void {
    this.selectedTagsSubject.next(tags);
  }

  setSelectedZielgruppen(zielgruppen: Set<number>): void {
    this.selectedZielgruppenSubject.next(zielgruppen);
  }

  setFilteredResults(results: Angebot[]) {
    this.filteredResults.next(results);
  }

  setVisibleDetails(details: Set<number>) {
    this.visibleDetails.next(details);
  }

  // Kombinierter Stream: Sprache, Tags, Zielgruppen
  private setupFilteredResults(): void {
    combineLatest([
      this.languageService.currentLang$, // Sprache beobachten
      this.selectedTags$, // Ausgewählte Tags
      this.selectedZielgruppen$ // Ausgewählte Zielgruppen
    ])
      .pipe(
        switchMap(([lang, selectedTags, selectedZielgruppen]) =>
          combineLatest([
            this.dataService.getAngebote(), // Keine Sprache übergeben, Sprache wird intern abgerufen
            this.dataService.getAngebotTags().pipe(map((res) => res.data)),
            this.dataService.getAngebotZielgruppe().pipe(map((res) => res.data))
          ]).pipe(
            map(([angeboteResponse, angebotTags, angebotZielgruppen]) => {
              const angebote = angeboteResponse.data;
  
              return this.filterData(
                angebote,
                angebotTags,
                angebotZielgruppen,
                Array.from(selectedTags),
                Array.from(selectedZielgruppen)
              );
            })
          )
        )
      )
      .subscribe((filteredResults) => {
        this.setFilteredResults(filteredResults); // Gefilterte Ergebnisse speichern
      });
  }  

  private filterData(
    angebote: Angebot[],
    angebotTags: any[],
    angebotZielgruppen: any[],
    selectedTags: number[],
    selectedZielgruppen: number[]
  ): Angebot[] {
    return angebote.filter((angebot) => {
      const hasValidTag =
        selectedTags.length === 0 ||
        angebotTags.some(
          (at) => at.AngebotID === angebot.ID && selectedTags.includes(at.TagID)
        );

      const hasValidZielgruppe =
        selectedZielgruppen.length === 0 ||
        angebotZielgruppen.some(
          (az) =>
            az.AngebotID === angebot.ID &&
            selectedZielgruppen.includes(az.ZielgruppeID)
        );

      return hasValidTag && hasValidZielgruppe;
    });
  }
}


