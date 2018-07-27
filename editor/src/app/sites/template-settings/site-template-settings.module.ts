import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteTemplateSettingsComponent } from './site-template-settings.component';
import { SiteTemplateSettingsState } from './site-template-settings.state';
import { NgxsModule } from '@ngxs/store';
import { SiteTemplatesState } from './templates.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      SiteTemplateSettingsState,
      SiteTemplatesState
    ])
  ],
  declarations: [SiteTemplateSettingsComponent]
})
export class SiteTemplateSettingsModule { }
