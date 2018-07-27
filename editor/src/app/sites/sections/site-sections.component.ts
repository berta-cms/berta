import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SectionTypes } from '../template-settings/site-template-settings.interface';
import { SiteTemplatesState } from '../template-settings/templates.state';

@Component({
  selector: 'berta-site-sections',
  template: `
    <h2>Site Sections</h2>
    <div class="sections">
      <berta-section *ngFor="let section of sections$ | async"
                     [section]="section"
                     [templateSectionTypes]="sectionTypes$ | async"></berta-section>
    </div>
  `,
  styles: []
})
export class SiteSectionsComponent implements OnInit {
  @Select('siteSections') sections$: Observable<SiteSectionStateModel[]>;
  @Select(SiteTemplatesState.getCurrentTemplateSectionTypes) sectionTypes$: Observable<SectionTypes>;
  constructor() { }

  ngOnInit() {
  }

}
