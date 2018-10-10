import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { SiteStateModel } from './sites-state/site-state.model';
import { DeleteSiteAction, CloneSiteAction, UpdateSiteAction, RenameSiteAction } from './sites-state/sites.actions';

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
          <button *ngIf="!modificationDisabled && site['@attributes'].published < 1"
                  title="Publish"
                  (click)="updateField('@attributes.published', '1')">
            <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="16" height="12" version="1.1" viewBox="0 0 16 12"><path d="M5 9.3 5.7 8.1Q4.9 7.5 4.4 6.7 4 5.8 4 4.9q0-1.1 0.5-2-2 1-3.4 3.2 1.5 2.3 3.8 3.3zM8.4 2.6q0-0.2-0.1-0.3-0.1-0.1-0.3-0.1-1.1 0-1.9 0.8-0.8 0.8-0.8 1.9 0 0.2 0.1 0.3 0.1 0.1 0.3 0.1 0.2 0 0.3-0.1 0.1-0.1 0.1-0.3 0-0.8 0.5-1.3 0.5-0.5 1.3-0.5 0.2 0 0.3-0.1Q8.4 2.7 8.4 2.6ZM11.7 0.9q0 0.1 0 0.1Q10.7 2.6 8.8 6 7 9.4 6 11.1l-0.4 0.8q-0.1 0.1-0.3 0.1-0.1 0-1.2-0.6-0.1-0.1-0.1-0.3 0-0.1 0.4-0.8Q3.1 9.8 2 8.8 1 7.8 0.2 6.6 0 6.3 0 6 0 5.7 0.2 5.4 1.5 3.3 3.6 2.1 5.6 0.9 8 0.9q0.8 0 1.6 0.2l0.5-0.9q0.1-0.1 0.3-0.1 0 0 0.2 0.1 0.1 0.1 0.3 0.1 0.2 0.1 0.3 0.2 0.1 0.1 0.3 0.2 0.1 0.1 0.2 0.1 0.1 0.1 0.1 0.2zm0.3 4q0 1.2-0.7 2.3-0.7 1-1.9 1.5L11.9 4.1q0.1 0.4 0.1 0.8zm4 1.1q0 0.3-0.2 0.6-0.3 0.6-1 1.3-1.3 1.5-3.1 2.4-1.8 0.8-3.7 0.8L8.7 10q1.9-0.2 3.5-1.2 1.6-1.1 2.7-2.7-1-1.6-2.5-2.6l0.6-1q0.8 0.6 1.6 1.4 0.8 0.8 1.3 1.6 0.2 0.3 0.2 0.6z" stroke-width="0"/></svg>
          </button>
          <button *ngIf="!modificationDisabled && site['@attributes'].published > 0"
                  title="Unpublish"
                  (click)="updateField('@attributes.published', '0')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" version="1.1" viewBox="0 0 16 12"><path d="m14.9 6q-1.4-2.1-3.4-3.2 0.5 0.9 0.5 2 0 1.7-1.2 2.8-1.2 1.2-2.8 1.2-1.7 0-2.8-1.2-1.2-1.2-1.2-2.8 0-1.1 0.5-2-2 1-3.4 3.2 1.2 1.8 3 2.9 1.8 1.1 3.9 1.1 2.1 0 3.9-1.1 1.8-1.1 3-2.9zm-6.4-3.4q0-0.2-0.1-0.3-0.1-0.1-0.3-0.1-1.1 0-1.9 0.8-0.8 0.8-0.8 1.9 0 0.2 0.1 0.3 0.1 0.1 0.3 0.1t0.3-0.1q0.1-0.1 0.1-0.3 0-0.8 0.5-1.3 0.5-0.5 1.3-0.5 0.2 0 0.3-0.1 0.1-0.1 0.1-0.3zm7.6 3.4q0 0.3-0.2 0.6-1.2 2.1-3.4 3.3-2.1 1.2-4.5 1.2-2.3 0-4.5-1.2-2.1-1.2-3.4-3.3-0.2-0.3-0.2-0.6 0-0.3 0.2-0.6 1.3-2 3.4-3.3 2.1-1.2 4.5-1.2 2.3 0 4.5 1.2 2.1 1.2 3.4 3.3 0.2 0.3 0.2 0.6z" stroke-width="0"/></svg>
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

  constructor(private store: Store) { }

  ngOnInit() {
    this.hostname = location.hostname;
    this.modificationDisabled = this.site.name === '' || null;
  }

  updateComponentFocus(isFocused) {
    this.inputFocus.emit(isFocused);
  }

  updateField(field: string, value: string) {
    if (field === 'name') {
      this.store.dispatch(new RenameSiteAction(this.site, value));
    } else {
      this.store.dispatch(new UpdateSiteAction(this.site, field, value));
    }
  }

  cloneSite() {
    this.store.dispatch(new CloneSiteAction(this.site));
  }

  deleteSite() {
    this.store.dispatch(new DeleteSiteAction(this.site));
  }
}
