import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

        <select *ngSwitchCase="'select'" (change)="updateField(setting.slug, $event.target.value)">
          <option *ngFor="let val of config.values"
                  [value]="val.value"
                  [attr.selected]="(val.value === setting.value ? '' : null)">{{ val.title }}</option>
        </select>

        <select *ngSwitchCase="'fontselect'" (change)="updateField(setting.slug, $event.target.value)">
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
  @Input('setting') setting: {value: any, slug: string};
  @Input('config') config: any;

  @Output('update') update = new EventEmitter<{field: string, value: any}>();

  private lastValue: any;

  constructor() { }

  ngOnInit() {
  }

  updateTextField(field, value, $event) {
    if ($event instanceof KeyboardEvent && !($event.key === 'Enter' || $event.keyCode === 13)) {
      return;
    }

    this.updateField(field, value);
  }

  updateField(field, value) {
    if (value === this.lastValue) {
      return;
    }
    this.lastValue = value;
    this.update.emit({field, value});
  }
}
