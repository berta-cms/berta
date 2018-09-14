import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { SettingModel, SettingConfigModel, SettingGroupConfigModel } from '../../shared/interfaces';
import { UpdateInputFocus } from '../../app-state/app.actions';

@Component({
  selector: 'berta-setting',
  template: `
    <ng-container [ngSwitch]="config.format">
      <berta-text-input *ngSwitchCase="'text'"
                        [label]="config.title"
                        [value]="setting.value"
                        (inputFocus)="updateComponentFocus($event)"
                        (update)="updateComponentField(setting.slug, $event)"></berta-text-input>

      <div *ngSwitchCase="'color'">
        <label>
          {{ config.title }}

          <input size="7"
                type="text"
                [value]="setting.value"
                (keydown)="updateTextField(setting.slug, $event.target.value, $event)"
                (blur)="updateTextField(setting.slug, $event.target.value, $event)">
        </label>
      </div>

      <berta-file-input *ngSwitchCase="'icon'"
                        [label]="config.title"
                        [templateSlug]="templateSlug"
                        [groupSlug]="settingGroup.slug"
                        [property]="setting.slug"
                        [accept]="'image/x-icon'"
                        [value]="setting.value"
                        (update)="updateComponentField(setting.slug, $event)"></berta-file-input>

      <berta-file-input *ngSwitchCase="'image'"
                        [label]="config.title"
                        [templateSlug]="templateSlug"
                        [groupSlug]="settingGroup.slug"
                        [property]="setting.slug"
                        [accept]="'image/*'"
                        [value]="setting.value"
                        (update)="updateComponentField(setting.slug, $event)"></berta-file-input>

      <div *ngSwitchCase="'longtext'">
        <label>
          {{ config.title }}

          <textarea (blur)="updateTextField(setting.slug, $event.target.value, $event)">{{setting.value}}</textarea>
        </label>
      </div>

      <div *ngSwitchCase="'select'">
        <label>
          {{ config.title }}

          <select (change)="updateField(setting.slug, $event.target.value, $event.target)">
            <option *ngFor="let val of config.values"
                    [value]="val.value"
                    [attr.selected]="(val.value === setting.value ? '' : null)">{{ val.title }}</option>
          </select>
        </label>
      </div>

      <div *ngSwitchCase="'fontselect'">
        <label>
          {{ config.title }}

          <select (change)="updateField(setting.slug, $event.target.value, $event.target)">
            <option *ngFor="let val of config.values"
                    [value]="val.value"
                    [attr.selected]="(val.value === setting.value ? '' : null)">{{ val.title }}</option>
          </select>
        </label>
      </div>

      <div *ngSwitchDefault style="padding: 10px">{{ config.format || '' }}</div>
    </ng-container>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 10px;
    }
    label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class SettingComponent implements OnInit {
  @Input('templateSlug') templateSlug: string;
  @Input('settingGroup') settingGroup: SettingGroupConfigModel;
  @Input('setting') setting: SettingModel;
  @Input('config') config: SettingConfigModel;

  @Output('update') update = new EventEmitter<{field: string, value: SettingModel['value']}>();

  private lastValue: SettingModel['value'];

  constructor(private store: Store) { }

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.setting.value;
  }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  updateTextField(field, value, $event) {
    if ($event instanceof KeyboardEvent && !($event.key === 'Enter' || $event.keyCode === 13)) {
      return;
    }

    this.updateField(field, value, $event.target);
  }

  updateComponentField(field, value) {
    this.update.emit({field, value});
  }

  updateField(field, value, input: HTMLInputElement) {
    if (value === this.lastValue) {
      return;
    }
    input.disabled = true;
    // This is important for the update process, so additional change events won't cause problem
    this.lastValue = value;
    this.update.emit({field, value});
  }
}
