import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingChildrenComponent } from './setting-children.component';
import { AutofocusDirective } from './autofocus.directive';
import { ColorPickerModule } from 'ngx-color-picker';
import { TextInputComponent } from '../../inputs/text-input.component';
import { LongTextInputComponent } from '../../inputs/long-text-input.component';
import { InlineTextInputComponent } from '../../inputs/inline-text-input.component';
import { ToggleInputComponent } from '../../inputs/toggle-input.component';
import { ColorInputComponent } from '../../inputs/color-input.component';
import { SelectInputComponent } from '../../inputs/select-input.component';
import { FileInputComponent } from '../../inputs/file-input.component';
import { IconCloneComponent } from './icon-clone.component';
import { IconDeleteComponent } from './icon-delete.component';
import { IconPublishComponent } from './icon-publish.component';

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule
  ],
  declarations: [
    SettingComponent,
    SettingChildrenComponent,
    AutofocusDirective,
    TextInputComponent,
    LongTextInputComponent,
    InlineTextInputComponent,
    ToggleInputComponent,
    ColorInputComponent,
    SelectInputComponent,
    FileInputComponent,
    IconCloneComponent,
    IconDeleteComponent,
    IconPublishComponent
  ],
  exports: [
    SettingComponent,
    SettingChildrenComponent,
    AutofocusDirective,
    TextInputComponent,
    LongTextInputComponent,
    InlineTextInputComponent,
    ToggleInputComponent,
    ColorInputComponent,
    SelectInputComponent,
    FileInputComponent,
    IconCloneComponent,
    IconDeleteComponent,
    IconPublishComponent
  ]
})
export class SitesSharedModule { }
