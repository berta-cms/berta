import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteSettingsComponent } from './site-settings.component';
import { SiteSettingsState } from './site-settings.state';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      SiteSettingsState
    ])
  ],
  declarations: [
    SiteSettingsComponent
  ]
})
export class SiteSettingsModule { }
