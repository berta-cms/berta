import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SettingModel, SettingConfigModel } from '../../shared/interfaces';

@Component({
  selector: 'berta-setting',
  template: `
    <ng-container [ngSwitch]="config.format">
      <berta-text-input *ngSwitchCase="'text'"
                        [label]="config.title"
                        [value]="setting.value"
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

      <div *ngSwitchCase="'icon'" style="text-align: right;">
        <label>
          {{ config.title }}

          {{setting.value}}<br>
          <input type="file">
        </label>
      </div>

      <div *ngSwitchCase="'image'" style="text-align: right;">
        <label>
          {{ config.title }}

          {{setting.value}}<br>
          <input type="file">
        </label>
      </div>

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

      <h4 *ngSwitchDefault>{{ config.title }}</h4>
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
  @Input('setting') setting: SettingModel;
  @Input('config') config: SettingConfigModel;

  @Output('update') update = new EventEmitter<{field: string, value: SettingModel['value']}>();

  private lastValue: SettingModel['value'];

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.setting.value;
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
