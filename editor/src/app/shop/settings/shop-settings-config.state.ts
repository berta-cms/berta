import { take } from 'rxjs/operators';
import { State, StateContext, NgxsOnInit, Action } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { initSettingConfigGroup } from '../../shared/helpers';
import { ResetShopSettingsConfigAction } from './shop-settings.actions';

interface ShopSettingsConfigModel {
  [site: string]: any;
}

const defaultState: ShopSettingsConfigModel = {};


@State<ShopSettingsConfigModel>({
  name: 'shopSettingsConfig',
  defaults: defaultState
})
export class ShopSettingsConfigState implements NgxsOnInit {

  constructor(
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ setState }: StateContext<ShopSettingsConfigModel>) {
    return this.stateService.getInitialState('', 'settingsConfig').pipe(
      take(1)
    ).subscribe((settingsConfig) => {
      const settingGroups = {};

      for (const groupSlug in settingsConfig) {
        settingGroups[groupSlug] = initSettingConfigGroup(settingsConfig[groupSlug]);
        delete settingGroups[groupSlug][groupSlug];
      }

      setState(settingGroups);
    });
  }

  @Action(ResetShopSettingsConfigAction)
  resetProducts({ setState }: StateContext<ShopSettingsConfigModel>) {
    setState(defaultState);
  }
}
