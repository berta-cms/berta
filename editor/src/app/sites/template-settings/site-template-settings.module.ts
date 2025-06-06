import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteTemplateSettingsComponent } from './site-template-settings.component';
import { SiteTemplateSettingsState } from './site-template-settings.state';
import { NgxsModule } from '@ngxs/store';
import { SiteTemplatesState } from './site-templates.state';
import { SitesSharedModule } from '../shared/sites-shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    NgxsModule.forFeature([SiteTemplateSettingsState, SiteTemplatesState]),
    SitesSharedModule,
  ],
  declarations: [SiteTemplateSettingsComponent],
})
export class SiteTemplateSettingsModule {}
