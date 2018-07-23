import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteSettingsComponent } from './site-settings.component';
import { SitesSettingsState } from './sites-settings.state';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      SitesSettingsState
    ])
  ],
  declarations: [
    SiteSettingsComponent
  ]
})
export class SitesSettingsModule { }
