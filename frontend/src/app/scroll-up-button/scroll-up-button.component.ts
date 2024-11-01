import { Component } from '@angular/core';

@Component({
  selector: 'app-scroll-up-button',
  templateUrl: './scroll-up-button.component.html',
  styleUrls: ['./scroll-up-button.component.css']
})
export class ScrollUpButtonComponent {
  scrollUp(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

