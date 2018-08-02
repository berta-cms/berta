import { State, Action, StateContext, Selector, NgxsOnInit, Store } from '@ngxs/store';
import { SitesSettingsStateModel } from './site-settings.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { AppStateModel } from '../../app-state/app-state.interface';
import { AppState } from '../../app-state/app.state';
import { UpdateSiteSettingsAction } from './site-settings.actions';


@State<SitesSettingsStateModel>({
  name: 'siteSettings',
  defaults: {}
})
export class SiteSettingsState implements NgxsOnInit {

  @Selector([AppState])
  static getCurrentSiteSettings(siteSettings: SitesSettingsStateModel, appState: AppStateModel) {
    if (!(siteSettings && appState && siteSettings[appState.site])) {
      return;
    }

    return siteSettings[appState.site];
  }

  @Selector([SiteSettingsState.getCurrentSiteSettings])
  static getCurrentSiteTemplate(_, currentSiteSettings) {
    if (!(currentSiteSettings && currentSiteSettings.template)) {
      return;
    }
    return currentSiteSettings.template.template;
  }

  constructor(
    private store: Store,
    private appStateService: AppStateService) {
  }

  ngxsOnInit({ setState }: StateContext<SitesSettingsStateModel>) {
    this.appStateService.getInitialState('', 'site_settings').pipe(take(1)).subscribe({
      next: (response) => {
        setState(response as SitesSettingsStateModel);
      },
      error: (error) => console.error(error)
    });
  }

  @Action(UpdateSiteSettingsAction)
  updateSiteSettings({ patchState, getState }: StateContext<SitesSettingsStateModel>, action: UpdateSiteSettingsAction) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const currentState = getState();
    const updatedSiteSettingsGroup = {...currentState[currentSite][action.settingGroup], ...action.payload};

    patchState({[currentSite]: {
      ...currentState[currentSite],
      [action.settingGroup]: updatedSiteSettingsGroup
    }});
  }
}
