import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitesComponent } from './sites.component';
import { NgxsModule } from '@ngxs/store';
import { SitesState } from './sites-state/sites.state';
import { SiteComponent } from './site/site.component';
import { AutofocusDirective } from './autofocus.directive';
import { SiteSectionsModule } from './sections/site-sections.module';
import { SiteSettingsComponent } from './settings/site-settings.component';
import { SitesSettingsState } from './settings/site-settings.state';


@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      SitesState,
      SitesSettingsState
    ]),
    SiteSectionsModule
  ],
  declarations: [SitesComponent, SiteComponent, AutofocusDirective, SiteSettingsComponent]
})
export class SitesModule { }
