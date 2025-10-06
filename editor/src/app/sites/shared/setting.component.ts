import { Subject } from 'rxjs';
import { bufferTime } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { SettingModel, SettingConfigModel } from '../../shared/interfaces';
import { UpdateInputFocus } from '../../app-state/app.actions';

@Component({
    selector: 'berta-setting',
    template: `
@switch (config.format) {
  @case ('text') {
    <berta-text-input
      [label]="config.title"
      [tip]="config.tip"
      [placeholder]="config.placeholder"
      [value]="setting.value"
      [disabled]="disabled"
      [disabledReason]="disabledReason"
      [allowBlank]="config.allow_blank"
      [validation]="config.validation"
      [cssUnitsRequired]="config.css_units"
      [enabledOnUpdate]="config.enabledOnUpdate"
      (inputFocus)="updateComponentFocus($event)"
      (update)="updateComponentField(setting.slug, $event)"
    ></berta-text-input>
  }
  @case ('url') {
    <berta-url-input
      [label]="config.title"
      [placeholder]="config.placeholder"
      [value]="setting.value"
      [allowBlank]="config.allow_blank"
      [enabledOnUpdate]="config.enabledOnUpdate"
      (inputFocus)="updateComponentFocus($event)"
      (update)="updateComponentField(setting.slug, $event)"
    ></berta-url-input>
  }
  @case ('color') {
    <berta-color-input
      [label]="config.title"
      [value]="setting.value"
      [enabledOnUpdate]="config.enabledOnUpdate"
      (inputFocus)="updateComponentFocus($event)"
      (update)="updateComponentField(setting.slug, $event)"
    ></berta-color-input>
  }
  @case ('icon') {
    <berta-file-input
      [label]="config.title"
      [templateSlug]="templateSlug"
      [property]="setting.slug"
      [accept]="'image/png'"
      [value]="setting.value"
      [disabled]="disabled"
      [error]="error"
      (update)="updateComponentField(setting.slug, $event)"
    ></berta-file-input>
  }
  @case ('icon-readonly') {
    <berta-icon-readonly
      [value]="setting.value"
    ></berta-icon-readonly>
  }
  @case ('route') {
    <berta-route-button
      [label]="config.title"
      [route]="setting.value"
    ></berta-route-button>
  }
  @case ('action') {
    <berta-action-button
      [label]="config.title"
      [action]="config.default"
      (emitAction)="runAction($event)"
    ></berta-action-button>
  }
  @case ('image') {
    <berta-file-input
      [label]="config.title"
      [property]="setting.slug"
      [accept]="'image/*'"
      [value]="setting.value"
      [disabled]="disabled"
      [disableRemove]="config.disableRemove"
      [error]="error"
      (update)="updateComponentField(setting.slug, $event)"
    ></berta-file-input>
  }
  @case ('longtext') {
    <berta-long-text-input
      [label]="config.title"
      [placeholder]="config.placeholder"
      [value]="setting.value"
      [disabled]="disabled"
      [disabledReason]="disabledReason"
      [enabledOnUpdate]="config.enabledOnUpdate"
      (inputFocus)="updateComponentFocus($event)"
      (update)="updateComponentField(setting.slug, $event)"
    ></berta-long-text-input>
  }
  @case ('richtext') {
    <berta-rich-text-input
      [label]="config.title"
      [placeholder]="config.placeholder"
      [value]="setting.value"
      [disabled]="disabled"
      [disabledReason]="disabledReason"
      [enabledOnUpdate]="config.enabledOnUpdate"
      (inputFocus)="updateComponentFocus($event)"
      (update)="updateComponentField(setting.slug, $event)"
    ></berta-rich-text-input>
  }
  @case ('select') {
    <berta-select-input
      [label]="config.title"
      [tip]="config.tip"
      [value]="setting.value"
      [values]="config.values"
      (inputFocus)="updateComponentFocus($event)"
      [enabledOnUpdate]="config.enabledOnUpdate"
      (update)="updateComponentField(setting.slug, $event)"
      >
    </berta-select-input>
  }
  @case ('fontselect') {
    <berta-select-input
      [label]="config.title"
      [value]="setting.value"
      [values]="config.values"
      (inputFocus)="updateComponentFocus($event)"
      (update)="updateComponentField(setting.slug, $event)"
      >
    </berta-select-input>
  }
  @case ('toggle') {
    <berta-toggle-input
      [label]="config.title"
      [value]="setting.value"
      [values]="config.values"
      [enabledOnUpdate]="config.enabledOnUpdate"
      (update)="updateComponentField(setting.slug, $event)"
      >
    </berta-toggle-input>
  }
  @default {
    <h4>{{ config.title }}</h4>
  }
}

@if (description) {
  <p
    [innerHTML]="description"
    class="setting-description"
  ></p>
}
`,
    styles: [
        `
      :host {
        display: block;
      }
      label {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
    ],
    standalone: false
})
export class SettingComponent implements OnInit {
  @Input('templateSlug') templateSlug: string;
  @Input('setting') setting: SettingModel;
  @Input('config') config: SettingConfigModel;
  @Input() disabled: boolean;
  @Input() disabledReason: string;
  @Input() error: string;
  @Output('update') update = new EventEmitter<{
    field: string;
    value: SettingModel['value'];
  }>();
  @Output('emitAction') emitAction = new EventEmitter<{ action: string }>();

  description: SafeHtml;

  private syncEvents$ = new Subject<[string, any]>();

  constructor(private store: Store, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.config.description) {
      this.description = this.sanitizer.bypassSecurityTrustHtml(
        this.config.description
      );
    }

    /* Make events execute synchoruniosly so we don't get Change after Change error */
    this.syncEvents$.pipe(bufferTime(200)).subscribe((events) => {
      for (const [name, val] of events) {
        switch (name) {
          case 'focus':
            this.store.dispatch(val);
            break;

          case 'update':
            this.update.emit(val);
            break;

          case 'emitAction':
            this.emitAction.emit(val);
            break;
        }
      }
    });
  }

  updateComponentFocus(isFocused) {
    this.syncEvents$.next(['focus', new UpdateInputFocus(isFocused)]);
  }

  updateComponentField(field, value) {
    this.syncEvents$.next(['update', { field, value }]);
  }

  runAction(event: { action: string }) {
    this.syncEvents$.next(['emitAction', { action: event.action }]);
  }
}
