import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { AppState } from '../../app-state/app.state';
import { SiteTemplatesState } from '../template-settings/site-templates.state';
import { SiteSectionsState } from './sections-state/site-sections.state';
import { camel2Words } from '../../shared/helpers';
import { SiteTemplateSettingsState } from '../template-settings/site-template-settings.state';
import { UpdateInputFocus } from '../../app-state/app.actions';
import { UpdateSiteSectionAction, CreateSectionAction, RenameSiteSectionAction } from './sections-state/site-sections.actions';
import { SettingConfigModel, SettingModel } from '../../shared/interfaces';

@Component({
  selector: 'berta-site-sections',
  template: `
    <berta-section *ngFor="let sd of sectionsData$ | async"
                   [section]="sd.section"
                   [isExpanded]="sd.section.name === currentSection"
                   [params]="sd.params"
                   [templateSectionTypes]="sectionTypes$ | async"
                   (inputFocus)="updateComponentFocus($event)"
                   (update)="updateSection(sd, $event)"></berta-section>
    <button type="button" class="button" (click)="createSection()">Create new section</button>
  `
})
export class SiteSectionsComponent implements OnInit {
  sectionsData$: Observable<{section: SiteSectionStateModel, params: {
    setting: SettingModel,
    config: SettingConfigModel,
  }[]}[]>;
  sectionTypes$: Observable<{value: string, title: string}[]>;
  currentSection: string;

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.sectionTypes$ = this.store.select(SiteTemplatesState.getCurrentTemplateSectionTypes).pipe(
      map(sectionTypes => {
        return Object.keys(sectionTypes || {}).map(sectionType => {
          return { value: sectionType, title: sectionTypes[sectionType].title };
        });
      }),
      shareReplay(1)  // Reuse the same observable for all sections
    );

    this.sectionsData$ = combineLatest(
      this.store.select(SiteSectionsState.getCurrentSiteSections),
      this.store.select(SiteTemplatesState.getCurrentTemplateSectionTypes),
      this.store.select(SiteTemplateSettingsState.getIsResponsive)
    ).pipe(
        filter(([sections, sectionTypes]) => !!sections && !!sectionTypes),
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

                })
              };
            }

            return {section, params: []};
          });
        })
    );

    this.route.paramMap.subscribe(params => {
      this.currentSection = params['params']['section'];
    });
  }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  createSection() {
    this.store.dispatch(CreateSectionAction)
    .subscribe({
      next: (state) => {
        const currentSite = this.store.selectSnapshot(AppState.getSite);
        const createdSection = state.siteSections
          .filter(section => section.site_name === currentSite)
          .reduce((prev, current) => {
            return (prev.order > current.order) ? prev : current;
          });
        this.router.navigate(['/sections', createdSection.name], { queryParamsHandling: 'preserve' });
      },
      error: (error) => console.error(error)
    });
  }

  updateSection(sectionData, updateEvent) {
    const field = Object.keys(updateEvent.data)[0];

    if (field === 'title') {
      this.store.dispatch(new RenameSiteSectionAction(sectionData.section, parseInt(updateEvent.section, 10), updateEvent.data))
        .subscribe({
          next: (state) => {
            const currentSite = this.store.selectSnapshot(AppState.getSite);
            const updatedSection = state.siteSections.find(section => {
              return section.site_name === currentSite && section.order === sectionData.section.order;
            });

            if (this.currentSection === sectionData.section.name) {
              this.router.navigate(['/sections', updatedSection.name], {replaceUrl: true, queryParamsHandling: 'preserve'});
            }
          },
          error: (error) => console.error(error)
        });
    } else {
      this.store.dispatch(new UpdateSiteSectionAction(sectionData.section, parseInt(updateEvent.section, 10), updateEvent.data));
    }
  }
}
