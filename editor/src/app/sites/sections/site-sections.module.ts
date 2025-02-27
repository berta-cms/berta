import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxsModule } from '@ngxs/store';
import { NgsgModule } from 'ng-sortgrid';
import { SafePipe } from '../../pipes/pipe';
import { SiteSectionsState } from './sections-state/site-sections.state';
import { SectionTagsState } from './tags/section-tags.state';
import { SitesSharedModule } from '../shared/sites-shared.module';
import { SectionEntriesModule } from './entries/section-entries.module';
import { SiteSectionsComponent } from './site-sections.component';
import { SectionComponent } from './section.component';
import { BackgroundGalleryEditorComponent } from './background-gallery-editor.component';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    NgsgModule,
    RouterModule.forChild([]),
    NgxsModule.forFeature([SiteSectionsState, SectionTagsState]),
    SectionEntriesModule,
    SitesSharedModule,
  ],
  exports: [SafePipe],
  declarations: [
    SiteSectionsComponent,
    SectionComponent,
    BackgroundGalleryEditorComponent,
    SafePipe,
  ],
})
export class SiteSectionsModule {}
