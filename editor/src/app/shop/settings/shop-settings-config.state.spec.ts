import { TestBed } from '@angular/core/testing';
import { StateContext, Store } from '@ngxs/store';
import { BehaviorSubject, of } from 'rxjs';

import {
  ShopSettingsConfigModel,
  ShopSettingsConfigState,
} from './shop-settings-config.state';
import { InitShopSettingsConfigAction } from './shop-settings.actions';
import { AppState } from '../../app-state/app.state';
import { AppStateService } from '../../app-state/app-state.service';
import { SiteSettingsState } from '../../sites/settings/site-settings.state';
import { ShopState } from '../shop.state';
import { ShopStateService } from '../shop-state.service';

describe('ShopSettingsConfigState', () => {
  const settingsConfig = (title: string, emailDescription: string) => ({
    group_config: {
      _: { title },
      email: {
        format: 'text',
        default: '',
        title: 'Email',
        description: emailDescription,
      },
    },
  });

  let language: BehaviorSubject<string>;
  let sync: jasmine.Spy;
  let dispatch: jasmine.Spy;

  beforeEach(() => {
    language = new BehaviorSubject('en');
    sync = jasmine.createSpy('sync').and.returnValue(
      of({
        message: '',
        data: settingsConfig(
          'Konfigurācijas vērtības',
          '<b>Obligāts.</b> Tava e-pasta adrese, uz kuru veikals sūta katru jauno pasūtījumu.',
        ),
      }),
    );
    dispatch = jasmine.createSpy('dispatch');
    const selections = new Map<unknown, unknown>([
      [AppState.getSite, of('')],
      [SiteSettingsState.getCurrentSiteLanguage, language],
      [ShopState.getURLs, of({ settingsConfig: '/settings-config' })],
    ]);
    const store = {
      select: (selector: unknown) => selections.get(selector),
    } as unknown as Store;
    const stateService = {
      getInitialState: () =>
        of(
          settingsConfig(
            'Configuration values',
            '<b>Required.</b> Your email address, where the shop sends each new order.',
          ),
        ),
    } as unknown as ShopStateService;

    const state = TestBed.runInInjectionContext(
      () =>
        new ShopSettingsConfigState(store, stateService, {
          sync,
        } as unknown as AppStateService),
    );
    state.ngxsOnInit({
      dispatch,
    } as unknown as StateContext<ShopSettingsConfigModel>);
  });

  it('loads the settings config again in the language the site switches to', () => {
    language.next('lv');

    expect(sync).toHaveBeenCalledOnceWith(
      '/settings-config',
      { language: 'lv' },
      'GET',
    );
    const action = dispatch.calls.mostRecent().args[0];
    expect(action).toBeInstanceOf(InitShopSettingsConfigAction);
    expect(action.payload.group_config._.title).toBe('Konfigurācijas vērtības');
    expect(action.payload.group_config.email.description).toBe(
      '<b>Obligāts.</b> Tava e-pasta adrese, uz kuru veikals sūta katru jauno pasūtījumu.',
    );
  });

  it('loads nothing again while the language stays the same', () => {
    language.next('en');

    expect(sync).not.toHaveBeenCalled();
    // Only the first load, with the shop state
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
