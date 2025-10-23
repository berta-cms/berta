import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@angular/cdk/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SitesComponent } from './sites.component';
import { NgxsModule } from '@ngxs/store';
import { SitesState } from './sites-state/sites.state';
import { SiteComponent } from './site.component';
import { SiteSectionsModule } from './sections/site-sections.module';
import { SiteSettingsModule } from './settings/site-settings.module';
import { SiteTemplateSettingsModule } from './template-settings/site-template-settings.module';
import { SitesSharedModule } from './shared/sites-shared.module';
import { FormsModule } from '@angular/forms';
import { SitesSwitchContentsComponent } from './sites-switch-contents.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DialogModule,
    DragDropModule,
    RouterModule.forChild([]),
    NgxsModule.forFeature([SitesState]),
    SiteSectionsModule,
    SiteSettingsModule,
    SiteTemplateSettingsModule,
    SitesSharedModule,
  ],
  declarations: [SitesComponent, SiteComponent, SitesSwitchContentsComponent],
})
export class SitesModule {}
