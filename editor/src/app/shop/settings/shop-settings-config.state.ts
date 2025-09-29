import { take, pairwise, filter, switchMap } from 'rxjs/operators';
import { State, StateContext, NgxsOnInit, Action, Store } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { initSettingConfigGroup } from '../../shared/helpers';
import {
  ResetShopSettingsConfigAction,
  InitShopSettingsConfigAction,
} from './shop-settings.actions';
import { concat } from 'rxjs';
import { UserState } from '../../user/user.state';
import { Injectable } from '@angular/core';

export interface ShopSettingsConfigModel {
  [site: string]: any;
}

const defaultState: ShopSettingsConfigModel = {};

@State<ShopSettingsConfigModel>({
  name: 'shopSettingsConfig',
  defaults: defaultState,
})
@Injectable()
export class ShopSettingsConfigState implements NgxsOnInit {
  constructor(private store$: Store, private stateService: ShopStateService) {}

  ngxsOnInit({ dispatch }: StateContext<ShopSettingsConfigModel>) {
    return concat(
      this.stateService.getInitialState('', 'settingsConfig').pipe(take(1)),
      /* LOGIN: */
      this.store$.select(UserState.isLoggedIn).pipe(
        pairwise(),
        filter(([wasLoggedIn, isLoggedIn]) => !wasLoggedIn && isLoggedIn),
        switchMap(() =>
          this.stateService.getInitialState('', 'settingsConfig').pipe(take(1))
        )
      )
    ).subscribe((settingsConfig) => {
      const settingGroups = {};

      for (const groupSlug in settingsConfig) {
        settingGroups[groupSlug] = initSettingConfigGroup(
          settingsConfig[groupSlug]
        );
        delete settingGroups[groupSlug][groupSlug];
      }

      dispatch(new InitShopSettingsConfigAction(settingGroups));
    });
  }

  @Action(InitShopSettingsConfigAction)
  initializeShopOrders(
    { setState }: StateContext<ShopSettingsConfigModel>,
    action: InitShopSettingsConfigAction
  ) {
    setState(action.payload);
  }

  @Action(ResetShopSettingsConfigAction)
  resetProducts({ setState }: StateContext<ShopSettingsConfigModel>) {
    setState(defaultState);
  }
}
