import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRowComponent } from './setting-row.component';
import { SettingRowAddComponent } from './setting-row-add.component';
import { AutofocusDirective } from './autofocus.directive';
import { ColorPickerModule } from 'ngx-color-picker';
import { TextInputComponent } from '../../inputs/text-input.component';
import { UrlInputComponent } from '../../inputs/url-input.component';
import { LongTextInputComponent } from '../../inputs/long-text-input.component';
import { InlineTextInputComponent } from '../../inputs/inline-text-input.component';
import { ToggleInputComponent } from '../../inputs/toggle-input.component';
import { ColorInputComponent } from '../../inputs/color-input.component';
import { SelectInputComponent } from '../../inputs/select-input.component';
import { FileInputComponent } from '../../inputs/file-input.component';
import { IconCloneComponent } from './icon-clone.component';
import { IconDeleteComponent } from './icon-delete.component';
import { IconPublishComponent } from './icon-publish.component';
import { IconReadonlyComponent } from '../../inputs/icon-readonly.component';
import { RouteButton } from 'src/app/inputs/route-button.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { HelpTooltipComponent } from './help-tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule,
    TooltipModule,
  ],
  declarations: [
    SettingComponent,
    SettingRowComponent,
    SettingRowAddComponent,
    AutofocusDirective,
    TextInputComponent,
    UrlInputComponent,
    LongTextInputComponent,
    InlineTextInputComponent,
    ToggleInputComponent,
    ColorInputComponent,
    SelectInputComponent,
    FileInputComponent,
    IconReadonlyComponent,
    RouteButton,
    IconCloneComponent,
    IconDeleteComponent,
    IconPublishComponent,
    HelpTooltipComponent
  ],
  exports: [
    SettingComponent,
    SettingRowComponent,
    SettingRowAddComponent,
    AutofocusDirective,
    TextInputComponent,
    UrlInputComponent,
    LongTextInputComponent,
    InlineTextInputComponent,
    ToggleInputComponent,
    ColorInputComponent,
    SelectInputComponent,
    FileInputComponent,
    IconReadonlyComponent,
    RouteButton,
    IconCloneComponent,
    IconDeleteComponent,
    IconPublishComponent,
    HelpTooltipComponent
  ]
})
export class SitesSharedModule { }
