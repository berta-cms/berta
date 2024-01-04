import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SitesSharedModule } from '../shared/sites-shared.module';
import { SiteMediaComponent } from './site-media.component';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    RouterModule.forChild([]),
    SitesSharedModule,
  ],
  declarations: [SiteMediaComponent],
})
export class SiteMediaModule {}
