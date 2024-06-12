import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgsgModule } from 'ng-sortgrid';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SitesSharedModule } from '../shared/sites-shared.module';
import { SiteMediaComponent } from './site-media.component';
import { EntryGalleryComponent } from './entry-gallery.component';
import { EntryGalleryEditorComponent } from './entry-gallery-editor.component';
import { EntryGalleryImageEditorComponent } from './entry-gallery-image-editor.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    NgsgModule,
    ImageCropperModule,
    SitesSharedModule,
  ],
  declarations: [
    SiteMediaComponent,
    EntryGalleryComponent,
    EntryGalleryEditorComponent,
    EntryGalleryImageEditorComponent,
  ],
})
export class SiteMediaModule {}
