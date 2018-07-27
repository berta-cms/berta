import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SectionTypes } from '../template-settings/site-template-settings.interface';
import { SiteTemplatesState } from '../template-settings/templates.state';
import { filter, map } from '../../../../node_modules/rxjs/operators';

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
  sectionTypes$: Observable<{[k: string]: any}[]>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.sectionTypes$ = this.store.select(SiteTemplatesState.getCurrentTemplateSectionTypes).pipe(
      filter(sectionTypes => !!sectionTypes),
      map((sectionTypes) => {
        return Object.keys(sectionTypes).map(sectionType => {
          return { slug: sectionType, ...sectionTypes[sectionType]};
        });
      }));
  }

}
