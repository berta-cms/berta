import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteStateModel } from './sites-state/site-state.model';
import { UpdateInputFocus } from '../app-state/app.actions';
import { CreateSiteAction, ReOrderSitesAction } from './sites-state/sites.actions';

@Component({
  selector: 'berta-sites',
  template: `
    <div class="nice" (dragend)="resetDrag()" (drop)="onDrop($event)">
      <berta-site *ngFor="let site of sites$ | async"
                  [class.bt-sort-place-after]="dragOverIndex > 0 && dragOverIndex === site.order && draggedIndex < dragOverIndex"
                  [class.bt-sort-place-before]="dragOverIndex > 0 && dragOverIndex === site.order && draggedIndex > dragOverIndex"
                  draggable="true"
                  (dragstart)="siteDragStart($event, site)"
                  (dragover)="dragOver($event, site)"
                  (drop)="onDrop($event)"
                  [site]="site"
                  (inputFocus)="updateComponentFocus($event)"></berta-site>
    </div>
    <button type="button" class="button" (click)="createSite()">Create new site</button>
  `
})
export class SitesComponent {
  @Select('sites') public sites$: Observable<SiteStateModel[]>;
  dragOverIndex: number|null = null;
  draggedIndex: number|null = null;

  constructor(private store: Store) { }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  createSite() {
    this.store.dispatch(CreateSiteAction);
  }

  siteDragStart(event, site) {
    if (site.order === 0) {
      // The home page is always the first one, don' t allow to move it
      event.preventDefault();
      return false;
    }
    this.draggedIndex = +site.order;
    event.dataTransfer.dropEffect = 'move';
  }

  dragOver(event, site) {
    // For drop to work this must be prevented
    event.preventDefault();
    this.dragOverIndex = +site.order;
  }

  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.draggedIndex === this.dragOverIndex || this.dragOverIndex === 0) {
      return;
    }
    this.store.dispatch(new ReOrderSitesAction(this.draggedIndex, this.dragOverIndex));
  }

  resetDrag() {
    this.dragOverIndex = null;
    this.draggedIndex = null;
  }
}
