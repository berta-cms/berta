import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { AutofocusDirective } from './autofocus.directive';
import { TextInputComponent } from '../../inputs/text-input.component';
import { FileInputComponent } from '../../inputs/file-input.component';
import { ImageInputComponent } from '../../inputs/image-input.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SettingComponent,
    AutofocusDirective,
    TextInputComponent,
    FileInputComponent,
    ImageInputComponent
  ],
  exports: [
    SettingComponent,
    AutofocusDirective
  ]
})
export class SitesSharedModule { }
