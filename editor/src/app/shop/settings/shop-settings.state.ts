import { HttpErrorResponse } from '@angular/common/http';
import {
  take,
  tap,
  catchError,
  filter,
  switchMap,
  map,
  distinct,
} from 'rxjs/operators';
import {
  State,
  StateContext,
  NgxsOnInit,
  Selector,
  Action,
  Store,
} from '@ngxs/store';

import { FileUploadService } from '../../sites/shared/file-upload.service';
import { ShopStateService } from '../shop-state.service';
import { AppState } from '../../app-state/app.state';
import { SettingModel } from '../../shared/interfaces';
import {
  UpdateShopSettingsAction,
  DeleteShopSettingsSiteAction,
  RenameShopSettingsSiteAction,
  ResetShopSettingsAction,
  InitShopSettingsAction,
} from './shop-settings.actions';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopState } from '../shop.state';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { UserState } from 'src/app/user/user.state';

interface ShopSettingsModel {
  [site: string]: Array<{
    slug: string;
    settings: SettingModel[];
  }>;
}

const defaultState: ShopSettingsModel = {};

@State<ShopSettingsModel>({
  name: 'shopSettings',
  defaults: defaultState,
})
@Injectable()
export class ShopSettingsState implements NgxsOnInit {
  @Selector([ShopSettingsState, AppState.getSite])
  static getCurrentSiteSettings(state: ShopSettingsModel, site: string) {
    return state[site];
  }

  @Selector([ShopSettingsState.getCurrentSiteSettings])
  static getCurrentWeightUnit(currentSiteSettings) {
    if (!currentSiteSettings) {
      return;
    }
    return (
      currentSiteSettings
        .find((group) => {
          return group.slug === 'group_config';
        })
        .settings.find((setting) => setting.slug === 'weightUnit').value || ''
    );
  }

  @Selector([ShopSettingsState.getCurrentSiteSettings])
  static getCurrentCurrency(currentSiteSettings) {
    if (!currentSiteSettings) {
      return;
    }
    return (
      currentSiteSettings
        .find((group) => {
          return group.slug === 'group_config';
        })
        .settings.find((setting) => setting.slug === 'currency').value || ''
    );
  }

  constructor(
    private store$: Store,
    private appStateService: AppStateService,
    private stateService: ShopStateService,
    private fileUploadService: FileUploadService
  ) {}

  ngxsOnInit({ dispatch }: StateContext<ShopSettingsModel>) {
    combineLatest([
      this.store$.select(AppState.getSite),
      this.store$.select(UserState.hasFeatureShop),
    ])
      .pipe(
        filter(([site, hasFeatureShop]) => site !== null && hasFeatureShop),
        map(([site]) => site),
        distinct((site) => site),
        switchMap((site) =>
          this.stateService.getInitialState(site, 'settings').pipe(
            take(1),
            map((settings) => ({ site, settings }))
          )
        )
      )
      .subscribe(({ site, settings }) => {
        const newState: { [k: string]: any } = {};
        newState[site] = this.initializeShopSettingsForSite(settings[site]);
        dispatch(new InitShopSettingsAction(newState));
      });
  }

  @Action(InitShopSettingsAction)
  initShopSettings(
    { patchState }: StateContext<ShopSettingsModel>,
    action: InitShopSettingsAction
  ) {
    patchState(action.payload);
  }

  @Action(UpdateShopSettingsAction)
  updateShopSettings(
    { getState, patchState }: StateContext<ShopSettingsModel>,
    action: UpdateShopSettingsAction
  ) {
    const state = getState();
    const site = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);
    const data = {
      path: `${site}/${action.groupSlug}/${action.payload.field}`,
      value: action.payload.value,
    };

    return (
      data.value instanceof File
        ? this.fileUploadService.upload(syncURLs.settingsUpload, data)
        : this.appStateService.sync(syncURLs.settings, data)
    ).pipe(
      tap((response) => {
        patchState({
          [site]: state[site].map((settingGroup) => {
            if (settingGroup.slug !== action.groupSlug) {
              return settingGroup;
            }
            return {
              ...settingGroup,
              settings: settingGroup.settings.map((setting) => {
                if (setting.slug !== action.payload.field) {
                  return setting;
                }
                return { ...setting, value: response.data.value };
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
      })
    );
  }

  private initializeShopSettingsForSite(settings: any): any[] {
    return Object.keys(settings).map((settingGroupSlug) => {
      return {
        slug: settingGroupSlug,
        settings: Object.keys(settings[settingGroupSlug]).map((settingSlug) => {
          return {
            slug: settingSlug,
            value: settings[settingGroupSlug][settingSlug],
          };
        }),
      };
    });
  }

  @Action(RenameShopSettingsSiteAction)
  renameShopSettingsSite(
    { setState, getState }: StateContext<ShopSettingsModel>,
    action: RenameShopSettingsSiteAction
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

  @Action(DeleteShopSettingsSiteAction)
  deleteShopSettingsSite(
    { setState, getState }: StateContext<ShopSettingsModel>,
    action: DeleteShopSettingsSiteAction
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

  @Action(ResetShopSettingsAction)
  resetProducts({ setState }: StateContext<ShopSettingsModel>) {
    setState(defaultState);
  }
}
