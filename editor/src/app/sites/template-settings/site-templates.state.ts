import { State, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SiteTemplatesStateModel, TemplateSiteModel, SiteTemplatesResponseModel } from './site-templates.interface';
import { SiteSettingsState } from '../settings/site-settings.state';
import { isPlainObject } from 'lodash';
import { camel2Words } from '../../shared/helpers';


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
          const templateSettingGroups = siteTemplateResponse[templateSlug].templateConf;
          siteTemplateState[templateSlug] = {
            templateConf: {},
            sectionTypes: siteTemplateResponse[templateSlug].sectionTypes
          };

          for (const groupSlug in templateSettingGroups) {
            const settingGroupConfig = templateSettingGroups[groupSlug];
            siteTemplateState[templateSlug].templateConf[groupSlug] = {};

            for (const settingSlug in settingGroupConfig) {
              if (settingSlug === '_') {
                siteTemplateState[templateSlug].templateConf[groupSlug]['_'] = settingGroupConfig[settingSlug];
                continue;
              }

              if (['select', 'fontselect'].indexOf(settingGroupConfig[settingSlug].format) > -1) {
                let values: {value: string|number, title: string}[] = [];

                if (isPlainObject(settingGroupConfig[settingSlug].values)) {
                  values = Object.keys(settingGroupConfig[settingSlug].values).map((value => {
                    return {value: value, title: settingGroupConfig[settingSlug].values[value]};
                  }));

                } else if (settingGroupConfig[settingSlug].values instanceof Array) {
                  values = settingGroupConfig[settingSlug].values.map(value => {
                    return {value: value, title: camel2Words(String(value))};
                  });

                } else {
                  values = [{
                    value: String(settingGroupConfig[settingSlug].values),
                    title: String(settingGroupConfig[settingSlug].values)
                  }];
                }
                siteTemplateState[templateSlug].templateConf[groupSlug][settingSlug] = {
                  ...settingGroupConfig[settingSlug],
                  values: values
                };
                continue;
              }

              siteTemplateState[templateSlug].templateConf[groupSlug][settingSlug] = settingGroupConfig[settingSlug];
            }
          }

        }

        setState(siteTemplateState);
      },
      error: (error) => console.error(error)
    });
  }
}
