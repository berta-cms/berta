import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteTemplateSettingsComponent } from './site-template-settings.component';
import { SiteTemplateSettingsState } from './site-template-settings.state';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([SiteTemplateSettingsState])
  ],
  declarations: [SiteTemplateSettingsComponent]
})
export class SiteTemplateSettingsModule { }
