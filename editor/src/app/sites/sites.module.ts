import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitesComponent } from './sites.component';
import { NgxsModule } from '@ngxs/store';
import { SitesState } from './sites-state/sites.state';
import { SiteComponent } from './site/site.component';
import { AutofocusDirective } from './autofocus.directive';
import { SiteSectionsModule } from './sections/site-sections.module';
import { SitesSettingsModule } from './settings/sites-settings.module';



@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      SitesState
    ]),
    SiteSectionsModule,
    SitesSettingsModule
  ],
  declarations: [SitesComponent, SiteComponent, AutofocusDirective]
})
export class SitesModule { }
