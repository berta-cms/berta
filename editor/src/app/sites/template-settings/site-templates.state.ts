import { take } from 'rxjs/operators';
import { State, StateContext, Selector, NgxsOnInit, Action } from '@ngxs/store';
import {
  SiteTemplatesStateModel,
  TemplateSiteModel,
  SiteTemplatesResponseModel,
  TemplateModelResponse
} from './site-templates.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { SiteSettingsState } from '../settings/site-settings.state';
import { initSettingConfigGroup } from '../../shared/helpers';
import { ResetSiteTemplatesAction } from './site-templates.actions';


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
  static getCurrentTemplateConfig(_: SiteTemplatesStateModel, currentTemplate: TemplateSiteModel) {
    if (!currentTemplate) {
      return;
    }

    return currentTemplate.templateConf;
  }

  @Selector([SiteTemplatesState.getCurrentTemplate])
  static getCurrentTemplateSectionTypes(_: SiteTemplatesStateModel, currentTemplate: TemplateSiteModel) {
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
      next: (siteTemplateResponse: SiteTemplatesResponseModel) => {

        /** Initialize state: */
        const siteTemplateState: SiteTemplatesStateModel = {};

        for (const templateSlug in siteTemplateResponse) {
          const templateSettingGroups: TemplateModelResponse = siteTemplateResponse[templateSlug].templateConf;
          siteTemplateState[templateSlug] = {
            templateConf: {},
            sectionTypes: {}
          };

          for (const groupSlug in templateSettingGroups) {
            siteTemplateState[templateSlug].templateConf[groupSlug] = initSettingConfigGroup(templateSettingGroups[groupSlug]);
          }

          for (const sectionTypeSlug in siteTemplateResponse[templateSlug].sectionTypes) {
            const sectionTypeConfig = siteTemplateResponse[templateSlug].sectionTypes[sectionTypeSlug];

            if ('params' in sectionTypeConfig) {
              siteTemplateState[templateSlug].sectionTypes[sectionTypeSlug] = {
                ...sectionTypeConfig,
                params: initSettingConfigGroup(sectionTypeConfig.params)
              };
            } else {
              siteTemplateState[templateSlug].sectionTypes[sectionTypeSlug] = sectionTypeConfig;
            }
          }
        }

        setState(siteTemplateState);
      },
      error: (error) => console.error(error)
    });
  }

  @Action(ResetSiteTemplatesAction)
  resetSiteTemplates({ setState }: StateContext<SiteTemplatesStateModel>) {
    setState({});
  }
}
