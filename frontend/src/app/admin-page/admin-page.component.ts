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
  mode: 'neu' | 'löschen' | 'ändern' | '' = ''; // Standardmäßig kein Modus ausgewählt


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
  addTag() {
    if (!this.newTag.trim()) {
      alert('Bitte einen gültigen Tag eingeben.');
      return;
    }

    this.dataService.addTag(this.newTag).subscribe({
      next: (response) => {
        this.tags.push(response); // Neuer Tag zur Liste hinzufügen
        this.newTag = ''; // Eingabefeld leeren
      },
      error: () => {
        alert('Fehler beim Hinzufügen des Tags.');
      },
    });
  }

  // Methode zum Hinzufügen einer neuen Zielgruppe
  addZielgruppe() {
    if (!this.newZielgruppe.trim()) {
      alert('Bitte eine gültige Zielgruppe eingeben.');
      return;
    }

    this.dataService.addZielgruppe(this.newZielgruppe).subscribe({
      next: (response) => {
        this.zielgruppen.push(response); // Neue Zielgruppe zur Liste hinzufügen
        this.newZielgruppe = ''; // Eingabefeld leeren
      },
      error: () => {
        alert('Fehler beim Hinzufügen der Zielgruppe.');
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

  

  setMode(mode: 'neu' | 'löschen' | 'ändern') {
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


