import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { SettingConfigModel } from '../../shared/interfaces';

@Component({
    selector: 'berta-setting-row-add',
    template: `
    <form class="setting" (submit)="addRow($event)">
      <div class="input-row">
        <berta-setting
          *ngFor="let inputField of inputFields | keyvalue"
          [class.bt-auto-width]="
            ['icon-readonly'].indexOf(inputField.value.config.format) > -1
          "
          [setting]="inputField.value.setting"
          [config]="inputField.value.config"
          (update)="updateField($event)"
          (keydown.enter)="addRow($event)"
        ></berta-setting>

        <button type="submit" class="button">Add</button>
      </div>
    </form>
  `,
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ],
    standalone: false
})
export class SettingRowAddComponent implements OnInit {
  @Input('config') config: SettingConfigModel;

  @Output() add = new EventEmitter();

  inputFields: any;

  constructor() {}

  ngOnInit() {
    this.inputFields = {};
    Object.keys(this.config).map((slug) => {
      this.inputFields[slug] = {
        setting: { slug: slug, value: this.config[slug].default || '' },
        config: { ...this.config[slug], ...{ enabledOnUpdate: true } },
      };
    });
  }

  updateField(event) {
    this.inputFields[event.field].setting.value = event.value;
  }

  addRow(event) {
    event.preventDefault();

    // Wait for updateField event to complete
    setTimeout(() => {
      const newRow = Object.keys(this.config).reduce((row, slug) => {
        row[slug] = this.inputFields[slug].setting.value;
        return row;
      }, {});

      // @TODO figure out how to disable/enable/clear input fields
      this.add.emit(newRow);
    }, 200);
  }
}
