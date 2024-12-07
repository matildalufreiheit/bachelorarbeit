import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  isLoggedIn = false;
  tags: any[] = [];
  zielgruppen: any[] = [];
  selectedTags: number[] = [];
  selectedZielgruppen: number[] = [];
  newTag: string = ''; // Variable für neuen Tag
  newZielgruppe: string = ''; // Variable für neue Zielgruppe
  angebotsarten: { ID: number; Art: string }[] = [];
  selectedArt: number[] = []; // Jetzt ein Array von IDs, da mehrere Arten ausgewählt werden können
  institutionNames: string[] = [];
  institutions: any[] = []; // Liste der Institutionen
  selectedInstitutionId: number | null = null; // ID der ausgewählten Institution
  selectedInstitution: any = null; // Details der ausgewählten Institution

  institutionName: string = ''; // Name der Institution
  institutionDescription: string = ''; // Beschreibung der Institution
  institutionURL: string = ''; // URL der Institution
  arten: { ID: number; Art: string }[] = []; // Speichere die Arten

  // Modus für die Aktionen: "neu", "löschen", "ändern"
  mode: 'neu' | 'löschen' | 'ändern' | 'neuerBenutzer' |'' = ''; // Standardmäßig kein Modus ausgewählt


  // Steuerungsvariablen für die Sichtbarkeit der Felder
  showAddTagForm: boolean = false;
  showAddZielgruppeForm: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadTags();
    this.loadZielgruppen();
    this.loadAngebotsarten();
    this.loadInstitutions();
    this.loadArten();
  }

  login(username: string, password: string) {
    this.dataService.login(username, password).subscribe({
      next: (response) => {
        if (response.success) {
          this.isLoggedIn = true;
          //this.userRole = response.rolle; // Speichere die Rolle
          alert('Erfolgreich angemeldet!');
        }
      },
      error: (err) => {
        console.error('Fehler beim Anmelden:', err);
        alert(err.error.error || 'Anmeldung fehlgeschlagen.');
      },
    });
  }  

  register(username: string, password: string) {
  this.dataService.register(username, password).subscribe({
    next: (response) => {
      alert('Benutzer erfolgreich registriert!');
    },
    error: (err) => {
      console.error('Fehler bei der Registrierung:', err);
      alert(err.error.error || 'Registrierung fehlgeschlagen.');
    },
  });
  }

  logout() {
    this.isLoggedIn = false;
  }

