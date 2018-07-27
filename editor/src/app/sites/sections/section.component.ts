import { Component, OnInit, Input } from '@angular/core';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SectionTypes } from '../template-settings/site-template-settings.interface';

@Component({
  selector: 'berta-section',
  template: `
    <h3>{{ section.title || '...' }}</h3>
    <ul>
      <li>Section Type: {{section['@attributes'].type}}</li>
      <li><strong>SEO</strong>
        <ul>
          <li>Title: {{section.seoTitle}}</li>
          <li>Keywords: {{section.seoKeywords}}</li>
          <li>Description: {{section.seoDescription}}</li>
        </ul>
      </li>
    </ul>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SectionComponent implements OnInit {
  @Input('section') section: SiteSectionStateModel;
  @Input('templateSectionTypes') templateSectionTypes: SectionTypes;

  constructor() { }

  ngOnInit() {
  }

}
