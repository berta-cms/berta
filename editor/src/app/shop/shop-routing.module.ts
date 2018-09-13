import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopSettingsComponent } from './shop-settings.component';

const routes: Routes = [
  {
    path: ':section',
    component: ShopSettingsComponent
  },
  {
    path: '',
    component: ShopSettingsComponent,
    data: { section: '' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
