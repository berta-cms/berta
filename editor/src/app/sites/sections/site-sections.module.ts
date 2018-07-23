import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteSectionsComponent } from './site-sections.component';
import { SectionComponent } from './section.component';
import { NgxsModule } from '@ngxs/store';
import { SiteSectionsState } from './sections-state/site-sections.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([SiteSectionsState])
  ],
  declarations: [SiteSectionsComponent, SectionComponent]
})
export class SiteSectionsModule { }
