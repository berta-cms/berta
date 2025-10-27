import {
  take,
  tap,
  catchError,
  filter,
  switchMap,
  distinct,
  map,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  State,
  StateContext,
  NgxsOnInit,
  Selector,
  Action,
  Store,
  Actions,
  ofActionSuccessful,
} from '@ngxs/store';

import { ShopStateService } from '../shop-state.service';
import { AppState } from '../../app-state/app.state';
import {
  UpdateShopRegionAction,
  UpdateShopRegionCostAction,
  AddShopRegionAction,
  AddShopRegionCostAction,
  DeleteShopRegionAction,
  DeleteShopRegionCostAction,
  RenameShopRegionSiteAction,
  DeleteShopRegionSiteAction,
  ResetShopRegionalCostsAction,
  InitShopRegionalCostsAction,
} from './shop-regional-costs.actions';
import { ShopState } from '../shop.state';
import { AppStateService } from '../../app-state/app-state.service';
import { UserState } from '../../user/user.state';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { combineLatest, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwapContentsSitesAction } from 'src/app/sites/sites-state/sites.actions';

interface ShopRegion {
  id: number;
  name: string;
  vat: number;
  costs: ShopRegionalCost[];
}

interface ShopRegionalCost {
  id: number;
  weight: number;
  price: number;
}

interface ShopRegionalCostsModel {
  [site: string]: ShopRegion[];
}

const defaultState: ShopRegionalCostsModel = {};

@State<ShopRegionalCostsModel>({
  name: 'shopRegionalCosts',
  defaults: defaultState,
})
@Injectable()
export class ShopRegionalCostsState implements NgxsOnInit {
  @Selector([ShopRegionalCostsState, AppState.getSite])
  static getCurrentSiteRegionalCosts(
    state: ShopRegionalCostsModel,
    site: string,
  ) {
    return state[site];
  }

  private destroyRef = inject(DestroyRef);
  private counter = 0;

  constructor(
    private store$: Store,
    private appStateService: AppStateService,
    private stateService: ShopStateService,
    private actions$: Actions,
  ) {}

  ngxsOnInit({ dispatch }: StateContext<ShopRegionalCostsModel>) {
    combineLatest([
      this.store$.select(AppState.getSite),
      this.store$.select(UserState.hasFeatureShop),
      this.actions$.pipe(
        ofActionSuccessful(SwapContentsSitesAction),
        startWith(null), // Emit initial value so combineLatest starts immediately
      ),
    ])
      .pipe(
        filter(([site, hasFeatureShop]) => site !== null && hasFeatureShop),
        map(([site, , action]) => ({
          site,
          isSwapSitesContentsAction: action !== null,
        })),
        distinct(({ site, isSwapSitesContentsAction }) =>
          isSwapSitesContentsAction ? this.counter++ : site,
        ),
        switchMap(({ site, isSwapSitesContentsAction }) =>
          this.stateService
            .getInitialState(site, 'regionalCosts', isSwapSitesContentsAction)
            .pipe(
              take(1),
              map((regionalCosts) => ({ site, regionalCosts })),
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ site, regionalCosts }) => {
        dispatch(
          new InitShopRegionalCostsAction({ [site]: regionalCosts[site] }),
        );
      });
  }

  @Action(InitShopRegionalCostsAction)
  initShopRegionalCosts(
    { patchState }: StateContext<ShopRegionalCostsModel>,
    action: InitShopRegionalCostsAction,
  ) {
    patchState(action.payload);
  }

  @Action(UpdateShopRegionAction)
  updateShopRegion(
    { getState, patchState }: StateContext<ShopRegionalCostsModel>,
    action: UpdateShopRegionAction,
  ) {
    const state = getState();
    const site = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);

