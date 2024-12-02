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
  angebotsarten: string[] = [];
  selectedArt: string = '';

  // Steuerungsvariablen für die Sichtbarkeit der Felder
  showAddTagForm: boolean = false;
  showAddZielgruppeForm: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadTags();
    this.loadZielgruppen();
    this.loadAngebotsarten();
  }

  login(username: string, password: string) {
    if (username === 'admin' && password === 'password123') {
      this.isLoggedIn = true;
    } else {
      alert('Ungültige Anmeldedaten!');
    }
  }

  logout() {
    this.isLoggedIn = false;
  }
  // createInstitution(name: string, description: string, url: string) {
  //   const institution = {
  //     name,
  //     description,
  //     url,
  //   };
  
  //   this.dataService.createInstitution(institution).subscribe({
  //     next: (response) => {
  //       console.log('Institution erfolgreich erstellt:', response);
  //       alert('Die Institution wurde erfolgreich erstellt.');
  //     },
  //     error: (err) => {
  //       console.error('Fehler beim Erstellen der Institution:', err);
  //       alert('Es gab einen Fehler beim Speichern der Institution.');
  //     },
  //   });
  // }

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
}


