import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SiteSectionsComponent } from './site-sections.component';
import { SectionComponent } from './section.component';
import { NgxsModule } from '@ngxs/store';
import { SiteSectionsState } from './sections-state/site-sections.state';
import { SectionTagsState } from './tags/section-tags.state';
import { SectionEntriesModule } from './entries/section-entries.module';
import { SitesSharedModule } from '../shared/sites-shared.module';
import {SafePipe} from "../../pipes/pipe";

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    RouterModule.forChild([]),
    NgxsModule.forFeature([
      SiteSectionsState,
      SectionTagsState
    ]),
    SectionEntriesModule,
    SitesSharedModule
  ],
    exports: [
        SafePipe,
    ],
  declarations: [SiteSectionsComponent, SectionComponent, SafePipe,]
})
export class SiteSectionsModule { }
