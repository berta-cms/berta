import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  Injector,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { SiteStateModel } from './sites-state/site-state.model';
import { UpdateInputFocus } from '../app-state/app.actions';
import {
  CloneSiteAction,
  CreateSiteAction,
  ReOrderSitesAction,
} from './sites-state/sites.actions';
import { SiteComponent } from './site.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'berta-sites',
  template: `
    <div cdkDropList (cdkDropListDropped)="onDrop($event)">
      @for (site of sitesList; track site.name) {
        <berta-site
          cdkDrag
          [site]="site"
          [sites]="sites$ | async"
          (inputFocus)="updateComponentFocus($event)"
          (clone)="cloneSite(site)"
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
  @ViewChildren(SiteComponent) siteComponents: QueryList<SiteComponent>;

  destroyRef: DestroyRef;
  private injector = inject(Injector);
  sites$: Observable<SiteStateModel[]>;
  sitesList: SiteStateModel[];

  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.destroyRef = inject(DestroyRef);
    this.sites$ = this.store.select((state) => state.sites);
  }

  ngOnInit() {
    this.sites$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((sites) => {
      this.sitesList = [...sites];
    });
  }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  createSite() {
    this.addSite(new CreateSiteAction()).subscribe((newSite) => {
      if (!newSite) {
        return;
      }
      this.router.navigate([], { queryParams: { site: newSite.name } });
    });
  }

  // Opens the copy and puts the cursor in its title
  cloneSite(site: SiteStateModel) {
    this.addSite(new CloneSiteAction(site)).subscribe((newSite) => {
      if (!newSite) {
        return;
      }
      this.router
        .navigate([], { queryParams: { site: newSite.name } })
        .then(() => {
          afterNextRender(
            () => {
              this.siteComponents
                .find((component) => component.site.name === newSite.name)
                ?.focusTitle();
            },
            { injector: this.injector },
          );
        });
    });
  }

  /** Dispatches an action that adds a site and returns the added site */
  private addSite(
    action: CreateSiteAction | CloneSiteAction,
  ): Observable<SiteStateModel | undefined> {
    return this.sites$.pipe(
      take(1),
      map((sites: SiteStateModel[]) => {
        return sites.map((site) => site.name);
      }),
      switchMap((siteNames) =>
        this.store.dispatch(action).pipe(
          switchMap(() => this.store.selectOnce((state) => state.sites)),
          map((sitesState: SiteStateModel[]) => {
            return sitesState.find(
              (site) => siteNames.indexOf(site.name) === -1,
            );
          }),
        ),
      ),
    );
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
