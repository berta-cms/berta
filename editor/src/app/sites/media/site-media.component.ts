import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SiteSectionStateModel } from '../sections/sections-state/site-sections-state.model';
import { AppState } from '../../app-state/app.state';
import { SiteSectionsState } from '../sections/sections-state/site-sections.state';
import { SectionTagsInterface } from '../sections/tags/section-tags-state.model';
import { SectionTagsState } from '../sections/tags/section-tags.state';
import { SectionEntriesState } from '../sections/entries/entries-state/section-entries.state';
import { ActivatedRoute } from '@angular/router';
import { SitesState } from '../sites-state/sites.state';
import { SiteStateModel } from '../sites-state/site-state.model';

@Component({
  selector: 'berta-site-media',
  template: `
    <aside *ngIf="currentSite$ | async">
      <div class="setting-group">
        <h3>
          <a
            [routerLink]="['/media']"
            [queryParams]="{
              site:
                (currentSite$ | async).name === ''
                  ? null
                  : (currentSite$ | async).name,
              all: 1
            }"
            [class.active]="showAllSections"
            >All
          </a>
        </h3>
      </div>
      <div class="setting-group" *ngFor="let section of sectionsList">
        <h3>
          <a
            [routerLink]="['/media']"
            [queryParams]="{
              site:
                (currentSite$ | async).name === ''
                  ? null
                  : (currentSite$ | async).name,
              section: section.section.name
            }"
            [class.active]="
              !showAllSections && section.section.name === activeNav.section
            "
            >{{ section.section.title || '...' }}
          </a>
          <div *ngFor="let tag of section.tags">
            <a
              [routerLink]="['/media']"
              [queryParams]="{
                site:
                  (currentSite$ | async).name === ''
                    ? null
                    : (currentSite$ | async).name,
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
    <div class="content">
      <div *ngFor="let selectedSection of selectedSections">
        <h3>{{ selectedSection.section.title || '...' }}</h3>
        <h5 *ngIf="selectedTag">
          {{ selectedTag['@value'] }}
        </h5>
        <berta-entry-gallery
          *ngFor="let entry of selectedSection.entries"
          [currentSite]="currentSite$ | async"
          [entry]="entry"
        ></berta-entry-gallery>
      </div>
    </div>
  `,
})
export class SiteMediaComponent implements OnInit {
  @Select(SitesState.getCurrentSite)
  public currentSite$: Observable<SiteStateModel>;

  sectionsList: {
    section: SiteSectionStateModel;
    tags: SectionTagsInterface[];
  }[];

  activeNav: {
    site: string;
    section: string | null;
    tag: string | null;
  };

  selectedSections: { section: SiteSectionStateModel; tags: any }[];
  selectedTag: string | null;
  showAllSections: boolean;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    combineLatest([
      this.store.select(SiteSectionsState.getCurrentSiteSections),
      this.store.select(SectionTagsState.getCurrentSiteTags),
      this.store.select(AppState.getActiveNav),
      this.store.select(SectionEntriesState.getCurrentSiteEntries),
      this.route.queryParams,
    ])
      .pipe(
        map(([sections, tags, activeNav, entries, queryParams]) => {
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

                return {
                  section,
                  tags: sectionTags
                    ? [...sectionTags.tag].sort((a, b) => a.order - b.order)
                    : [],
                };
              }),
            activeNav,
            entries,
            queryParams,
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

        this.showAllSections = data.queryParams.all === '1';

        this.selectedSections = this.sectionsList
          .filter(
            (s) =>
              this.showAllSections || s.section.name === this.activeNav.section
          )
          .map((section) => {
            return {
              ...section,
              entries: data.entries
                .filter((e) => e.sectionName === section.section.name)
                .filter((e) => {
                  return this.activeNav.tag
                    ? e.tags && e.tags.slugs.indexOf(this.activeNav.tag) > -1
                    : this.showAllSections
                    ? true
                    : !e.tags || e.tags.slugs.length === 0;
                })
                .sort((a, b) => a.order - b.order),
            };
          });

        this.selectedTag =
          this.activeNav.tag && this.activeNav.section
            ? this.selectedSections
                .find((s) => s.section.name === this.activeNav.section)
                .tags.find((t) => t['@attributes'].name === this.activeNav.tag)
            : null;
      });
  }
}
