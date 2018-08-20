import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SiteTemplatesState } from '../template-settings/templates.state';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';
import { SiteSectionsState } from './sections-state/site-sections.state';
import { isPlainObject, camel2Words } from '../../shared/helpers';
import { SiteTemplateSettingsState } from '../template-settings/site-template-settings.state';
import { UpdateSiteSectionAction, CreateSectionAction, RenameSiteSectionAction } from './sections-state/site-sections.actions';

@Component({
  selector: 'berta-site-sections',
  template: `
    <h2>Site Sections</h2>
    <div class="sections">
      <berta-section *ngFor="let sd of sectionsData$ | async"
                     [section]="sd.section"
                     [params]="sd.params"
                     [templateSectionTypes]="sectionTypes$ | async"
                     (update)="updateSection(sd, $event)"
                     ></berta-section>
      <button type="button" (click)="createSection()">Create New Section</button>
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
  sectionTypes$: Observable<{slug: string, title: string}[]>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.sectionTypes$ = this.store.select(SiteTemplatesState.getCurrentTemplateSectionTypes).pipe(
      map(sectionTypes => {
        return Object.keys(sectionTypes || {}).map(sectionType => {
          return { slug: sectionType, title: sectionTypes[sectionType].title };
        });
      })
    );

    this.sectionsData$ = combineLatest(
      this.store.select(SiteSectionsState.getCurrentSiteSections),
      this.store.select(SiteTemplatesState.getCurrentTemplateSectionTypes),
      this.store.select(SiteTemplateSettingsState.getIsResponsive).pipe(distinctUntilChanged())
    ).pipe(
        filter(([sections]) => !!sections),
        map(([sections, sectionTypes, isResponsive]) => {
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
                  let values: {value: string|number, title: string}[];

                  if (isPlainObject(param.config.values)) {
                    values = Object.keys(param.config.values).map((value => {
                      return {value: value, title: param.config.values[value]};
                    }));

                  } else if (param.config.values instanceof Array) {
                    values = (param.config.values as Array<string|number>).map((value) => {
                      return {
                        value: value,
                        title: camel2Words(String(value))
                      };
                    });

                  } else {
                    values = [{value: String(param.config.values), title: String(param.config.values)}];
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

              })};
            }

            return {section, params: []};
          });
        })
    );
  }

  createSection() {
    this.store.dispatch(CreateSectionAction);
  }

  updateSection(sectionData, updateEvent) {
    const field = Object.keys(updateEvent.data)[0];

    if (field === 'title') {
      this.store.dispatch(new RenameSiteSectionAction(sectionData.section, parseInt(updateEvent.section, 10), updateEvent.data));
    } else {
      this.store.dispatch(new UpdateSiteSectionAction(sectionData.section, parseInt(updateEvent.section, 10), updateEvent.data));
    }
  }
}
