import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteStateModel } from './sites-state/site-state.model';
import { UpdateInputFocus } from '../app-state/app.actions';
import { CreateSiteAction, ReOrderSitesAction } from './sites-state/sites.actions';

@Component({
  selector: 'berta-sites',
  template: `
    <div cdkDropList (cdkDropListDropped)="onDrop($event)">
      <berta-site *ngFor="let site of sitesList"
                  cdkDrag
                  [site]="site"
                  (inputFocus)="updateComponentFocus($event)"></berta-site>
    </div>
    <button type="button" class="button" (click)="createSite()">Create new site</button>
  `
})
export class SitesComponent implements OnInit {
  @Select('sites') public sites$: Observable<SiteStateModel[]>;
  sitesList: SiteStateModel[];


  constructor(private store: Store) { }

  ngOnInit() {
    this.sites$.subscribe(sites => {
      this.sitesList = [...sites];
    });
  }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  createSite() {
    this.store.dispatch(CreateSiteAction);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    moveItemInArray(this.sitesList, event.previousIndex, event.currentIndex);
    this.store.dispatch(new ReOrderSitesAction(event.previousIndex, event.currentIndex));
  }
}
