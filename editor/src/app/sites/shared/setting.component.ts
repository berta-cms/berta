import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SettingModel, SettingConfigModel } from '../../shared/interfaces';

@Component({
  selector: 'berta-setting',
  template: `
    <label [title]="config.format">
      {{ config.title }}
      <ng-container [ngSwitch]="config.format">
        <input *ngSwitchCase="'text'"
               type="text"
               [value]="setting.value"
               (keydown)="updateTextField(setting.slug, $event.target.value, $event)"
               (blur)="updateTextField(setting.slug, $event.target.value, $event)">

        <input *ngSwitchCase="'color'"
               size="7"
               type="text"
               [value]="setting.value"
               (keydown)="updateTextField(setting.slug, $event.target.value, $event)"
               (blur)="updateTextField(setting.slug, $event.target.value, $event)">

        <div *ngSwitchCase="'icon'" style="text-align: right;">
          {{setting.value}}<br>
          <input type="file">
        </div>

        <div *ngSwitchCase="'image'" style="text-align: right;">
          {{setting.value}}<br>
          <input type="file">
        </div>

        <textarea *ngSwitchCase="'longtext'"
                  (blur)="updateTextField(setting.slug, $event.target.value, $event)">{{setting.value}}</textarea>

        <select *ngSwitchCase="'select'" (change)="updateField(setting.slug, $event.target.value, $event.target)">
          <option *ngFor="let val of config.values"
                  [value]="val.value"
                  [attr.selected]="(val.value === setting.value ? '' : null)">{{ val.title }}</option>
        </select>

        <select *ngSwitchCase="'fontselect'" (change)="updateField(setting.slug, $event.target.value, $event.target)">
          <option *ngFor="let val of config.values"
                  [value]="val.value"
                  [attr.selected]="(val.value === setting.value ? '' : null)">{{ val.title }}</option>
        </select>
        <div *ngSwitchDefault style="padding: 10px">{{ config.format || '' }}</div>
      </ng-container>
    </label>
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
