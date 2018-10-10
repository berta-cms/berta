import { Component, OnInit } from '@angular/core';
import { ShopRegionalCostsState } from './shop-regional-costs.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ShopSettingsState } from '../settings/shop-settings.state';
import { map, shareReplay } from 'rxjs/operators';
import { UpdateInputFocus } from '../../app-state/app.actions';
import {
  UpdateShopRegionAction,
  UpdateShopRegionCostAction,
  AddShopRegionAction,
  AddShopRegionCostAction,
  DeleteShopRegionAction,
  DeleteShopRegionCostAction} from './shop-regional-costs.actions';


@Component({
  selector: 'berta-shop-regional-costs',
  template: `
    <div class="bt-sh-region" *ngFor="let region of regionalCosts$ | async">
      <div class="setting header">
        <berta-inline-text-input [value]="region.name"
                                 (update)="updateRegion('name', $event, region.id)"
                                 (inputFocus)="updateInputFocus($event)"></berta-inline-text-input>
        <button type="button" class="delete" (click)="deleteRegion(region.id, $event)">
          <svg xmlns="http://www.w3.org/2000/svg" width="14.7" height="16" version="1.1" viewBox="0 0 14.7 16"><path d="m5.3 6.3v6q0 0.1-0.1 0.2-0.1 0.1-0.2 0.1h-0.7q-0.1 0-0.2-0.1-0.1-0.1-0.1-0.2v-6q0-0.1 0.1-0.2 0.1-0.1 0.2-0.1h0.7q0.1 0 0.2 0.1 0.1 0.1 0.1 0.2zm2.7 0v6q0 0.1-0.1 0.2-0.1 0.1-0.2 0.1h-0.7q-0.1 0-0.2-0.1-0.1-0.1-0.1-0.2v-6q0-0.1 0.1-0.2 0.1-0.1 0.2-0.1h0.7q0.1 0 0.2 0.1 0.1 0.1 0.1 0.2zm2.7 0v6q0 0.1-0.1 0.2-0.1 0.1-0.2 0.1h-0.7q-0.1 0-0.2-0.1-0.1-0.1-0.1-0.2v-6q0-0.1 0.1-0.2 0.1-0.1 0.2-0.1h0.7q0.1 0 0.2 0.1 0.1 0.1 0.1 0.2zm1.3 7.5v-9.9h-9.3v9.9q0 0.2 0.1 0.4t0.2 0.3q0.1 0.1 0.1 0.1h8.7q0 0 0.1-0.1 0.1-0.1 0.2-0.3 0.1-0.2 0.1-0.4zm-7-11.2h4.7l-0.5-1.2q-0.1-0.1-0.2-0.1h-3.3q-0.1 0-0.2 0.1zm9.7 0.3v0.7q0 0.1-0.1 0.2-0.1 0.1-0.2 0.1h-1v9.9q0 0.9-0.5 1.5-0.5 0.6-1.2 0.6h-8.7q-0.7 0-1.2-0.6-0.5-0.6-0.5-1.5v-9.9h-1q-0.1 0-0.2-0.1-0.1-0.1-0.1-0.2v-0.7q0-0.1 0.1-0.2 0.1-0.1 0.2-0.1h3.2l0.7-1.7q0.2-0.4 0.6-0.7 0.4-0.3 0.8-0.3h3.3q0.4 0 0.8 0.3 0.4 0.3 0.6 0.7l0.7 1.7h3.2q0.1 0 0.2 0.1 0.1 0.1 0.1 0.2z" stroke-width="0"/></svg>
        </button>
      </div>
      <div class="setting">
        <berta-text-input label="VAT (%)"
                          [value]="region.vat"
                          (update)="updateRegion('vat', $event, region.id)"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
      </div>
      <div class="setting">
        <h4>Costs</h4>
        <p class="costs-label">
          {{ weightTitle$ | async }} {{ priceTitle$ | async }}
        </p>
      </div>
      <div class="bt-sh-regional-cost" *ngFor="let cost of region.costs">
        <div class="setting">
          <div class="input-row">
            <berta-text-input [value]="cost.weight"
                              [placeholder]="(weightLabel$ | async)"
                              [title]="(weightTitle$ | async)"
                              (update)="updateRegionalCost('weight', $event, region.id, cost.id)"
                              (inputFocus)="updateInputFocus($event)"></berta-text-input>
            <berta-text-input [value]="cost.price"
                              [placeholder]="(priceLabel$ | async)"
                              [title]="(priceTitle$ | async)"
                              (update)="updateRegionalCost('price', $event, region.id, cost.id)"
                              (inputFocus)="updateInputFocus($event)"></berta-text-input>
            <button type="button" class="button" (click)="deleteCost(cost.id, region.id, $event)">Delete</button>
          </div>
        </div>
      </div>
      <form class="setting bt-sh-regional-cost" (submit)="addCost(region.id, $event)">
        <div class="input-row">
          <berta-text-input value=""
                            [placeholder]="(weightLabel$ | async)"
                            [title]="(weightTitle$ | async)"
                            [enabledOnUpdate]="true"
                            [disabled]="addCostDisabled"
                            (update)="newCost.weight = $event"
                            (inputFocus)="updateInputFocus($event)"></berta-text-input>
          <berta-text-input value=""
                            [placeholder]="(priceLabel$ | async)"
                            [title]="(priceTitle$ | async)"
                            [enabledOnUpdate]="true"
                            [disabled]="addCostDisabled"
                            (update)="newCost.price = $event"
                            (inputFocus)="updateInputFocus($event)"></berta-text-input>
          <button type="submit" class="button" [attr.disabled]="(addCostDisabled ? '' : null)">Add</button>
        </div>
      </form>
    </div>
    <form (submit)="addRegion($event)" class="setting bt-sh-region-add">
      <h4>Add region</h4>
      <div class="input-row">
        <berta-text-input [value]="newRegion.name"
                          [placeholder]="'region'"
                          [enabledOnUpdate]="true"
                          [disabled]="addRegionDisabled"
                          (update)="newRegion.name = $event"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
        <berta-text-input [value]="newRegion.vat"
                          [placeholder]="'VAT (%)'"
                          [enabledOnUpdate]="true"
                          [disabled]="addRegionDisabled"
                          (update)="newRegion.vat = $event"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
        <button type="submit" class="button" [attr.disabled]="(addRegionDisabled ? '' : null)">Add</button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ShopRegionalCostsComponent implements OnInit {
  @Select(ShopRegionalCostsState.getCurrentSiteRegionalCosts) regionalCosts$;
  weightLabel$: Observable<string>;
  weightTitle$: Observable<string>;
  priceLabel$: Observable<string>;
  priceTitle$: Observable<string>;
  addRegionDisabled = false;
  addCostDisabled = false;
  newRegion = {
    name: '',
    vat: ''
  };
  newCost = {
    weight: 0,
    price: 0
  };

  constructor(private store: Store) { }

  ngOnInit() {
    this.weightLabel$ = this.store.select(ShopSettingsState.getCurrentWeightUnit).pipe(
      map(wUnit => {
        return `weight (${wUnit})`;
      }),
      shareReplay(1));

    this.weightTitle$ = this.store.select(ShopSettingsState.getCurrentWeightUnit).pipe(
      map(wUnit => {
        return `if weight is less than (${wUnit})`;
      }),
      shareReplay(1));

    this.priceLabel$ = this.store.select(ShopSettingsState.getCurrentCurrency).pipe(
      map(currency => {
        return `price (${currency})`;
      }),
      shareReplay(1));

    this.priceTitle$ = this.store.select(ShopSettingsState.getCurrentCurrency).pipe(
      map(currency => {
        return `then price is (${currency})`;
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

  addRegion(event) {
    event.preventDefault();
    const data = {
      name: this.newRegion.name,
      vat: +this.newRegion.vat
    };
    this.addRegionDisabled = true;

    this.store.dispatch(new AddShopRegionAction(data)).subscribe(() => {
      this.newRegion = { name: '', vat: '' };
      this.addRegionDisabled = false;
    });
  }

  deleteRegion(regionId, event) {
    event.target.disabled = true;
    this.store.dispatch(new DeleteShopRegionAction({id: regionId}));
  }

  addCost(id, event) {
    event.preventDefault();
    const data = {
      weight: +this.newCost.weight,
      price: +this.newCost.price
    };
    this.addCostDisabled = true;

    this.store.dispatch(new AddShopRegionCostAction(id, data)).subscribe(() => {
      this.newCost = { weight: 0, price: 0 };
      this.addCostDisabled = false;
    });
  }

  deleteCost(id, regionId, event) {
    event.target.disabled = true;
    this.store.dispatch(new DeleteShopRegionCostAction(regionId, {id: id}));
  }
}
