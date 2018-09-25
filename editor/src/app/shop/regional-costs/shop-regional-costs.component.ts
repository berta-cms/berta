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
        <button type="button" (click)="deleteCost(cost.id, region.id, $event)">Delete Cost</button>
      </div>
      <form class="bt-sh-regional-cost" (submit)="addCost(region.id, $event)">
        <h5>Add Cost</h5>
        <berta-text-input [label]="weightLabel$ | async"
                          value=""
                          (update)="newCost.weight = $event"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
        <berta-text-input [label]="priceLabel$ | async"
                          value=""
                          (update)="newCost.price = $event"
                          (inputFocus)="updateInputFocus($event)"></berta-text-input>
        <button type="submit">Add Region</button>
      </form>
      <button type="button" (click)="deleteRegion(region.id, $event)">Delete Region</button>
    </div>
    <form (submit)="addRegion($event)" class="bt-sh-region" *ngIf="!!newRegion">
      <h4>Add region</h4>
      <berta-text-input label="Region"
                        [value]="newRegion.name"
                        (update)="newRegion.name = $event"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <berta-text-input label="VAT"
                        [value]="newRegion.vat"
                        (update)="newRegion.vat = $event"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <button type="submit">add</button>
    </form>
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

  addRegion(event) {
    event.preventDefault();
    const data = {
      name: this.newRegion.name,
      vat: +this.newRegion.vat
    };
    /** This is hack, to wor around input auto disable. Fix this when updating design
     * @todo: add feature [autoDisable] on input
     * @todo: add disable property on input, so we can disable them on need
     */
    this.newRegion = null;
    this.store.dispatch(new AddShopRegionAction(data)).subscribe(() => {
      this.newRegion = { name: '', vat: '' };
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

    /** This is hack, to wor around input auto disable. Fix this when updating design
     * @todo: add feature [autoDisable] on input
     * @todo: add disable property on input, so we can disable them on need
     */
    this.store.dispatch(new AddShopRegionCostAction(id, data)).subscribe(() => {
      this.newCost = { weight: 0, price: 0 };
    });
  }

  deleteCost(id, regionId, event) {
    event.target.disabled = true;
    this.store.dispatch(new DeleteShopRegionCostAction(regionId, {id: id}));
  }
}