createAngebot(name: string, description: string, url: string) {
    const angebot = {
        name,
        beschreibung: description,
        artIDs: this.selectedArt, // IDs der ausgewählten Arten
        url,
        tags: this.selectedTags, // IDs der ausgewählten Tags
        zielgruppen: this.selectedZielgruppen, // IDs der ausgewählten Zielgruppen
        institution: {
            name: this.institutionName, // Name der Institution
            beschreibung: this.institutionDescription, // Beschreibung der Institution
            url: this.institutionURL // URL der Institution
        }
    };

    this.dataService.createAngebot(angebot).subscribe({
        next: (response) => {
            console.log('Angebot erfolgreich erstellt:', response);
            alert('Das Angebot wurde erfolgreich erstellt.');
            this.resetForm();
        },
        error: (err) => {
            console.error('Fehler beim Erstellen des Angebots:', err);
            alert('Es gab einen Fehler beim Speichern des Angebots.');
        },
    });
}

  private resetForm() {
    this.selectedTags = [];
    this.selectedZielgruppen = [];
    this.newTag = '';
    this.newZielgruppe = '';
  }  
  
  onTagsChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTags = Array.from(selectElement.selectedOptions).map(
      (option) => +option.value
    );
  }

  onZielgruppenChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedZielgruppen = Array.from(selectElement.selectedOptions).map(
      (option) => +option.value
    );
  }

  onTagCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = +checkbox.value;

    if (checkbox.checked) {
      this.selectedTags.push(value);
    } else {
      this.selectedTags = this.selectedTags.filter((id) => id !== value);
    }
  }

  onZielgruppeCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = +checkbox.value;

    if (checkbox.checked) {
      this.selectedZielgruppen.push(value);
    } else {
      this.selectedZielgruppen = this.selectedZielgruppen.filter(
        (id) => id !== value
      );
    }
  }

  // Methode zum Hinzufügen eines neuen Tags
  addTag(): void {
    if (!this.newTag.trim()) {
      alert('Tag darf nicht leer sein.');
      return;
    }
  
    console.log('Sende Anfrage zum Erstellen eines Tags:', this.newTag); // Debugging
  
    this.dataService.addTag(this.newTag).subscribe({
      next: (response) => {
        console.log('Tag erfolgreich erstellt:', response); // Debugging
        alert(`Tag "${this.newTag}" wurde erfolgreich hinzugefügt.`);
        this.loadTags(); // Aktualisiere die Tags-Liste
        this.newTag = ''; // Eingabefeld zurücksetzen
      },
      error: (err) => {
        console.error('Fehler beim Hinzufügen des Tags:', err); // Debugging
        alert('Fehler beim Hinzufügen des Tags. Bitte versuchen Sie es erneut.');
      },
    });
  }
  
  addZielgruppe(): void {
    if (!this.newZielgruppe.trim()) {
      alert('Zielgruppe darf nicht leer sein.');
      return;
    }
  
    this.dataService.addZielgruppe(this.newZielgruppe).subscribe({
      next: (response) => {
        console.log('Zielgruppe erfolgreich erstellt:', response); // Debug-Ausgabe
        alert(`Zielgruppe "${this.newZielgruppe}" wurde erfolgreich hinzugefügt.`);
        this.loadZielgruppen(); // Aktualisiere die Zielgruppen-Liste
        this.newZielgruppe = ''; // Eingabefeld zurücksetzen
      },
      error: (err) => {
        console.error('Fehler beim Hinzufügen der Zielgruppe:', err); // Debug-Ausgabe
        alert('Fehler beim Hinzufügen der Zielgruppe. Bitte versuchen Sie es erneut.');
      },
      complete: () => {
        console.log('Anfrage zum Hinzufügen einer Zielgruppe abgeschlossen.'); // Debug-Ausgabe
      },
    });
  }
  
  private loadTags() {
    this.dataService.getTags().subscribe((response: any) => {
      this.tags = response.data;
    });
  }

  private loadZielgruppen() {
    this.dataService.getZielgruppen().subscribe((response: any) => {
      this.zielgruppen = response.data;
    });
  }

  private loadAngebotsarten(): void {
    this.dataService.getAngebotsarten().subscribe((response: any) => {
      this.angebotsarten = response.data; 
      console.log('Geladene Angebotsarten:', this.angebotsarten);
    });
  }

  // Lädt die Liste aller Institutionen
  loadInstitutions(): void {
    this.dataService.getInstitutions().subscribe(response => {
      this.institutions = response.data; // Prüfe, ob response.data korrekt ist
      console.log('Geladene Institutionen:', this.institutions);
    });
  }
  
  loadArten(): void {
    this.dataService.getAngebotsarten().subscribe({
        next: (response) => {
            this.arten = response.data; // Daten zuweisen
            console.log('Geladene Arten:', this.arten); // Debug-Ausgabe
        },
        error: (err) => {
            console.error('Fehler beim Laden der Arten:', err);
        },
    });
}

  // Wird aufgerufen, wenn eine Institution im Dropdown ausgewählt wird
  onInstitutionSelected(institutionId: number): void {
    console.log('Ausgewählte Institution ID:', institutionId);
    const institution = this.institutions.find(inst => inst.ID === institutionId);
    if (institution) {
      this.selectedInstitution = { ...institution }; // Kopiere die Institution für Änderungen
      console.log('Ausgewählte Institution:', this.selectedInstitution);
    } else {
      console.error('Institution nicht gefunden:', institutionId);
    }
  }
  

  // Lädt die Details einer spezifischen Institution
  loadInstitutionDetails(institutionId: number): void {
    const institution = this.institutions.find(inst => inst.ID === institutionId);
    if (institution) {
      this.selectedInstitution = { ...institution }; // Kopie der Institution erstellen
      console.log('Ausgewählte Institution:', this.selectedInstitution);
    } else {
      console.error('Institution konnte nicht gefunden werden:', institutionId);
    }
  }

  // Ändern (Speichern)
  saveChanges(): void {
    if (this.selectedInstitution && this.selectedInstitutionId) {
      const updatedInstitution = {
        Name: this.selectedInstitution.Name,
        Beschreibung: this.selectedInstitution.Beschreibung,
        URL: this.selectedInstitution.URL,
        Tags: this.selectedTags,
        Zielgruppen: this.selectedZielgruppen,
        Art: this.selectedArt
      };
  
      this.dataService.updateInstitution(this.selectedInstitutionId, updatedInstitution)
        .subscribe({
          next: (response) => {
            console.log('Institution erfolgreich aktualisiert:', response);
            this.loadInstitutions(); // Aktualisiere die Liste
          },
          error: (err) => {
            console.error('Fehler beim Aktualisieren der Institution:', err);
          }
        });
    }
  }
  
  

