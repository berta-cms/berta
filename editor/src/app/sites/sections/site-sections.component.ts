import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SiteTemplatesState } from '../template-settings/templates.state';
import { filter, map } from 'rxjs/operators';
import { SiteSectionsState } from './sections-state/site-sections.state';
import { isPlainObject, camel2Words } from '../../shared/helpers';
import { SiteTemplateSettingsState } from '../template-settings/site-template-settings.state';

@Component({
  selector: 'berta-site-sections',
  template: `
    <h2>Site Sections</h2>
    <div class="sections">
      <berta-section *ngFor="let sd of sectionsData$ | async"
                     [section]="sd.section"
                     [params]="sd.params"
                     [templateSectionTypes]="sd.templateSectionTypes"></berta-section>
    </div>
  `,
  styles: [`
    berta-section {
      margin-top: 1.5rem;
      padding-bottom: .5rem;
      border-bottom: 1px solid gray;
    }
  `]
})
export class SiteSectionsComponent implements OnInit {
  sectionsData$: Observable<{section: SiteSectionStateModel, params: any[], types: any[]}[]>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.sectionsData$ = combineLatest(
      this.store.select(SiteSectionsState),
      this.store.select(SiteTemplatesState.getCurrentTemplateSectionTypes),
      this.store.select(SiteTemplateSettingsState.getIsResponsive)).pipe(
        filter(([sections]) => !!sections),
        map(([sections, sectionTypes, isResponsive]) => {
          return [sections, sectionTypes, isResponsive, Object.keys(sectionTypes || {}).map(sectionType => {
            return { slug: sectionType, title: sectionTypes[sectionType].title };
          })];
        }),
        map(([sections, sectionTypes, isResponsive, sectionTypesArray]) => {
          return sections.map(section => {
            if (section['@attributes'] && sectionTypes[section['@attributes'].type]) {
              const params = (sectionTypes[section['@attributes'].type] &&
                              sectionTypes[section['@attributes'].type].params) || {};

              return {section, params: Object.keys(params)
                .filter(param => {
                  // Filter out params according to other settings
                  if (!isResponsive &&
                      ['default', 'shop'].indexOf(section['@attributes'].type) > -1 &&
                      ['columns', 'entryMaxWidth', 'entryPadding'].indexOf(param) > -1) {
                    return false;
                  }
                  return true;
                })
                .map(param => {
                return {
                  setting: {
                    slug: param,
                    value: !section[param] && section[param] !== 0 ? '' : section[param]
                  },
                  config: params[param]
                };
              })
              .map(param => {
                // initialize select inputs
                if (param.config.format === 'select' || param.config.format === 'fontselect') {
                  let values = param.config.values;

                  if (isPlainObject(values)) {
                    values = Object.keys(values).map((value => {
                      return {value: value, title: values[value]};
                    }));

                  } else if (!(values instanceof Array)) {
                    values = [{value: String(param.config.values), title: param.config.values}];

                  } else {
                    values = values.map(value => {
                      return {value: value, title: camel2Words(value)};
                    });
                  }
                  param.config = {...param.config, values: values};
                }
                return param;
              })
              .map(param => {
                // generate titles
                if (!param.config.title && param.config.html_before) {
                  const wrapper = document.createElement('div');
                  wrapper.innerHTML = param.config.html_before;
                  return {...param, config: {...param.config, title: wrapper.innerText}};
                } else if (!param.config.title) {
                  return {...param, config: {...param.config, title: camel2Words(param.setting.slug)}};
                }
                return param;
              })
              .map(param => {
                // Assign default values:
                if (param.setting.value || param.setting.value === 0) {
                  return param;
                }

                return {...param, setting: {
                  ...param.setting,
                  value: (param.config.default || param.config.default === 0) ? param.config.default : ''
                }};

              }), templateSectionTypes: sectionTypesArray};
            }

            return {section, params: [], templateSectionTypes: sectionTypesArray};
          });
        })
    );
  }

}
