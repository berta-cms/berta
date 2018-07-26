import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteSettingsComponent } from './site-settings.component';
import { SiteSettingsState } from './site-settings.state';
import { NgxsModule } from '@ngxs/store';
import { SiteSettingsConfigState } from './site-settings-config.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      SiteSettingsState,
      SiteSettingsConfigState
    ])
  ],
  declarations: [
    SiteSettingsComponent
  ]
})
export class SiteSettingsModule { }
