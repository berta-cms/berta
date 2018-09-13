import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopSettingsComponent } from './shop-settings.component';
import { NgxsModule } from '@ngxs/store';
import { ShopState } from './shop.state';
import { ShopProductsState } from './shop-products.state';


@NgModule({
  imports: [
    CommonModule,
    ShopRoutingModule,
    NgxsModule.forFeature([
      ShopState,
      ShopProductsState
    ]),
  ],
  declarations: [ShopSettingsComponent]
})
export class ShopModule { }
