import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { NgxsModule } from '@ngxs/store';
import { ShopState } from './shop.state';
import { ShopProductsState } from './shop-products.state';
import { ShopOrdersState } from './shop-orders.state';
import { ShopRegionalCostsState } from './shop-regional-costs.state';
import { ShopSettingsState } from './shop-settings.state';
import { ShopSettingsConfigState } from './shop-settings-config.state';


@NgModule({
  imports: [
    CommonModule,
    ShopRoutingModule,
    NgxsModule.forFeature([
      ShopState,
      ShopProductsState,
      ShopOrdersState,
      ShopRegionalCostsState,
      ShopSettingsState,
      ShopSettingsConfigState
    ]),
  ],
  declarations: [ShopComponent]
})
export class ShopModule { }
