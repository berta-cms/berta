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
          <span [style.display]="(edit==='title' ? 'none' : '')">{{site.title || '...'}}</span>
          <input #title *ngIf="edit==='title'" bertaAutofocus
                type="text"
                [value]="site.title"
                (keydown)="updateField('title', title.value, $event)"
                (blur)="updateField('title', title.value, $event)">
          <svg *ngIf="edit!=='title'"
               title="Edit"
               type="button"
               (click)="editField('title')"
               class="edit-icon"
               width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path class="icon" d="M6 34.5v7.5h7.5l22.13-22.13-7.5-7.5-22.13 22.13zm35.41-20.41c.78-.78.78-2.05 0-2.83l-4.67-4.67c-.78-.78-2.05-.78-2.83 0l-3.66 3.66 7.5 7.5 3.66-3.66z"/>
            <path d="M0 0h48v48h-48z" fill="none"/>
          </svg>
          <div *ngIf="edit!=='title'" class="expand"></div>
          <button *ngIf="site['@attributes'].published < 1"
                  title="Publish"
                  [attr.disabled]="modificationDisabled"
                  (click)="updateSite('@attributes.published', '1')">
            Publish
          </button>
          <button *ngIf="site['@attributes'].published > 0"
                  title="Unpublish"
                  [attr.disabled]="modificationDisabled"
                  (click)="updateSite('@attributes.published', '0')">
                  Unpublish
          </button>
          <button title="copy"
                  (click)="cloneSite()">Clone</button>
          <button [attr.disabled]="modificationDisabled"
                  title="delete"
                  (click)="deleteSite()">X</button>
        </div>
        <div class="url-line">
          <a [routerLink]="['/multisite']"
            [queryParams]="(site.name === '' ? null : {site: site.name})">http://berta.me/<span *ngIf="edit!=='name'">{{site.name}}</span></a>
          <svg *ngIf="edit!=='name' && !modificationDisabled"
               title="Edit"
               type="button"
               (click)="editField('name')"
               class="edit-icon"
               width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path class="icon" d="M6 34.5v7.5h7.5l22.13-22.13-7.5-7.5-22.13 22.13zm35.41-20.41c.78-.78.78-2.05 0-2.83l-4.67-4.67c-.78-.78-2.05-.78-2.83 0l-3.66 3.66 7.5 7.5 3.66-3.66z"/>
            <path d="M0 0h48v48h-48z" fill="none"/>
          </svg>
          <input #name *ngIf="edit==='name'" bertaAutofocus
                type="text"
                [value]="site.name"
                [attr.disabled]="modificationDisabled"
                (keydown)="updateField('name', name.value, $event)"
                (blur)="updateField('name', name.value, $event)">
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
  @Output('update') update: EventEmitter<[SiteStateModel, {[k: string]: string}]> = new EventEmitter();

  modificationDisabled: null | true = null;
  edit: false | 'title' | 'label' = false;

  constructor(private store: Store) { }

  ngOnInit() {
    this.modificationDisabled = this.site.name === '' || null;
  }

  updateField(field: string, value: string, event: FocusEvent|KeyboardEvent) {
    if (this.edit === false || event instanceof KeyboardEvent && !(event.key === 'Enter' || event.keyCode === 13)) {
      return;
    }
    const update = {};
    update[field] = value;
    this.update.emit([this.site, update]);
    this.updateSite(field, value);
    this.edit = false;
  }

  editField(field) {
    this.edit = field;
  }

  updateSite(field: string, value: string) {
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
