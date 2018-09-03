import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SiteTemplatesStateModel, TemplateModel } from './site-template-settings.interface';
import { SiteSettingsState } from '../settings/site-settings.state';
import { SiteSettingsModel } from '../settings/site-settings.interface';


@State<SiteTemplatesStateModel>({
  name: 'siteTemplates',
  defaults: {}
})
export class SiteTemplatesState implements NgxsOnInit {

  @Selector([SiteSettingsState.getCurrentSiteTemplate])
  static getCurrentTemplate(state: SiteTemplatesStateModel, templateSlug: string) {
    if (!templateSlug) {
      return;
    }
    return state[templateSlug];
  }

  @Selector([SiteTemplatesState.getCurrentTemplate])
  static getCurrentTemplateConfig(_: SiteTemplatesStateModel, currentTemplate: TemplateModel) {
    if (!currentTemplate) {
      return;
    }

    return currentTemplate.templateConf;
  }

  @Selector([SiteTemplatesState.getCurrentTemplate])
  static getCurrentTemplateSectionTypes(_: SiteTemplatesStateModel, currentTemplate: TemplateModel) {
    if (!currentTemplate) {
      return;
    }

    return currentTemplate.sectionTypes;
  }

  constructor(
    private appStateService: AppStateService) {
  }

  ngxsOnInit({ setState }: StateContext<SiteTemplatesStateModel>) {
    this.appStateService.getInitialState('', 'siteTemplates').pipe(
      take(1)
    ).subscribe({
      next: (siteSettingsConfig) => {
        setState(siteSettingsConfig);
      },
      error: (error) => console.error(error)
    });
  }

  // @Action(AppShowOverlay)
  // showOverlay({ patchState }: StateContext<SiteTemplatesStateModel>) {
  //   patchState({ showOverlay: true });
  // }

  // @Action(AppHideOverlay)
  // hideOverlay({ patchState }: StateContext<SiteTemplatesStateModel>) {
  //   patchState({ showOverlay: false });
  // }

  // @Action(AppLogin)
  // login({ patchState }: StateContext<SiteTemplatesStateModel>, action: AppLogin) {
  //   patchState({authToken: action.token});
  // }
}