// Löschen
deleteSelectedInstitution(): void {
  if (this.selectedInstitutionId) {
    this.dataService.deleteInstitution(this.selectedInstitutionId).subscribe({
      next: (response) => {
        console.log('Institution erfolgreich gelöscht:', response);
        this.loadInstitutions(); // Aktualisiere die Liste der Institutionen
        this.selectedInstitutionId = null; // Setze die Auswahl zurück
      },
      error: (err) => {
        console.error('Fehler beim Löschen der Institution:', err);
      },
    });
  } else {
    console.warn('Keine Institution ausgewählt.');
  }
}


setMode(mode: 'neu' | 'löschen' | 'ändern' | 'neuerBenutzer') {
  this.mode = mode;
}

// Tag löschen
deleteTag(tagId: number): void {
  if (!tagId) {
    alert('Kein Tag ausgewählt.');
    return;
  }

  this.dataService.deleteTagById(tagId).subscribe({
    next: () => {
      alert('Tag erfolgreich gelöscht.');
      this.loadTags(); // Tags-Liste nach dem Löschen aktualisieren
    },
    error: (err) => {
      console.error('Fehler beim Löschen des Tags:', err);
      alert('Fehler beim Löschen des Tags.');
    },
  });
}

// Zielgruppe löschen:
deleteZielgruppe(zielgruppeId: number): void {
  if (!zielgruppeId) {
    alert('Keine Zielgruppe ausgewählt.');
    return;
  }

  this.dataService.deleteZielgruppeById(zielgruppeId).subscribe({
    next: () => {
      alert('Zielgruppe erfolgreich gelöscht.');
      this.loadZielgruppen(); // Zielgruppen-Liste nach dem Löschen aktualisieren
    },
    error: (err) => {
      console.error('Fehler beim Löschen der Zielgruppe:', err);
      alert('Fehler beim Löschen der Zielgruppe.');
    },
  });
}
  
updateAngebot(id: number, name: string, description: string, url: string) {
  const angebot = {
    art: this.selectedArt,
    beschreibung: description,
    tags: this.selectedTags,
    zielgruppen: this.selectedZielgruppen,
    institution: { name, beschreibung: description, url },
  };

  this.dataService.updateAngebot(id, angebot).subscribe({
    next: () => {
      alert('Angebot erfolgreich aktualisiert.');
    },
    error: (err) => {
      console.error('Fehler beim Aktualisieren des Angebots:', err);
      alert('Es gab einen Fehler beim Aktualisieren des Angebots.');
    },
  });
}



}


