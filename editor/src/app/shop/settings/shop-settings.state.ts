import { State, StateContext, NgxsOnInit, Selector, Action, Store } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import { AppStateModel } from '../../app-state/app-state.interface';
import { SettingModel } from '../../shared/interfaces';
import { UpdateShopSettingsAction } from './shop-settings.actions';


interface ShopSettingsModel {
  [site: string]: Array<{
    slug: string;
    settings: SettingModel[];
  }>;
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
    private store: Store,
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

  @Action(UpdateShopSettingsAction)
  updateShopSettings({getState, patchState}: StateContext<ShopSettingsModel>, action: UpdateShopSettingsAction) {
    const state = getState();
    const site = this.store.selectSnapshot(AppState.getSite);

    return patchState({
      [site]: state[site].map(settingGroup => {
        if (settingGroup.slug !== action.groupSlug) {
          return settingGroup;
        }
        return {...settingGroup, settings: settingGroup.settings.map(setting => {
          if (setting.slug !== action.payload.field) {
            return setting;
          }
          return {...setting, value: action.payload.value};
        })};
      })
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
