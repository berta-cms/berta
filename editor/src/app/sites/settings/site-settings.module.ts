import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteSettingsComponent } from './site-settings.component';
import { SiteSettingsState } from './site-settings.state';
import { NgxsModule } from '@ngxs/store';
import { SiteSettingsConfigState } from './site-settings-config.state';
import { SitesSharedModule } from '../shared/sites-shared.module';
import { SiteSettingsRoutingModule } from './site-settings-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SiteSettingsRoutingModule,
    NgxsModule.forFeature([
      SiteSettingsState,
      SiteSettingsConfigState
    ]),
    SitesSharedModule
  ],
  declarations: [
    SiteSettingsComponent
  ]
})
export class SiteSettingsModule { }
