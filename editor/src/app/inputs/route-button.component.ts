import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'berta-route-button',
  template: `<button type="button" class="button" (click)="navigate()">
    {{ label }}
  </button>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: false,
})
export class RouteButton {
  @Input() label: string;
  @Input() route: string;

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([this.route], { queryParamsHandling: 'preserve' });
  }
}
