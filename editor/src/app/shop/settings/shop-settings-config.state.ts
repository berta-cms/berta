import { take, filter, switchMap, pairwise } from 'rxjs/operators';
import { State, StateContext, NgxsOnInit, Action, Store } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { initSettingConfigGroup } from '../../shared/helpers';
import {
  ResetShopSettingsConfigAction,
  InitShopSettingsConfigAction,
} from './shop-settings.actions';
import { Injectable } from '@angular/core';
import { AppState } from 'src/app/app-state/app.state';
import { AppStateService } from '../../app-state/app-state.service';
import { SiteSettingsState } from '../../sites/settings/site-settings.state';
import { ShopState } from '../shop.state';

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
  constructor(
    private store$: Store,
    private stateService: ShopStateService,
    private appStateService: AppStateService,
  ) {}

  ngxsOnInit({ dispatch }: StateContext<ShopSettingsConfigModel>) {
    this.store$
      .select(AppState.getSite)
      .pipe(
        filter((site) => site !== null),
        take(1),
        switchMap((site) =>
          this.stateService
            .getInitialState(site, 'settingsConfig')
            .pipe(take(1)),
        ),
      )
      .subscribe((settingsConfig) => {
        dispatch(
          new InitShopSettingsConfigAction(this.configGroups(settingsConfig)),
        );
      });

    // Listen for language change
    this.store$
      .select(SiteSettingsState.getCurrentSiteLanguage)
      .pipe(
        pairwise(),
        filter(([prevLang, lang]) => !!prevLang && !!lang && prevLang !== lang),
        switchMap(([, language]) =>
          this.store$.select(ShopState.getURLs).pipe(
            filter((urls) => !!urls?.settingsConfig),
            take(1),
            switchMap((urls) =>
              this.appStateService.sync(
                urls.settingsConfig,
                { language },
                'GET',
              ),
            ),
          ),
        ),
      )
      .subscribe((response) => {
        dispatch(
          new InitShopSettingsConfigAction(this.configGroups(response.data)),
        );
      });
  }

  @Action(InitShopSettingsConfigAction)
  initShopSettingsConfig(
    { setState }: StateContext<ShopSettingsConfigModel>,
    action: InitShopSettingsConfigAction,
  ) {
    setState(action.payload);
  }

  @Action(ResetShopSettingsConfigAction)
  resetShopSettingsConfig({ setState }: StateContext<ShopSettingsConfigModel>) {
    setState(defaultState);
  }

  private configGroups(settingsConfig) {
    const settingGroups = {};

    for (const groupSlug in settingsConfig) {
      settingGroups[groupSlug] = initSettingConfigGroup(
        settingsConfig[groupSlug],
      );
      delete settingGroups[groupSlug][groupSlug];
    }

    return settingGroups;
  }
}
