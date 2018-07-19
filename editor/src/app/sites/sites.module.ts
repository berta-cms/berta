import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitesComponent } from './sites.component';
import { NgxsModule } from '@ngxs/store';
import { SitesState } from './sites-state/sites.state';


@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      SitesState
    ])
  ],
  declarations: [SitesComponent]
})
export class SitesModule { }
