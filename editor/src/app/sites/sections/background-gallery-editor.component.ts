import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SitesState } from '../sites-state/sites.state';
import { SiteStateModel } from '../sites-state/site-state.model';

@Component({
  selector: 'berta-background-gallery-editor',
  template: `
    <aside>aside content</aside>
    <div class="content">content</div>
  `,
})
export class BackgroundGalleryEditorComponent implements OnInit {
  @Select(SitesState.getCurrentSite) currentSite$: Observable<SiteStateModel>;

  constructor() {}

  ngOnInit() {}
}
