import { Component, OnInit } from '@angular/core';
import { ShopRegionalCostsState } from './shop-regional-costs.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ShopSettingsState } from '../shop-settings.state';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'berta-shop-regional-costs',
  template: `
    <div *ngFor="let region of regionalCosts$ | async" style="margin-bottom: 2rem">
      <berta-text-input label="Region" [value]="region.name"></berta-text-input>
      <berta-text-input label="VAT" [value]="region.vat"></berta-text-input>
      <div *ngFor="let cost of region.costs" style="padding-left: 2rem; margin-top: 1rem">
        <berta-text-input [label]="weightLabel$ | async" [value]="cost.weight"></berta-text-input>
        <berta-text-input [label]="priceLabel$ | async" [value]="cost.price"></berta-text-input>
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

}
