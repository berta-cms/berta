import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';
import { SitesSharedModule } from '../shared/sites-shared.module';
import { SiteMediaComponent } from './site-media.component';
import { EntryGalleryComponent } from './entry-gallery.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    DragulaModule.forRoot(),
    SitesSharedModule,
  ],
  declarations: [SiteMediaComponent, EntryGalleryComponent],
})
export class SiteMediaModule {}
