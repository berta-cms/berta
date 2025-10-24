import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take, filter, switchMap, map, mergeMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { PopupService } from '../popup/popup.service';
import { SiteStateModel } from './sites-state/site-state.model';
import {
  DeleteSiteAction,
  CloneSiteAction,
  UpdateSiteAction,
  RenameSiteAction,
  SwapContentsSitesAction,
} from './sites-state/sites.actions';
import { AppStateModel } from '../app-state/app-state.interface';
import { Dialog } from '@angular/cdk/dialog';
import { SitesSwapContentsComponent } from './sites-swap-contents.component';
import { AppState } from '../app-state/app.state';

@Component({
  selector: 'berta-site',
  template: `
    <div
      class="setting-group"
      [class.active]="(currentSiteSlug$ | async) == site.name"
    >
      <h3>
        <div class="control-line">
          <berta-inline-text-input
            [value]="site.title"
            (inputFocus)="updateComponentFocus($event)"
            (update)="updateField('title', $event)"
          ></berta-inline-text-input>
          <div class="expand"></div>

          @if (!modificationDisabled) {
            <button
              [attr.title]="
                site['@attributes'].published > 0 ? 'Unpublish' : 'Publish'
              "
              (click)="
                updateField(
                  '@attributes.published',
                  site['@attributes'].published > 0 ? '0' : '1'
                )
              "
            >
              <berta-icon-publish
                [published]="site['@attributes'].published > 0"
              ></berta-icon-publish>
            </button>
          }

          <button title="copy" (click)="cloneSite()">
            <bt-icon-clone></bt-icon-clone>
          </button>

          @if (sites.length > 1) {
            <button
              title="swap content between other site"
              (click)="swapContentsBetweenOtherSite()"
            >
              <bt-icon-switch />
            </button>
          }

          @if (!modificationDisabled) {
            <button title="delete" class="delete" (click)="deleteSite()">
              <bt-icon-delete></bt-icon-delete>
            </button>
          }
        </div>
        <div class="url-line">
          <a
            [routerLink]="['/multisite']"
            [queryParams]="site.name === '' ? null : { site: site.name }"
            >{{ hostname }}/</a
          >
          @if (!modificationDisabled) {
            <berta-inline-text-input
              [value]="site.name"
              (inputFocus)="updateComponentFocus($event)"
              (textClick)="navigateToSite(site.name)"
              (update)="updateField('name', $event)"
            ></berta-inline-text-input>
          }
        </div>
      </h3>
    </div>
  `,
  styles: [
    `
      :host h3 {
        display: block;
      }

      .expand,
      .control-line input[type='text'],
      .url-line input {
        flex-grow: 1;
      }

      .control-line,
      .url-line {
        display: flex;
      }
    `,
  ],
  standalone: false,
})
export class SiteComponent implements OnInit {
  @Input('site') site: SiteStateModel;
  @Input('sites') sites: SiteStateModel[];

  @Output() inputFocus = new EventEmitter();

  currentSiteSlug$: Observable<AppStateModel['site']>;
  dialog = inject(Dialog);

  hostname: string;
  modificationDisabled: null | true = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private popupService: PopupService,
  ) {
    this.currentSiteSlug$ = this.store.select(AppState.getSite);
  }

  ngOnInit() {
    this.hostname = location.hostname;
    this.modificationDisabled = this.site.name === '' || null;
  }

  updateComponentFocus(isFocused) {
    this.inputFocus.emit(isFocused);
  }

  updateField(field: string, value: string) {
    if (field === 'name') {
      this.store
        .dispatch(new RenameSiteAction(this.site, value))
        .pipe(
          switchMap((state) => {
            return this.route.queryParams.pipe(
              take(1),
              filter((params) => params.site && params.site === this.site.name),
              map(() => state),
            );
          }),
          switchMap(() => this.store.select((state) => state.sites)),
          take(1),
          map((sitesState: SiteStateModel[]) =>
            sitesState.find((site) => site.order === this.site.order),
          ),
        )
        .subscribe((renamedSite) => {
          this.router.navigate([], {
            replaceUrl: true,
            queryParams: { site: renamedSite.name },
            queryParamsHandling: 'merge',
          });
        });
    } else {
      this.store.dispatch(new UpdateSiteAction(this.site, field, value));
    }
  }

  cloneSite() {
    this.store
      .select((state) => state.sites)
      .pipe(
        take(1),
        map((sites: SiteStateModel[]) => {
          return sites.map((site) => site.name);
        }),
        switchMap((siteNames) =>
          this.store.dispatch(new CloneSiteAction(this.site)).pipe(
            switchMap(() => this.store.select((state) => state.sites)),
            take(1),
            map((sitesState: SiteStateModel[]) =>
              sitesState.find((site) => siteNames.indexOf(site.name) === -1),
            ),
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

  swapContentsBetweenOtherSite() {
    const availableSites = this.sites.filter((s) => s.name !== this.site.name);
    const dialogRef = this.dialog.open<string>(SitesSwapContentsComponent, {
      data: {
        currentSite: this.site,
        sites: availableSites,
        selectedSiteSlug: availableSites[0].name,
      },
    });

    dialogRef.closed.subscribe((selectedSiteSlug) => {
      if (selectedSiteSlug === undefined) {
        return;
      }

      this.store
        .dispatch(
          new SwapContentsSitesAction({
            siteSlugFrom: this.site.name,
            siteSlugTo: selectedSiteSlug,
          }),
        )
        .subscribe({
          next: () => {
            // @TODO update switched site states
            // Current workaround is to reload the window
            // better reload/rerender only the preview iframe
            this.router
              .navigate(['/multisite'], {
                queryParams: { site: this.site.name },
              })
              .then(() => {
                window.location.reload();
              });
          },
          error: (error) => {
            console.error(error);
            this.popupService.showPopup({
              type: 'error',
              content:
                'Failed to swap contents between sites. Please try again.',
              showOverlay: true,
              actions: [{ label: 'OK' }],
            });
          },
        });
    });
  }

  deleteSite() {
    this.popupService.showPopup({
      type: 'warn',
      content: 'Are you sure you want to delete this site?',
      showOverlay: true,
      actions: [
        {
          type: 'primary',
          label: 'OK',
          callback: (popupService) => {
            this.store
              .dispatch(new DeleteSiteAction(this.site))
              .pipe(
                mergeMap(() => {
                  return this.route.queryParams.pipe(
                    take(1),
                    filter(
                      (params) => params.site && params.site === this.site.name,
                    ),
                  );
                }),
              )
              .subscribe(() => {
                this.router.navigate([], { queryParams: { site: null } });
              });

            popupService.closePopup();
          },
        },
        {
          label: 'Cancel',
        },
      ],
    });
  }

  navigateToSite(siteUrl) {
    this.router.navigate([], { queryParams: { site: siteUrl } });
  }
}
