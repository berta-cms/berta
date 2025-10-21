import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { SiteStateModel } from './sites-state/site-state.model';
import { UpdateInputFocus } from '../app-state/app.actions';
import {
  CreateSiteAction,
  ReOrderSitesAction,
} from './sites-state/sites.actions';

@Component({
  selector: 'berta-sites',
  template: `
    <div cdkDropList (cdkDropListDropped)="onDrop($event)">
      @for (site of sitesList; track site) {
        <berta-site
          cdkDrag
          [site]="site"
          (inputFocus)="updateComponentFocus($event)"
        ></berta-site>
      }
    </div>
    <button type="button" class="button" (click)="createSite()">
      Create new site
    </button>
  `,
  standalone: false,
})
export class SitesComponent implements OnInit {
  @Select('sites') public sites$: Observable<SiteStateModel[]>;
  sitesList: SiteStateModel[];

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.sites$.subscribe((sites) => {
      this.sitesList = [...sites];
    });
  }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  createSite() {
    this.store
      .select((state) => state.sites)
      .pipe(
        take(1),
        map((sites: SiteStateModel[]) => {
          return sites.map((site) => site.name);
        }),
        switchMap((siteNames) =>
          this.store.dispatch(new CreateSiteAction()).pipe(
            switchMap(() => this.store.selectOnce((state) => state.sites)),
            map((sitesState: SiteStateModel[]) => {
              return sitesState.find(
                (site) => siteNames.indexOf(site.name) === -1,
              );
            }),
          ),
        ),
      )
      .subscribe((newSite) => {
        if (!newSite) {
          return;
        }
        this.router.navigate([], { queryParams: { site: newSite.name } });
      });
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    moveItemInArray(this.sitesList, event.previousIndex, event.currentIndex);
    this.store.dispatch(
      new ReOrderSitesAction(event.previousIndex, event.currentIndex),
    );
  }
}
