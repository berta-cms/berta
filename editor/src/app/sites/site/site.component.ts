import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SiteStateModel } from '../sites-state/site-state.model';

@Component({
  selector: 'berta-site',
  template: `
  <div class="control-line">
    <span [style.display]="(edit==='title' ? 'none' : '')">{{site.title || '[title]'}}</span>
    <input #title *ngIf="edit==='title'" bertaAutofocus
           type="text"
           [value]="site.title"
           (keydown)="updateField('title', title.value, $event)"
           (blur)="updateField('title', title.value, $event)">
    <button *ngIf="edit!=='title' && !modificationDisabled"
            title="Edit"
            type="button"
            (click)="editField('title')">E</button>
    <div *ngIf="edit!=='title'" class="expand"></div>
    <button [attr.disabled]="modificationDisabled"
            [class.bt-active]="site['@attributes'].published"
            title="publish">P</button>
    <button [attr.disabled]="modificationDisabled" title="delete">X</button>
    <button title="copy">CP</button>
  </div>
  <div class="url-line">http://berta.me/<span *ngIf="edit!=='name'">{{site.name}}</span>
    <button *ngIf="edit!=='name' && !modificationDisabled"
            title="Edit"
            type="button"
            (click)="editField('name')">E</button>
    <input #name *ngIf="edit==='name'" bertaAutofocus
           type="text"
           [value]="site.name"
           [attr.disabled]="modificationDisabled"
           (keydown)="updateField('name', name.value, $event)"
           (blur)="updateField('name', name.value, $event)">
  </div>
  `,
  styles: [`
    :host {
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
  @Output('update') update: EventEmitter<[SiteStateModel, {[k: string]: string}]> = new EventEmitter();

  modificationDisabled: null | true = null;
  edit: false | 'title' | 'label' = false;

  constructor() { }

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
    this.edit = false;
  }

  editField(field) {
    this.edit = field;
  }
}
