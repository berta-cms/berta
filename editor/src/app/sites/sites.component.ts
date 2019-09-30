import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteStateModel } from './sites-state/site-state.model';
import { UpdateInputFocus } from '../app-state/app.actions';
import { CreateSiteAction, ReOrderSitesAction } from './sites-state/sites.actions';
import { take, map, switchMap, pairwise } from 'rxjs/operators';
import { SitesState } from './sites-state/sites.state';

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

  constructor(private store: Store,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.sites$.subscribe(sites => {
      this.sitesList = [...sites];
    });
  }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  createSite() {
    let newName;
    this.store.select(SitesState).pipe(
      pairwise(),
      take(2),
      switchMap(state => {
        return this.route.queryParams.pipe(
          take(1),
          map(() => state),
        )
      }),
    ).subscribe((state => {
      if (state[0].length !== state[1].length) {
        state[1].forEach(name => {
          if (!state[0].includes(name['name'])) {
            newName = name['name'];
          }
        });
      }
    }));

    this.store.dispatch(CreateSiteAction).subscribe((state => {
      this.router.navigate([], { queryParams: { site: newName } });
    }));
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    moveItemInArray(this.sitesList, event.previousIndex, event.currentIndex);
    this.store.dispatch(new ReOrderSitesAction(event.previousIndex, event.currentIndex));
  }
}
