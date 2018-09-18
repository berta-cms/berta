import { State, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import { AppStateModel } from '../../app-state/app-state.interface';

interface ShopSettingsModel {
  [site: string]: {
    group_config: {[k: string]: string};
    [k: string]: any;
  };
}

const defaultState: ShopSettingsModel = {};


@State<ShopSettingsModel>({
  name: 'shopSettings',
  defaults: defaultState
})
export class ShopSettingsState implements NgxsOnInit {

  @Selector([AppState.getSite])
  static getCurrentSiteSettings(state: ShopSettingsModel, site: string) {
    return state[site];
  }

  @Selector([ShopSettingsState.getCurrentSiteSettings])
  static getCurrentWeightUnit(_, currentSiteSettings) {
    return currentSiteSettings
      .find(group => {
        return group.slug === 'group_config';
      }).settings
      .find(setting => setting.slug === 'weightUnit').value || '';
  }

  @Selector([ShopSettingsState.getCurrentSiteSettings])
  static getCurrentCurrency(_, currentSiteSettings) {
    return currentSiteSettings
      .find(group => {
        return group.slug === 'group_config';
      }).settings
      .find(setting => setting.slug === 'currency').value || '';
  }

  constructor(
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ setState }: StateContext<ShopSettingsModel>) {
    return this.stateService.getInitialState('', 'settings').pipe(
      take(1)
    ).subscribe((settings) => {
      const newState: {[k: string]: any} = {};

      for (const siteSlug in settings) {
        newState[siteSlug] = this.initializeShopSettingsForSite(settings[siteSlug]);
      }
      setState(newState);
    });
  }

  private initializeShopSettingsForSite(settings: any): any[] {
    return Object.keys(settings).map(settingGroupSlug => {
      return {
        slug: settingGroupSlug,
        settings: Object.keys(settings[settingGroupSlug]).map(settingSlug => {
          return {
            slug: settingSlug,
            value: settings[settingGroupSlug][settingSlug]
          };
        })
      };
    });
  }
}
