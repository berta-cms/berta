import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SettingChildModel, SettingModel } from '../../shared/interfaces';
import { PopupService } from '../../../app/popup/popup.service';


@Component({
  selector: 'berta-setting-row',
  template: `
    <div class="setting">
      <div class="input-row">
        <berta-setting *ngFor="let inputField of inputFields | keyvalue"
                        [class.bt-auto-width]="['icon-readonly'].indexOf(inputField.value.config.format) > -1"
                        [setting]="inputField.value.setting"
                        [config]="inputField.value.config"
                        (update)="updateField($event)"></berta-setting>
        <button type="button"
                class="button"
                (click)="deleteRow($event)">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SettingRowComponent {
  @Input('inputFields') inputFields: Array<SettingChildModel[]>;

  @Output() update = new EventEmitter<{ field: string, value: SettingModel['value'] }>();
  @Output() delete = new EventEmitter();


  constructor(
    private popupService: PopupService) { }

  updateField(event) {
    this.update.emit(event);
  }

  deleteRow(event) {
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
            this.delete.emit();
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
