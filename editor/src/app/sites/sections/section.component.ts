import { Component, OnInit, Input } from '@angular/core';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';

@Component({
  selector: 'berta-section',
  template: `
    <strong>{{ section.title }}</strong>: {{ section.name }}
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SectionComponent implements OnInit {
  @Input('section') section: SiteSectionStateModel;

  constructor() { }

  ngOnInit() {
  }

}
