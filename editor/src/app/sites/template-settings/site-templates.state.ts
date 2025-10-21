import { concat } from 'rxjs';
import { take, switchMap, pairwise, filter } from 'rxjs/operators';
import {
  Store,
  State,
  StateContext,
  Selector,
  NgxsOnInit,
  Action,
  Actions,
  ofActionSuccessful,
} from '@ngxs/store';
import {
  SiteTemplatesStateModel,
  TemplateSiteModel,
  SiteTemplatesResponseModel,
  TemplateModelResponse,
} from './site-templates.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { SiteSettingsState } from '../settings/site-settings.state';
import { initSettingConfigGroup } from '../../shared/helpers';
import {
  ResetSiteTemplatesAction,
  InitSiteTemplatesAction,
} from './site-templates.actions';
import { UserLoginAction } from '../../user/user.actions';
import { Injectable } from '@angular/core';

@State<SiteTemplatesStateModel>({
  name: 'siteTemplates',
  defaults: {},
})
@Injectable()
export class SiteTemplatesState implements NgxsOnInit {
  @Selector([SiteTemplatesState, SiteSettingsState.getCurrentSiteTemplate])
  static getCurrentTemplate(
    state: SiteTemplatesStateModel,
    templateSlug: string,
  ) {
    if (!templateSlug) {
      return;
    }
    return state[templateSlug];
  }

  @Selector([SiteTemplatesState.getCurrentTemplate])
  static getCurrentTemplateConfig(currentTemplate: TemplateSiteModel) {
    if (!currentTemplate) {
      return;
    }

    return currentTemplate.templateConf;
  }

  @Selector([SiteTemplatesState.getCurrentTemplate])
  static getCurrentTemplateSectionTypes(currentTemplate: TemplateSiteModel) {
    if (!currentTemplate) {
      return;
    }

    return currentTemplate.sectionTypes;
  }

  @Selector([SiteTemplatesState.getCurrentTemplate])
  static getCurrentTemplateSectionTranslations(
    currentTemplate: TemplateSiteModel,
  ) {
    if (!currentTemplate) {
      return;
    }

    return currentTemplate.translations;
  }

  constructor(
    private store: Store,
    private actions$: Actions,
    private appStateService: AppStateService,
  ) {}

  ngxsOnInit({ dispatch }: StateContext<SiteTemplatesStateModel>) {
    concat(
      this.appStateService.getInitialState('', 'siteTemplates').pipe(take(1)),
      this.actions$.pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() => {
          return this.appStateService
            .getInitialState('', 'siteTemplates')
            .pipe(take(1));
        }),
      ),
    ).subscribe({
      next: (siteTemplateResponse: SiteTemplatesResponseModel) => {
        dispatch(new InitSiteTemplatesAction(siteTemplateResponse));
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
            .getLocaleSettings(language, 'siteTemplates')
            .pipe(take(1)),
        ),
      )
      .subscribe((siteTemplateResponse: SiteTemplatesResponseModel) => {
        dispatch(new InitSiteTemplatesAction(siteTemplateResponse));
      });
  }

  @Action(ResetSiteTemplatesAction)
  resetSiteTemplates({ setState }: StateContext<SiteTemplatesStateModel>) {
    setState({});
  }

  @Action(InitSiteTemplatesAction)
  initSiteTemplates(
    { setState }: StateContext<SiteTemplatesStateModel>,
    action: InitSiteTemplatesAction,
  ) {
    /** Initialize state: */
    const siteTemplateState: SiteTemplatesStateModel = {};

    for (const templateSlug in action.payload) {
      const templateSettingGroups: TemplateModelResponse =
        action.payload[templateSlug].templateConf;
      siteTemplateState[templateSlug] = {
        templateConf: {},
        sectionTypes: {},
        translations: action.payload[templateSlug].translations,
      };

      for (const groupSlug in templateSettingGroups) {
        siteTemplateState[templateSlug].templateConf[groupSlug] =
          initSettingConfigGroup(templateSettingGroups[groupSlug]);
      }

      for (const sectionTypeSlug in action.payload[templateSlug].sectionTypes) {
        const sectionTypeConfig =
          action.payload[templateSlug].sectionTypes[sectionTypeSlug];

        if ('params' in sectionTypeConfig) {
          siteTemplateState[templateSlug].sectionTypes[sectionTypeSlug] = {
            ...sectionTypeConfig,
            params: initSettingConfigGroup(sectionTypeConfig.params),
          };
        } else {
          siteTemplateState[templateSlug].sectionTypes[sectionTypeSlug] =
            sectionTypeConfig;
        }
      }
    }

    setState(siteTemplateState);
  }
}
