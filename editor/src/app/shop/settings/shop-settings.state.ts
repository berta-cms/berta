import { HttpErrorResponse } from '@angular/common/http';
import { concat, of } from 'rxjs';
import {
  take,
  tap,
  catchError,
  pairwise,
  filter,
  switchMap,
  map,
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
  AddShopSettingsSiteAction,
  ResetShopSettingsAction,
  InitShopSettingsAction,
} from './shop-settings.actions';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopState } from '../shop.state';
import { UserState } from '../../user/user.state';

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
export class ShopSettingsState implements NgxsOnInit {
  @Selector([AppState.getSite])
  static getCurrentSiteSettings(state: ShopSettingsModel, site: string) {
    return state[site];
  }

  @Selector([ShopSettingsState.getCurrentSiteSettings])
  static getCurrentWeightUnit(_, currentSiteSettings) {
    return (
      currentSiteSettings
        .find((group) => {
          return group.slug === 'group_config';
        })
        .settings.find((setting) => setting.slug === 'weightUnit').value || ''
    );
  }

  @Selector([ShopSettingsState.getCurrentSiteSettings])
  static getCurrentCurrency(_, currentSiteSettings) {
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
    return concat(
      this.stateService.getInitialState('', 'settings').pipe(take(1)),
      /* LOGIN: */
      this.store$.select(UserState.isLoggedIn).pipe(
        pairwise(),
        filter(([wasLoggedIn, isLoggedIn]) => !wasLoggedIn && isLoggedIn),
        switchMap(() =>
          this.stateService.getInitialState('', 'settings').pipe(take(1))
        )
      )
    ).subscribe((settings) => {
      const newState: { [k: string]: any } = {};

      for (const siteSlug in settings) {
        newState[siteSlug] = this.initializeShopSettingsForSite(
          settings[siteSlug]
        );
      }

      dispatch(new InitShopSettingsAction(newState));
    });
  }

  @Action(InitShopSettingsAction)
  initializeShopOrders(
    { setState }: StateContext<ShopSettingsModel>,
    action: InitShopSettingsAction
  ) {
    setState(action.payload);
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

  @Action(AddShopSettingsSiteAction)
  addShopSettingsSite(
    { patchState }: StateContext<ShopSettingsModel>,
    action: AddShopSettingsSiteAction
  ) {
    return this.stateService
      .getInitialState(action.payload, 'settings')
      .pipe(take(1))
      .subscribe((settings) => {
        patchState({
          [action.payload]: this.initializeShopSettingsForSite(
            settings[action.payload]
          ),
        });
      });
  }

  @Action(ResetShopSettingsAction)
  resetProducts({ setState }: StateContext<ShopSettingsModel>) {
    setState(defaultState);
  }
}
