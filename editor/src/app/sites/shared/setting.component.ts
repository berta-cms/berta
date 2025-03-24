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
    <ng-container [ngSwitch]="config.format">
      <berta-text-input
        *ngSwitchCase="'text'"
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

      <berta-url-input
        *ngSwitchCase="'url'"
        [label]="config.title"
        [placeholder]="config.placeholder"
        [value]="setting.value"
        [allowBlank]="config.allow_blank"
        [enabledOnUpdate]="config.enabledOnUpdate"
        (inputFocus)="updateComponentFocus($event)"
        (update)="updateComponentField(setting.slug, $event)"
      ></berta-url-input>

      <berta-color-input
        *ngSwitchCase="'color'"
        [label]="config.title"
        [value]="setting.value"
        [enabledOnUpdate]="config.enabledOnUpdate"
        (inputFocus)="updateComponentFocus($event)"
        (update)="updateComponentField(setting.slug, $event)"
      ></berta-color-input>

      <berta-file-input
        *ngSwitchCase="'icon'"
        [label]="config.title"
        [templateSlug]="templateSlug"
        [property]="setting.slug"
        [accept]="'image/x-icon'"
        [value]="setting.value"
        [disabled]="disabled"
        [error]="error"
        (update)="updateComponentField(setting.slug, $event)"
      ></berta-file-input>

      <berta-icon-readonly
        *ngSwitchCase="'icon-readonly'"
        [value]="setting.value"
      ></berta-icon-readonly>

      <berta-route-button
        *ngSwitchCase="'route'"
        [label]="config.title"
        [route]="setting.value"
      ></berta-route-button>

      <berta-action-button
        *ngSwitchCase="'action'"
        [label]="config.title"
        [action]="config.default"
        (emitAction)="runAction($event)"
      ></berta-action-button>

      <berta-file-input
        *ngSwitchCase="'image'"
        [label]="config.title"
        [property]="setting.slug"
        [accept]="'image/*'"
        [value]="setting.value"
        [disabled]="disabled"
        [disableRemove]="config.disableRemove"
        [error]="error"
        (update)="updateComponentField(setting.slug, $event)"
      ></berta-file-input>

      <berta-long-text-input
        *ngSwitchCase="'longtext'"
        [label]="config.title"
        [placeholder]="config.placeholder"
        [value]="setting.value"
        [disabled]="disabled"
        [disabledReason]="disabledReason"
        [enabledOnUpdate]="config.enabledOnUpdate"
        (inputFocus)="updateComponentFocus($event)"
        (update)="updateComponentField(setting.slug, $event)"
      ></berta-long-text-input>

      <berta-rich-text-input
        *ngSwitchCase="'richtext'"
        [label]="config.title"
        [placeholder]="config.placeholder"
        [value]="setting.value"
        [disabled]="disabled"
        [disabledReason]="disabledReason"
        [enabledOnUpdate]="config.enabledOnUpdate"
        (inputFocus)="updateComponentFocus($event)"
        (update)="updateComponentField(setting.slug, $event)"
      ></berta-rich-text-input>

      <berta-select-input
        *ngSwitchCase="'select'"
        [label]="config.title"
        [tip]="config.tip"
        [value]="setting.value"
        [values]="config.values"
        (inputFocus)="updateComponentFocus($event)"
        [enabledOnUpdate]="config.enabledOnUpdate"
        (update)="updateComponentField(setting.slug, $event)"
      >
      </berta-select-input>

      <berta-select-input
        *ngSwitchCase="'fontselect'"
        [label]="config.title"
        [value]="setting.value"
        [values]="config.values"
        (inputFocus)="updateComponentFocus($event)"
        (update)="updateComponentField(setting.slug, $event)"
      >
      </berta-select-input>

      <berta-toggle-input
        *ngSwitchCase="'toggle'"
        [label]="config.title"
        [value]="setting.value"
        [values]="config.values"
        [enabledOnUpdate]="config.enabledOnUpdate"
        (update)="updateComponentField(setting.slug, $event)"
      >
      </berta-toggle-input>

      <h4 *ngSwitchDefault>{{ config.title }}</h4>
    </ng-container>

    <p
      *ngIf="description"
      [innerHTML]="description"
      class="setting-description"
    ></p>
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
