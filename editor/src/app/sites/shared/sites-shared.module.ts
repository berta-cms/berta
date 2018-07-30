import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { AutofocusDirective } from './autofocus.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SettingComponent,
    AutofocusDirective
  ],
  exports: [
    SettingComponent,
    AutofocusDirective
  ]
})
export class SitesSharedModule { }
