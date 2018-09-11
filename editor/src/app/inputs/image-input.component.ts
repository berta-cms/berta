import { Component } from '@angular/core';
import { FileInputComponent } from './file-input.component';

@Component({
  selector: 'berta-image-input',
  template: `
    <div class="form-group">
      <label>
        {{ label }}

        <div class="file-input-wrapper">
          <div class="file-input" [class.has-file]="value" [class.error]="hasError">
            {{ value || 'Add image...'  }}

            <input #fileInput
                   accept="image/*"
                   type="file"
                   (change)="onChange($event)">
            <div *ngIf="value"
                 class="remove-file"
                 (click)="removeFile($event)"></div>
          </div>
        </div>
      </label>
    </div>`
})
export class ImageInputComponent extends FileInputComponent {
}
