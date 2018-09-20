import { Component, OnInit } from '@angular/core';
import { ShopRegionalCostsState } from './shop-regional-costs.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ShopSettingsState } from '../settings/shop-settings.state';
import { map, shareReplay } from 'rxjs/operators';
import { UpdateInputFocus } from '../../app-state/app.actions';
import { UpdateShopRegionAction, UpdateShopRegionCostAction } from './shop-regional-costs.actions';


@Component({
  selector: 'berta-shop-regional-costs',
  template: `
    <div *ngFor="let region of regionalCosts$ | async" style="margin-bottom: 2rem">
      <berta-text-input label="Region"
                        [value]="region.name"
                        (update)="updateRegion('name', $event, region.id)"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <berta-text-input label="VAT"
                        [value]="region.vat"
                        (update)="updateRegion('vat', $event, region.id)"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <div *ngFor="let cost of region.costs" style="padding-left: 2rem; margin-top: 1rem">
        <berta-text-input [label]="weightLabel$ | async"
                          [value]="cost.weight"
                          (update)="updateRegionalCost('weight', $event, region.id, cost.id)"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
        <berta-text-input [label]="priceLabel$ | async"
                          [value]="cost.price"
                          (update)="updateRegionalCost('weight', $event, region.id, cost.id)"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
      </div>
    </div>
  `,
  styles: []
})
export class ShopRegionalCostsComponent implements OnInit {
  @Select(ShopRegionalCostsState.getCurrentSiteRegionalCosts) regionalCosts$;
  weightLabel$: Observable<string>;
  priceLabel$: Observable<string>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.weightLabel$ = this.store.select(ShopSettingsState.getCurrentWeightUnit).pipe(
      map(wUnit => {
        return `if weight is less than (${wUnit})`;
      }),
      shareReplay(1));

    this.priceLabel$ = this.store.select(ShopSettingsState.getCurrentCurrency).pipe(
      map(currency => {
        return `if weight is less than (${currency})`;
      }),
      shareReplay(1));
  }

  updateRegion(field: string, value, id: number) {
    this.store.dispatch(new UpdateShopRegionAction(id, {field, value}));
  }

  updateRegionalCost(field: string, value, id: number, cost_id: number) {
    this.store.dispatch(new UpdateShopRegionCostAction(id, cost_id, {field, value}));
  }

  updateInputFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

}
