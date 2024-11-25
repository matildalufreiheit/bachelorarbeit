import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KontaktComponent } from './kontakt/kontakt.component';
import { ImpressumComponent } from './impressum-datenschutz/impressum-datenschutz.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { AdminPageComponent } from './admin-page/admin-page.component'; 

const routes: Routes = [
  { path: 'kontakt', component: KontaktComponent },
  { path: 'impressum-datenschutz', component: ImpressumComponent },
  { path: 'startseite', component: StartseiteComponent },
  { path: 'admin', component: AdminPageComponent }, // Route für Admin-Seite
  { path: '', redirectTo: '/startseite', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
