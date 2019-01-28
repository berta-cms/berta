import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngxs/store';

import { SettingConfigModel, SettingChildrenModel } from '../../shared/interfaces';
import { PopupService } from '../../../app/popup/popup.service';
import { UpdateInputFocus } from '../../../app/app-state/app.actions';


@Component({
  selector: 'berta-setting-children',
  template: `
    <div class="setting">
      <h4>{{ config.title }}</h4>
    </div>

    <div class="setting" *ngFor="let row of children; let index = index">
      <div class="input-row">
        <berta-text-input *ngFor="let field of row | keyvalue"
                          [value]="field.value.setting.value"
                          [placeholder]="field.value.config.title"
                          [title]=""
                          (inputFocus)="updateInputFocus($event)"
                          (update)="updateField(index, field.key, $event)"></berta-text-input>

        <button type="button"
                class="button"
                (click)="deleteRow(index, $event)">Delete</button>
      </div>
    </div>

    <form class="setting" (submit)="addRow($event)">
      <div class="input-row">

        <berta-text-input *ngFor="let field of newRow | keyvalue"
                          [value]="newRow[field.key]"
                          [placeholder]="field.value.title"
                          [title]=""
                          [enabledOnUpdate]="true"
                          [disabled]="addRowDisabled"
                          (update)="newRow[field.key] = $event"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>

        <button type="submit"
                class="button"
                [attr.disabled]="(addRowDisabled ? '' : null)">Add</button>
      </div>
    </form>
    <p *ngIf="description" [innerHTML]="description" class="setting-description"></p>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SettingChildrenComponent implements OnInit {
  [x: string]: any;
  @Input('children') children: SettingChildrenModel[];
  @Input('config') config: SettingConfigModel;

  @Output() update = new EventEmitter<{index: number, slug: string, value: string}>();
  @Output() add = new EventEmitter<{value: any}>();
  @Output() delete = new EventEmitter<{index: number}>();

  description: SafeHtml;
  addRowDisabled = false;
  newRow: any;

  constructor(
    private store: Store,
    private popupService: PopupService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.newRow = {};
    Object.keys(this.config.children).map(slug => {
      this.newRow[slug] = '';
    });

    if (this.config.description) {
      this.description = this.sanitizer.bypassSecurityTrustHtml(this.config.description);
    }
  }

  updateInputFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  addRow(event) {
    event.preventDefault();
    this.addRowDisabled = true;

    // @TODO wait until request ends

    this.add.emit({value: {...this.newRow}});

    Object.keys(this.config.children).map(slug => {
      this.newRow[slug] = '';
    });

    this.addRowDisabled = false;
  }

  updateField(index, slug, value) {
    this.update.emit({
      index: index,
      slug: slug,
      value: value
    });
  }

  deleteRow(index, event) {
    this.popupService.showPopup({
      type: 'warn',
      content: 'Are you sure you want to delete?',
      showOverlay: true,
      actions: [
        {
          type: 'primary',
          label: 'OK',
          callback: (popupService) => {
            event.target.disabled = true;
            this.delete.emit({index: index});
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
