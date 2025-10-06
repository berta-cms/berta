import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';

import { PopupService } from '../../popup/popup.service';
import { ShopSettingsState } from '../settings/shop-settings.state';
import { ShopRegionalCostsState } from './shop-regional-costs.state';
import { UpdateInputFocus } from '../../app-state/app.actions';
import {
  UpdateShopRegionAction,
  UpdateShopRegionCostAction,
  AddShopRegionAction,
  AddShopRegionCostAction,
  DeleteShopRegionAction,
  DeleteShopRegionCostAction,
} from './shop-regional-costs.actions';

@Component({
    selector: 'berta-shop-regional-costs',
    template: `
    <div class="bt-sh-region" *ngFor="let region of regionalCosts$ | async">
      <div class="setting header">
        <berta-inline-text-input
          [value]="region.name"
          (update)="updateRegion('name', $event, region.id)"
          (inputFocus)="updateInputFocus($event)"
        ></berta-inline-text-input>
        <button
          type="button"
          class="delete"
          (click)="deleteRegion(region.id, $event)"
        >
          <bt-icon-delete></bt-icon-delete>
        </button>
      </div>
      <div class="setting">
        <berta-text-input
          label="VAT (%)"
          [value]="region.vat"
          (update)="updateRegion('vat', $event, region.id)"
          (inputFocus)="updateInputFocus($event)"
        ></berta-text-input>
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
            <berta-text-input
              [value]="cost.weight"
              [placeholder]="weightLabel$ | async"
              [title]="weightTitle$ | async"
              (update)="
                updateRegionalCost('weight', $event, region.id, cost.id)
              "
              (inputFocus)="updateInputFocus($event)"
            ></berta-text-input>
            <berta-text-input
              [value]="cost.price"
              [placeholder]="priceLabel$ | async"
              [title]="priceTitle$ | async"
              (update)="updateRegionalCost('price', $event, region.id, cost.id)"
              (inputFocus)="updateInputFocus($event)"
            ></berta-text-input>
            <button
              type="button"
              class="button"
              (click)="deleteCost(cost.id, region.id, $event)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <form
        class="setting bt-sh-regional-cost"
        (submit)="addCost(region.id, $event)"
      >
        <div class="input-row">
          <berta-text-input
            value=""
            [placeholder]="weightLabel$ | async"
            [title]="weightTitle$ | async"
            [enabledOnUpdate]="true"
            [disabled]="addCostDisabled"
            (update)="newCost.weight = $event"
            (inputFocus)="updateInputFocus($event)"
            (keydown.enter)="addCost(region.id, $event)"
          ></berta-text-input>
          <berta-text-input
            value=""
            [placeholder]="priceLabel$ | async"
            [title]="priceTitle$ | async"
            [enabledOnUpdate]="true"
            [disabled]="addCostDisabled"
            (update)="newCost.price = $event"
            (inputFocus)="updateInputFocus($event)"
            (keydown.enter)="addCost(region.id, $event)"
          ></berta-text-input>
          <button
            type="submit"
            class="button"
            [attr.disabled]="addCostDisabled ? '' : null"
          >
            Add
          </button>
        </div>
      </form>
    </div>
    <form (submit)="addRegion($event)" class="setting bt-sh-region-add">
      <h4>Add region</h4>
      <div class="input-row">
        <berta-text-input
          [value]="newRegion.name"
          [placeholder]="'region'"
          [enabledOnUpdate]="true"
          [disabled]="addRegionDisabled"
          (update)="newRegion.name = $event"
          (inputFocus)="updateInputFocus($event)"
          (keydown.enter)="addRegion($event)"
        ></berta-text-input>
        <berta-text-input
          [value]="newRegion.vat"
          [placeholder]="'VAT (%)'"
          [enabledOnUpdate]="true"
          [disabled]="addRegionDisabled"
          (update)="newRegion.vat = $event"
          (inputFocus)="updateInputFocus($event)"
          (keydown.enter)="addRegion($event)"
        ></berta-text-input>
        <button
          type="submit"
          class="button"
          [attr.disabled]="addRegionDisabled ? '' : null"
        >
          Add
        </button>
      </div>
    </form>
  `,
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ],
    standalone: false
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
    vat: '',
  };
  newCost = {
    weight: 0,
    price: 0,
  };

  constructor(private store: Store, private popupService: PopupService) {}

  ngOnInit() {
    this.weightLabel$ = this.store
      .select(ShopSettingsState.getCurrentWeightUnit)
      .pipe(
        map((wUnit) => {
          return `weight (${wUnit})`;
        }),
        shareReplay(1)
      );

    this.weightTitle$ = this.store
      .select(ShopSettingsState.getCurrentWeightUnit)
      .pipe(
        map((wUnit) => {
          return `if weight is less than (${wUnit})`;
        }),
        shareReplay(1)
      );

    this.priceLabel$ = this.store
      .select(ShopSettingsState.getCurrentCurrency)
      .pipe(
        map((currency) => {
          return `price (${currency})`;
        }),
        shareReplay(1)
      );

    this.priceTitle$ = this.store
      .select(ShopSettingsState.getCurrentCurrency)
      .pipe(
        map((currency) => {
          return `then price is (${currency})`;
        }),
        shareReplay(1)
      );
  }

  updateRegion(field: string, value, id: number) {
    this.store.dispatch(new UpdateShopRegionAction(id, { field, value }));
  }

  updateRegionalCost(field: string, value, id: number, cost_id: number) {
    this.store.dispatch(
      new UpdateShopRegionCostAction(id, cost_id, { field, value })
    );
  }

  updateInputFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  addRegion(event) {
    event.preventDefault();
    const data = {
      name: this.newRegion.name,
      vat: +this.newRegion.vat,
    };
    this.addRegionDisabled = true;

    this.store.dispatch(new AddShopRegionAction(data)).subscribe(() => {
      this.newRegion = { name: '', vat: '' };
      this.addRegionDisabled = false;
    });
  }

  deleteRegion(regionId, event) {
    this.popupService.showPopup({
      type: 'warn',
      content: 'Are you sure you want to delete this region?',
      showOverlay: true,
      actions: [
        {
          type: 'primary',
          label: 'OK',
          callback: (popupService) => {
            event.target.disabled = true;
            this.store.dispatch(new DeleteShopRegionAction({ id: regionId }));
            popupService.closePopup();
          },
        },
        {
          label: 'Cancel',
        },
      ],
    });
  }

  addCost(id, event) {
    event.preventDefault();
    const data = {
      weight: +this.newCost.weight,
      price: +this.newCost.price,
    };
    this.addCostDisabled = true;

    this.store.dispatch(new AddShopRegionCostAction(id, data)).subscribe(() => {
      this.newCost = { weight: 0, price: 0 };
      this.addCostDisabled = false;
    });
  }

  deleteCost(id, regionId, event) {
    this.popupService.showPopup({
      type: 'warn',
      content: 'Are you sure you want to delete this cost?',
      showOverlay: true,
      actions: [
        {
          type: 'primary',
          label: 'OK',
          callback: (popupService) => {
            event.target.disabled = true;
            this.store.dispatch(
              new DeleteShopRegionCostAction(regionId, { id: id })
            );
            popupService.closePopup();
          },
        },
        {
          label: 'Cancel',
        },
      ],
    });
  }
}