    return this.appStateService
      .sync(
        syncURLs.regions,
        {
          path: `${site}/${action.id}/${action.payload.field}`,
          value: action.payload.value,
        },
        'PATCH',
      )
      .pipe(
        tap((response: { message: string; data: any }) => {
          patchState({
            [site]: state[site].map((region) => {
              if (region.id !== action.id) {
                return region;
              }
              return { ...region, [action.payload.field]: response.data.value };
            }),
          });
        }),
        catchError((error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse) {
            console.error(error.error.message);
          } else {
            console.error(error.message);
          }
          throw error;
        }),
      );
  }

  @Action(AddShopRegionAction)
  addShopRegion(
    { getState, patchState }: StateContext<ShopRegionalCostsModel>,
    action: AddShopRegionAction,
  ) {
    const state = getState();
    const site = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);

    return this.appStateService
      .sync(
        syncURLs.regions,
        {
          site: site,
          data: { vat: 0, ...action.payload },
        },
        'POST',
      )
      .pipe(
        tap((response: { message: string; data: any }) => {
          patchState({
            [site]: [
              ...state[site],
              {
                id: +response.data.data.id,
                name: response.data.data.name,
                vat: +response.data.data.vat,
                costs: [],
              },
            ],
          });
        }),
        catchError((error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse) {
            console.error(error.error.message);
          } else {
            console.error(error.message);
          }
          throw error;
        }),
      );
  }

  @Action(DeleteShopRegionAction)
  deleteShopRegion(
    { getState, patchState }: StateContext<ShopRegionalCostsModel>,
    action: DeleteShopRegionAction,
  ) {
    const state = getState();
    const site = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);

    return this.appStateService
      .sync(
        syncURLs.regions + `/${site || 0}/${action.payload.id}`,
        {},
        'DELETE',
      )
      .pipe(
        tap(() => {
          patchState({
            [site]: state[site].filter(
              (region) => +region.id !== +action.payload.id,
            ),
          });
        }),
        catchError((error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse) {
            console.error(error.error.message);
          } else {
            console.error(error.message);
          }
          throw error;
        }),
      );
  }

  @Action(UpdateShopRegionCostAction)
  updateShopRegionalCost(
    { getState, patchState }: StateContext<ShopRegionalCostsModel>,
    action: UpdateShopRegionCostAction,
  ) {
    const state = getState();
    const site = this.store$.selectSnapshot(AppState.getSite);

    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);

    return this.appStateService
      .sync(
        syncURLs.regionalCosts,
        {
          path: `${site}/${action.id}/${action.payload.field}`,
          value: action.payload.value,
        },
        'PATCH',
      )
      .pipe(
        tap((response: { message: string; data: any }) => {
          patchState({
            [site]: state[site].map((region) => {
              if (region.id !== action.id) {
                return region;
              }
              return {
                ...region,
                costs: region.costs.map((cost) => {
                  if (cost.id !== action.costId) {
                    return cost;
                  }
                  return {
                    ...cost,
                    [action.payload.field]: response.data.value,
                  };
                }),
              };
            }),
          });
        }),
        catchError((error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse) {
            console.error(error.error.message);
          } else {
            console.error(error.message);
          }
          throw error;
        }),
      );
  }

  @Action(AddShopRegionCostAction)
  addShopRegionalCost(
    { getState, patchState }: StateContext<ShopRegionalCostsModel>,
    action: AddShopRegionCostAction,
  ) {
    const state = getState();
    const site = this.store$.selectSnapshot(AppState.getSite);

    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);

    return this.appStateService
      .sync(
        syncURLs.regionalCosts,
        {
          site: site,
          data: { id_region: action.regionId, ...action.payload },
        },
        'POST',
      )
      .pipe(
        tap((response: { message: string; data: any }) => {
          patchState({
            [site]: state[site].map((region) => {
              if (region.id !== action.regionId) {
                return region;
              }
              return {
                ...region,
                costs: [
                  ...region.costs,
                  {
                    id: response.data.data.id,
                    weight: response.data.data.weight,
                    price: response.data.data.price,
                  },
                ],
              };
            }),
          });
        }),
        catchError((error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse) {
            console.error(error.error.message);
          } else {
            console.error(error.message);
          }
          throw error;
        }),
      );
  }

  @Action(DeleteShopRegionCostAction)
  deleteShopRegionalCost(
    { getState, patchState }: StateContext<ShopRegionalCostsModel>,
    action: DeleteShopRegionCostAction,
  ) {
    const state = getState();
    const site = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);

    return this.appStateService
      .sync(
        syncURLs.regionalCosts + `/${site || 0}/${action.payload.id}`,
        {},
        'DELETE',
      )
      .pipe(
        tap(() => {
          patchState({
            [site]: state[site].map((region) => {
              if (region.id !== action.regionId) {
                return region;
              }
              return {
                ...region,
                costs: region.costs.filter((cost) => {
                  /** @todo: make sure state holds correct value types */
                  return +cost.id !== +action.payload.id;
                }),
              };
            }),
          });
        }),
        catchError((error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse) {
            console.error(error.error.message);
          } else {
            console.error(error.message);
          }
          throw error;
        }),
      );
  }

  @Action(RenameShopRegionSiteAction)
  renameShopRegionsSite(
    { setState, getState }: StateContext<ShopRegionalCostsModel>,
    action: RenameShopRegionSiteAction,
  ) {
    const state = getState();
    const newState = {};

    /* Using the loop to retain the element order in the map */
    for (const siteName in state) {
      if (siteName === action.siteName) {
        newState[action.payload] = state[siteName];
      } else {
        newState[siteName] = state[siteName];
      }
    }

    setState(newState);
  }

  @Action(DeleteShopRegionSiteAction)
  deleteShopRegionsSite(
    { setState, getState }: StateContext<ShopRegionalCostsModel>,
    action: DeleteShopRegionSiteAction,
  ) {
    const state = getState();
    const newState = {};

    /* Using the loop to retain the element order in the map */
    for (const siteName in state) {
      if (siteName !== action.payload) {
        newState[siteName] = state[siteName];
      }
    }

    setState(newState);
  }

  @Action(ResetShopRegionalCostsAction)
  resetProducts({ setState }: StateContext<ShopRegionalCostsModel>) {
    setState(defaultState);
  }
}
