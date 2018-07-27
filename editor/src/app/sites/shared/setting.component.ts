import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'berta-setting',
  template: `
    <label [title]="config.format">
      {{ config.title }}
      <ng-container [ngSwitch]="config.format">
        <input *ngSwitchCase="'text'" type="text" [value]="setting.value">

        <input *ngSwitchCase="'color'" size="7" type="text" [value]="setting.value">

        <div *ngSwitchCase="'icon'" style="text-align: right;">
          {{setting.value}}<br>
          <input *ngSwitchCase="'image'" type="file">
        </div>

        <div *ngSwitchCase="'image'" style="text-align: right;">
          {{setting.value}}<br>
          <input *ngSwitchCase="'image'" type="file">
        </div>

        <textarea *ngSwitchCase="'longtext'">{{setting.value}}</textarea>

        <select *ngSwitchCase="'select'">
          <option *ngFor="let val of config.values"
                  [value]="val.value"
                  [attr.selected]="(val.value === setting.value ? '' : null)">{{ val.title }}</option>
        </select>

        <select *ngSwitchCase="'fontselect'">
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
  @Input('setting') setting: any;
  @Input('config') config: any;

  @Output('update') update: EventEmitter<any>;

  constructor() { }

  ngOnInit() {
  }

}
