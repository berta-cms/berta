import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SiteSectionStateModel } from '../sections/sections-state/site-sections-state.model';
import { AppState } from '../../app-state/app.state';
import { SiteSectionsState } from '../sections/sections-state/site-sections.state';
import { SectionTagsInterface } from '../sections/tags/section-tags-state.model';
import { AppStateModel } from 'src/app/app-state/app-state.interface';
import { SectionTagsState } from '../sections/tags/section-tags.state';

@Component({
  selector: 'berta-site-media',
  template: `
    <aside>
      <div class="setting-group" *ngFor="let section of sectionsList">
        <h3>
          <a
            [routerLink]="['/media']"
            [queryParams]="{
              site:
                (currentSite$ | async).site === ''
                  ? null
                  : (currentSite$ | async).site,
              section: section.section.name
            }"
            [class.active]="section.section.name === activeNav.section"
            >{{ section.section.title || '...' }}
          </a>
          <div *ngFor="let tag of section.tags">
            <a
              [routerLink]="['/media']"
              [queryParams]="{
                site:
                  (currentSite$ | async).site === ''
                    ? null
                    : (currentSite$ | async).site,
                section: section.section.name,
                tag: tag['@attributes'].name
              }"
              [class.active]="
                section.section.name === activeNav.section &&
                tag['@attributes'].name === activeNav.tag
              "
              >{{ tag['@value'] }}
            </a>
          </div>
        </h3>
      </div>
    </aside>
  `,
})
export class SiteMediaComponent implements OnInit {
  @Select('app') public currentSite$: Observable<AppStateModel>;
  sectionsList: {
    section: SiteSectionStateModel;
    tags: SectionTagsInterface[];
  }[];

  activeNav: {
    site: string;
    section: string | null;
    tag: string | null;
  };

  constructor(private store: Store) {}

  ngOnInit() {
    combineLatest([
      this.store.select(SiteSectionsState.getCurrentSiteSections),
      this.store.select(SectionTagsState.getCurrentSiteTags),
      this.store.select(AppState.getActiveNav),
    ])
      .pipe(
        map(([sections, tags, activeNav]) => {
          return {
            sections: sections
              .filter(
                (section) =>
                  !(
                    section['@attributes'] &&
                    section['@attributes'].type &&
                    ['external_link', 'shopping_cart'].indexOf(
                      section['@attributes'].type
                    ) > -1
                  )
              )
              .map((section) => {
                const sectionTags = tags.find(
                  (tag) => tag['@attributes'].name === section.name
                );

                return { section, tags: sectionTags ? sectionTags.tag : [] };
              }),
            activeNav,
          };
        })
      )
      .subscribe((data) => {
        this.sectionsList = [...data.sections];

        this.activeNav = {
          site: data.activeNav.site,
          section:
            data.activeNav.section ||
            (this.sectionsList[0] && this.sectionsList[0].section.name),
          tag: data.activeNav.tag,
        };
      });
  }
}
