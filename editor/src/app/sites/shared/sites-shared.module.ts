import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { AutofocusDirective } from './autofocus.directive';
import { TextInputComponent } from '../../inputs/text-input.component';
import { LongTextInputComponent } from '../../inputs/long-text-input.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SettingComponent,
    AutofocusDirective,
    TextInputComponent,
    LongTextInputComponent
  ],
  exports: [
    SettingComponent,
    AutofocusDirective
  ]
})
export class SitesSharedModule { }
