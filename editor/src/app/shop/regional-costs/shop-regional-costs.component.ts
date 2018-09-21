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
    <div class="bt-sh-region" *ngFor="let region of regionalCosts$ | async">
      <berta-text-input label="Region"
                        [value]="region.name"
                        (update)="updateRegion('name', $event, region.id)"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <berta-text-input label="VAT"
                        [value]="region.vat"
                        (update)="updateRegion('vat', $event, region.id)"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <p>Costs</p>
      <div class="bt-sh-regional-cost" *ngFor="let cost of region.costs">
        <berta-text-input [label]="weightLabel$ | async"
                          [value]="cost.weight"
                          (update)="updateRegionalCost('weight', $event, region.id, cost.id)"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
        <berta-text-input [label]="priceLabel$ | async"
                          [value]="cost.price"
                          (update)="updateRegionalCost('price', $event, region.id, cost.id)"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
      </div>
    </div>
  `,
  styles: [`
    berta-text-input {
      display: block;
      margin: 1rem 0;
    }
    berta-text-input:first-child {
      margin-top: 0;
    }

    .bt-sh-region {
      padding-top: 1rem;
      border-bottom: 1px solid #ebebeb;
    }

    .bt-sh-region:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    .bt-sh-regional-cost {
      padding-left: 2rem;
    }
    p {
      color: #9b9b9b;
      font-size: 0.875em;
    }
  `]
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
