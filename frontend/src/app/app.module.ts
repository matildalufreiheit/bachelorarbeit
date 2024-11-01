import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BeratungsangeboteComponent } from './beratungsangebote/beratungsangebote.component';
import { KontaktComponent } from './kontakt/kontakt.component';
import { ScrollUpButtonComponent } from './scroll-up-button/scroll-up-button.component';
import { AusgabeTabelleComponent } from './ausgabe-tabelle/ausgabe-tabelle.component';
import { SemantischeSucheComponent } from './semantische-suche/semantische-suche.component';
import { ImpressumComponent } from './impressum-datenschutz/impressum-datenschutz.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { StartseiteComponent } from './startseite/startseite.component';

@NgModule({
  declarations: [
    AppComponent,
    BeratungsangeboteComponent,
    KontaktComponent,
    ScrollUpButtonComponent,
    AusgabeTabelleComponent,
    SemantischeSucheComponent,
    ImpressumComponent,
    HeaderComponent,
    FooterComponent,
    StartseiteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
