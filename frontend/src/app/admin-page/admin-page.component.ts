import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  isLoggedIn = false;
  // userRole: string = ''; // Rolle des Benutzers (z. B. 'admin' oder 'user')
  tags: any[] = [];
  zielgruppen: any[] = [];
  selectedTags: number[] = [];
  selectedZielgruppen: number[] = [];
  newTag: string = ''; // Variable für neuen Tag
  newZielgruppe: string = ''; // Variable für neue Zielgruppe
  angebotsarten: string[] = [];
  selectedArt: string = '';
  angebotsnamen: string[] = [];
  selectedAngebotsname: string = '';
  institutionNames: string[] = [];
  selectedInstitutionName: string = '';


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
    this.loadAngebotsnamen();
    this.loadInstitutionNames();
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
      art: this.selectedArt, // Angebotsart wird aus der Komponente gelesen
      url,
      institution: { name, beschreibung: description, url },
      tags: this.selectedTags,
      zielgruppen: this.selectedZielgruppen,
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

  private loadAngebotsarten() {
    this.dataService.getAngebotsarten().subscribe((response: any) => {
      this.angebotsarten = response.data.map((item: { Art: string }) => item.Art);
    });
  }

  private loadAngebotsnamen(): void {
    this.dataService.getAngebote().subscribe(response => {
      // Extrahiere nur die Namen der Angebote
      this.angebotsnamen = response.data.map((item: any) => item.Name);
      console.log('Geladene Angebotsnamen:', this.angebotsnamen);
    });
  }

  private loadInstitutionNames(): void {
    this.dataService.getInstitutions().subscribe(response => {
        this.institutionNames = response.data.map((item: any) => item.Name);
        console.log('Geladene Institutionsnamen:', this.institutionNames);
    });
}

setMode(mode: 'neu' | 'löschen' | 'ändern' | 'neuerBenutzer') {
  this.mode = mode;
}

deleteInstitution(): void {
  console.log('Löschen der Institution:', this.selectedInstitutionName);

  if (!this.selectedInstitutionName) {
      alert('Bitte wählen Sie eine Institution aus.');
      return;
  }

  this.dataService.deleteInstitutionByName(this.selectedInstitutionName).subscribe({
      next: () => {
          alert(`Institution "${this.selectedInstitutionName}" erfolgreich gelöscht.`);
          this.loadInstitutionNames(); // Liste nach dem Löschen aktualisieren
          this.selectedInstitutionName = ''; // Auswahl zurücksetzen
      },
      error: (err) => {
          console.error('Fehler beim Löschen der Institution:', err);
          alert('Es gab einen Fehler beim Löschen der Institution.');
      },
  });
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


