import { concat } from 'rxjs';
import { take, map, pairwise, filter, switchMap } from 'rxjs/operators';
import {
  State,
  StateContext,
  NgxsOnInit,
  Selector,
  Store,
  Action,
  InitState,
} from '@ngxs/store';

import { ShopModel } from './shop.interface';
import { ShopStateService } from './shop-state.service';
import { SitesState } from '../sites/sites-state/sites.state';
import {
  RenameShopRegionSiteAction,
  DeleteShopRegionSiteAction,
  AddShopRegionSiteAction,
  ResetShopRegionalCostsAction,
} from './regional-costs/shop-regional-costs.actions';
import {
  RenameShopSettingsSiteAction,
  DeleteShopSettingsSiteAction,
  AddShopSettingsSiteAction,
  ResetShopSettingsAction,
  ResetShopSettingsConfigAction,
} from './settings/shop-settings.actions';
import {
  RenameShopProductSiteAction,
  DeleteShopProductSiteAction,
  AddShopProductSiteAction,
  ResetShopProductsAction,
} from './products/shop-products.actions';
import {
  RenameShopOrdersSiteAction,
  DeleteShopOrdersSiteAction,
  AddShopOrdersSiteAction,
  ResetShopOrdersAction,
} from './orders/shop-orders.actions';
import { UserState } from '../user/user.state';
import { ResetShopAction, InitShopAction } from './shop.actions';
import { Injectable } from '@angular/core';

const defaultState: ShopModel = {
  sections: [],
  urls: {},
};

@State<ShopModel>({
  name: 'shop',
  defaults: defaultState,
})
@Injectable()
export class ShopState implements NgxsOnInit {
  @Selector()
  static getSections(state: ShopModel): Array<string> {
    return state.sections;
  }

  @Selector()
  static getURLs(state: ShopModel) {
    return state.urls;
  }

  constructor(private store$: Store, private stateService: ShopStateService) {}

  ngxsOnInit({ patchState, setState, dispatch }: StateContext<ShopModel>) {
    this.store$
      .select(SitesState)
      .pipe(
        filter((sites) => !!sites && sites.length > 0),
        map((sites) => sites.map((site) => site.name)),
        pairwise(),
        map(([prevSiteNames, siteNames]) => {
          let leftOverPrevSiteNames = prevSiteNames;
          const newSiteName = siteNames.reduce((_newSiteName, siteName) => {
            if (leftOverPrevSiteNames.indexOf(siteName) === -1) {
              return siteName;
            }
            leftOverPrevSiteNames = leftOverPrevSiteNames.filter(
              (sn) => sn !== siteName
            );
            return _newSiteName;
          }, null);

          return [leftOverPrevSiteNames[0], newSiteName];
        }),
        filter(([oldSiteName, newSiteName]) => !!oldSiteName || !!newSiteName)
      )
      .subscribe(([oldSiteName, newSiteName]) => {
        /**
         * @note: Orders and Products don't need to be initialized, because there will be no orders or products
         * for site that's just created
         */
        if (oldSiteName && newSiteName) {
          this.store$.dispatch([
            new RenameShopRegionSiteAction(oldSiteName, newSiteName),
            new RenameShopSettingsSiteAction(oldSiteName, newSiteName),
            new RenameShopProductSiteAction(oldSiteName, newSiteName),
            new RenameShopOrdersSiteAction(oldSiteName, newSiteName),
          ]);
        } else if (oldSiteName) {
          // Site was deleted - delete settings for the site
          this.store$.dispatch([
            new DeleteShopRegionSiteAction(oldSiteName),
            new DeleteShopSettingsSiteAction(oldSiteName),
            new DeleteShopProductSiteAction(oldSiteName),
            new DeleteShopOrdersSiteAction(oldSiteName),
          ]);
        } else if (newSiteName) {
          // Site was created - get the data from server
          this.store$.dispatch([
            new AddShopRegionSiteAction(newSiteName),
            new AddShopSettingsSiteAction(newSiteName),
            new AddShopProductSiteAction(newSiteName),
            new AddShopOrdersSiteAction(newSiteName),
          ]);
        }
      });

    /* LOGIN: */
    concat(
      this.stateService.getInitialState().pipe(take(1)),
      this.store$.select(UserState.isLoggedIn).pipe(
        pairwise(),
        filter(([wasLoggedIn, isLoggedIn]) => !wasLoggedIn && isLoggedIn),
        switchMap(() => this.stateService.getInitialState().pipe(take(1)))
      )
    ).subscribe((state) => {
      dispatch(
        new InitShopAction({
          sections: Object.keys(state).filter((key) => {
            return (
              Object.keys(defaultState).indexOf(key) === -1 &&
              !/config$/i.test(key)
            );
          }),
          urls: state.urls,
        })
      );
    });

    /* LOGOUT: */
    this.store$
      .select(UserState.isLoggedIn)
      .pipe(
        pairwise(),
        filter(([wasLoggedIn, isLoggedIn]) => wasLoggedIn && !isLoggedIn)
      )
      .subscribe(() => {
        dispatch([
          new ResetShopAction(),
          new ResetShopProductsAction(),
          new ResetShopOrdersAction(),
          new ResetShopRegionalCostsAction(),
          new ResetShopSettingsAction(),
          new ResetShopSettingsConfigAction(),
        ]);
      });
  }

  @Action(InitShopAction)
  initializeShop(
    { setState }: StateContext<ShopModel>,
    action: InitShopAction
  ) {
    setState(action.payload);
  }

  @Action(ResetShopAction)
  resetShop({ setState }: StateContext<ShopModel>) {
    setState(defaultState);
  }
}
