import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteSettingsComponent } from './site-settings.component';

const routes: Routes = [
  {
    path: ':group',
    component: SiteSettingsComponent
  },
  {
    path: '',
    component: SiteSettingsComponent,
    data: { group: '' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteSettingsRoutingModule { }
