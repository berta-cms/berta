import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'berta-setting',
  template: `
    <label>
      <strong>{{ config.title === '&nbsp;' ? '' : config.title }} [{{config.format}}]</strong>
      <ng-container [ngSwitch]="config.format">
        <input *ngSwitchCase="'text'" type="text" [value]="setting.value">
        <input *ngSwitchCase="'icon'" type="file" [value]="setting.value">
        <input *ngSwitchCase="'image'" type="file" [value]="setting.value">
        <select *ngSwitchCase="'select'">
          <option *ngFor="let val of config.values"
                  [value]="val.value"
                  [attr.selected]="(val.value === setting.value ? '' : null)">{{ val.title }}</option>
        </select>
        <div *ngSwitchDefault style="padding: 10px"></div>
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
