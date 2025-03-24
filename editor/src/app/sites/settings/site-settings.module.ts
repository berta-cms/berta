import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteSettingsComponent } from './site-settings.component';
import { SiteSettingsState } from './site-settings.state';
import { NgxsModule } from '@ngxs/store';
import { SiteSettingsConfigState } from './site-settings-config.state';
import { SitesSharedModule } from '../shared/sites-shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    NgxsModule.forFeature([SiteSettingsState, SiteSettingsConfigState]),
    SitesSharedModule,
  ],
  declarations: [SiteSettingsComponent],
})
export class SiteSettingsModule {}
