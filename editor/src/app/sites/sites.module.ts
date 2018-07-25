import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitesComponent } from './sites.component';
import { NgxsModule } from '@ngxs/store';
import { SitesState } from './sites-state/sites.state';
import { SiteComponent } from './site.component';
import { AutofocusDirective } from './autofocus.directive';
import { SiteSectionsModule } from './sections/site-sections.module';
import { SiteSettingsModule } from './settings/site-settings.module';
import { SiteTemplateSettingsModule } from './template-settings/site-template-settings.module';



@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      SitesState
    ]),
    SiteSectionsModule,
    SiteSettingsModule,
    SiteTemplateSettingsModule
  ],
  declarations: [SitesComponent, SiteComponent, AutofocusDirective]
})
export class SitesModule { }
