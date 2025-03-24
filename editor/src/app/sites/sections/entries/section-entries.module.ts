import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SectionEntriesState } from './entries-state/section-entries.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([SectionEntriesState])],
  declarations: [],
})
export class SectionEntriesModule {}
