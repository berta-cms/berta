import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { AutofocusDirective } from './autofocus.directive';
import { ColorPickerModule } from 'ngx-color-picker';
import { TextInputComponent } from '../../inputs/text-input.component';
import { LongTextInputComponent } from '../../inputs/long-text-input.component';
import { ToggleInputComponent } from '../../inputs/toggle-input.component';
import { ColorInputComponent } from '../../inputs/color-input.component';
import { SelectInputComponent } from '../../inputs/select-input.component';
import { FileInputComponent } from '../../inputs/file-input.component';

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule
  ],
  declarations: [
    SettingComponent,
    AutofocusDirective,
    TextInputComponent,
    LongTextInputComponent,
    ToggleInputComponent,
    ColorInputComponent,
    SelectInputComponent,
    FileInputComponent
  ],
  exports: [
    SettingComponent,
    AutofocusDirective
  ]
})
export class SitesSharedModule { }
