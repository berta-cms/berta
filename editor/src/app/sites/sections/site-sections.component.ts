import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';

@Component({
  selector: 'berta-site-sections',
  template: `
    <h2>Site Sections</h2>
    <div class="sections">
      <berta-section *ngFor="let section of sections$ | async" [section]="section"></berta-section>
    </div>
  `,
  styles: []
})
export class SiteSectionsComponent implements OnInit {
  @Select('siteSections') sections$: Observable<SiteSectionStateModel[]>;
  constructor() { }

  ngOnInit() {
  }

}
