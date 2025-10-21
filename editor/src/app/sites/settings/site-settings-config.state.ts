import {
  Store,
  State,
  StateContext,
  NgxsOnInit,
  Action,
  Actions,
  ofActionSuccessful,
} from '@ngxs/store';
import { concat } from 'rxjs';
import { take, switchMap, filter, pairwise } from 'rxjs/operators';
import {
  SiteSettingsConfigStateModel,
  SiteSettingsConfigResponse,
} from './site-settings-config.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { initSettingConfigGroup } from '../../shared/helpers';
import { SiteSettingsState } from './site-settings.state';
import {
  ResetSiteSettingsConfigAction,
  InitSiteSettingsConfigAction,
} from './site-settings-config.actions';
import { UserLoginAction } from '../../user/user.actions';
import { Injectable } from '@angular/core';

@State<SiteSettingsConfigStateModel>({
  name: 'siteSettingsConfig',
  defaults: {},
})
@Injectable()
export class SiteSettingsConfigState implements NgxsOnInit {
  constructor(
    private store: Store,
    private actions$: Actions,
    private appStateService: AppStateService,
  ) {}

  ngxsOnInit({ dispatch }: StateContext<SiteSettingsConfigStateModel>) {
    concat(
      this.appStateService
        .getInitialState('', 'siteSettingsConfig')
        .pipe(take(1)),
      this.actions$.pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() => {
          return this.appStateService
            .getInitialState('', 'siteSettingsConfig')
            .pipe(take(1));
        }),
      ),
    ).subscribe({
      next: (siteSettingsConfig: SiteSettingsConfigResponse) => {
        dispatch(new InitSiteSettingsConfigAction(siteSettingsConfig));
      },
      error: (error) => console.error(error),
    });

    // Listen for language change
    this.store
      .select(SiteSettingsState.getCurrentSiteLanguage)
      .pipe(
        pairwise(),
        filter(([prevLang, lang]) => !!prevLang && !!lang && prevLang !== lang),
        switchMap(([, language]) =>
          this.appStateService
            .getLocaleSettings(language, 'siteSettingsConfig')
            .pipe(take(1)),
        ),
      )
      .subscribe((siteSettingsConfig: SiteSettingsConfigResponse) => {
        dispatch(new InitSiteSettingsConfigAction(siteSettingsConfig));
      });
  }

  @Action(ResetSiteSettingsConfigAction)
  resetSiteSettingsConfig({
    setState,
  }: StateContext<SiteSettingsConfigStateModel>) {
    setState({});
  }

  @Action(InitSiteSettingsConfigAction)
  initSiteSettingsConfig(
    { setState }: StateContext<SiteSettingsConfigStateModel>,
    action: InitSiteSettingsConfigAction,
  ) {
    const settingGroups = {};

    for (const groupSlug in action.payload) {
      settingGroups[groupSlug] = initSettingConfigGroup(
        action.payload[groupSlug],
      );
    }

    setState(settingGroups);
  }
}
