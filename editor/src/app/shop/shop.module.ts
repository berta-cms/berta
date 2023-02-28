import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { NgxsModule } from '@ngxs/store';

import { SitesSharedModule } from '../sites/shared/sites-shared.module';

import { ShopState } from './shop.state';
import { ShopProductsState } from './products/shop-products.state';
import { ShopOrdersState } from './orders/shop-orders.state';
import { ShopSettingsConfigState } from './settings/shop-settings-config.state';
import { ShopProductsComponent } from './products/shop-products.component';
import { ShopOrdersComponent } from './orders/shop-orders.component';
import { ShopRegionalCostsComponent } from './regional-costs/shop-regional-costs.component';
import { ShopSettingsComponent } from './settings/shop-settings.component';
import { ShopSettingsState } from './settings/shop-settings.state';
import { ShopRegionalCostsState } from './regional-costs/shop-regional-costs.state';

@NgModule({
  imports: [
    CommonModule,
    ShopRoutingModule,
    NgxsModule.forFeature([
      ShopState,
      ShopProductsState,
      ShopOrdersState,
      ShopSettingsConfigState,
      ShopSettingsState,
      ShopRegionalCostsState,
    ]),
    SitesSharedModule,
  ],
  declarations: [
    ShopComponent,
    ShopProductsComponent,
    ShopOrdersComponent,
    ShopRegionalCostsComponent,
    ShopSettingsComponent,
  ],
})
export class ShopModule {}
