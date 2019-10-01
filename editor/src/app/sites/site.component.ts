import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take, filter, switchMap, map, mergeMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { PopupService } from '../popup/popup.service';
import { SiteStateModel } from './sites-state/site-state.model';
import { DeleteSiteAction, CloneSiteAction, UpdateSiteAction, RenameSiteAction } from './sites-state/sites.actions';
import { SitesState } from './sites-state/sites.state';

@Component({
  selector: 'berta-site',
  template: `
    <div class="setting-group">
      <h3>
        <div class="control-line">
          <berta-inline-text-input [value]="site.title"
                                   (inputFocus)="updateComponentFocus($event)"
                                   (update)="updateField('title', $event)"></berta-inline-text-input>
          <div class="expand"></div>
          <button *ngIf="!modificationDisabled"
                  [attr.title]="site['@attributes'].published > 0 ? 'Unpublish': 'Publish'"
                  (click)="updateField('@attributes.published', site['@attributes'].published > 0 ? '0' : '1')">
            <berta-icon-publish [published]="(site['@attributes'].published > 0)"></berta-icon-publish>
          </button>
          <button title="copy"
                  (click)="cloneSite()">
            <bt-icon-clone></bt-icon-clone>
          </button>
          <button *ngIf="!modificationDisabled"
                  title="delete"
                  class="delete"
                  (click)="deleteSite()">
            <bt-icon-delete></bt-icon-delete>
          </button>
        </div>
        <div class="url-line">
          <a [routerLink]="['/multisite']"
             [queryParams]="(site.name === '' ? null : {site: site.name})">{{ hostname }}/</a>

          <berta-inline-text-input *ngIf="!modificationDisabled"
                                   [value]="site.name"
                                   (inputFocus)="updateComponentFocus($event)"
                                   (update)="updateField('name', $event)"></berta-inline-text-input>
        </div>
      </h3>
    </div>
  `,
  styles: [`
    :host h3 {
      display: block;
    }

    .expand,
    .control-line input[type=text],
    .url-line input {
      flex-grow: 1;
    }

    .control-line,
    .url-line {
      display: flex;
    }
  `]
})
export class SiteComponent implements OnInit {
  @Input('site') site: SiteStateModel;

  @Output() inputFocus = new EventEmitter();

  hostname: string;
  modificationDisabled: null | true = null;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private popupService: PopupService) { }

  ngOnInit() {
    this.hostname = location.hostname;
    this.modificationDisabled = this.site.name === '' || null;
  }

  updateComponentFocus(isFocused) {
    this.inputFocus.emit(isFocused);
  }

  updateField(field: string, value: string) {
    if (field === 'name') {
      this.store.dispatch(new RenameSiteAction(this.site, value)).pipe(
        switchMap(state => {
          return this.route.queryParams.pipe(
            take(1),
            filter(params => params.site && params.site === this.site.name),
            map(() => state)
          );
        }),
        map(state => state.sites.find(site => site.order === this.site.order))
      ).subscribe((renamedSite) => {
        this.router.navigate([], { replaceUrl: true, queryParams: { site: renamedSite.name }, queryParamsHandling: 'merge' });
      });

    } else {
      this.store.dispatch(new UpdateSiteAction(this.site, field, value));
    }
  }

  cloneSite() {
    this.store.select(SitesState).pipe(
      take(1),
      map((sites: SiteStateModel[]) => {
        return sites.map(site => site.name);
      }),
      switchMap(siteNames => this.store.dispatch(new CloneSiteAction(this.site)).pipe(
        map(({sites: sitesState}) => {
          return sitesState.find(site => siteNames.indexOf(site.name) === -1);
        })
      ))
    ).subscribe(newSite => {
      if (!newSite) {
        return;
      }
      this.router.navigate([], { queryParams: { site: newSite.name } });
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
            this.store.dispatch(new DeleteSiteAction(this.site)).pipe(
              mergeMap(() => {
                return this.route.queryParams.pipe(
                  take(1),
                  filter(params => params.site && params.site === this.site.name)
                );
              })
            ).subscribe(() => {
              this.router.navigate([], { queryParams: { site: null } });
            });

            popupService.closePopup();
          }
        },
        {
          label: 'Cancel'
        }
      ],
    });
  }
}
