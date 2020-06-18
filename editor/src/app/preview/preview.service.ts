import { Injectable } from '@angular/core';

import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { Subscription, Observable } from 'rxjs';
import { map, buffer, filter, scan, switchMap } from 'rxjs/operators';

import { AppState } from '../app-state/app.state';
import { AppStateService } from '../app-state/app-state.service';
import { PopupService } from '../popup/popup.service';
import { AppHideLoading } from '../app-state/app.actions';
import {
  UpdateSiteSectionFromSyncAction,
  AddSiteSectionsAction,
  UpdateSiteSectionAction,
  RenameSiteSectionAction,
  DeleteSiteSectionAction,
  DeleteSiteSectionsAction,
  UpdateSiteSectionBackgroundFromSyncAction,
  ReOrderSiteSectionsAction
} from '../sites/sections/sections-state/site-sections.actions';
import {
  UpdateSiteSettingsFromSyncAction,
  UpdateSiteSettingsAction,
  AddSiteSettingChildrenAction,
  UpdateSiteSettingChildreAction,
  DeleteSiteSettingChildrenAction
} from '../sites/settings/site-settings.actions';
import { UpdateSiteTemplateSettingsAction } from '../sites/template-settings/site-template-settings.actions';
import { CreateSiteAction, DeleteSiteAction, UpdateSiteAction, ReOrderSitesAction } from '../sites/sites-state/sites.actions';
import {
  UpdateSectionEntryFromSyncAction,
  OrderSectionEntriesFromSyncAction,
  DeleteSectionEntryFromSyncAction,
  UpdateEntryGalleryFromSyncAction,
  AddSectionEntryFromSyncAction,
  MoveSectionEntryFromSyncAction} from '../sites/sections/entries/entries-state/section-entries.actions';
import { SiteSectionsState } from '../sites/sections/sections-state/site-sections.state';
import { SectionTagsState } from '../sites/sections/tags/section-tags.state';
import { OrderSectionTagsFromSyncAction } from '../sites/sections/tags/section-tags.actions';
import { UpdateShopSettingsAction } from '../shop/settings/shop-settings.actions';


@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  private iframeReloadSubscription: Subscription;
  private templateSettingsRequireReload = {
    pageLayout: [
      'centered',
      'centeredWidth',
      'responsive',
      'mashUpColumns',
      'autoResponsive',
      'centeredContents'
    ],
    pageHeading: [
      'image'
    ],
    css: [
      'customCSS'
    ],
    entryLayout: [
      'galleryPosition'
    ],
    firstPage: [
      'hoverWiggle'
    ],
    sideBar: [
      'image'
    ],
    heading: [
      'image'
    ],
    tagsMenu: [
      'alwaysOpen',
      'hidden'
    ]
  };

  constructor(
    private appService: AppStateService,
    private popupService: PopupService,
    private actions$: Actions,
    private store: Store) {
  }

  sync(url, data, method) {
    const urlParts = this.parseSyncUrl(url);
    const urlIdentifier = urlParts.join('/');

    switch (urlIdentifier) {
      case 'sites/settings':
        /** trigger setting update actions
         * @example:
        SYNC URL: http://local.berta.me/_api/v1/sites/settings
        SYNC DATA: {
          path: "/settings/siteTexts/additionalText",
          value: "<p><strong>FOOTER TEXXXT</strong></p>↵<p></p>"
        }
        SYNC METHOD: PATCH

        To check result:
        - scope to editor iframe in console
        - `window.redux_store.getState().siteSettings.getIn(['','[setting group]', '[setting key]'])`
        */
        return this.store.dispatch(new UpdateSiteSettingsFromSyncAction(
          data.path,
          data.value
        ))
        .pipe(
          map(state => state.siteSettings),
          map(state => {
            const [currentSite, , settingGroupSlug, settingKey] = data.path.split('/');
            const settingGroup = state[currentSite].find((group) => group.slug === settingGroupSlug);
            const setting = settingGroup.settings.find(_setting => _setting.slug === settingKey);

            return {
              path: data.path,
              real: setting.value,
              site: currentSite,
              update: setting.value,
              value: setting.value
            };
          }));

        case 'sites/sections':
          /** trigger section update actions like gallery properties
           * @example:
          SYNC URL: http://local.berta.me/_api/v1/sites/sections
          SYNC DATA: {path: "0/section/0/mediaCacheData/@attributes/autoplay", value: "31"}
          SYNC METHOD: PATCH
          */
          return this.store.dispatch(new UpdateSiteSectionFromSyncAction(
            data.path,
            data.value
          ))
          .pipe(
            map(state => state.siteSections),
            map(state => {
              const [currentSite, , sectionOrder] = data.path.split('/');
              const siteName = currentSite === '0' ? '' : currentSite;
              const section = state.find(_section => _section.site_name === siteName && _section.order === parseInt(sectionOrder, 10));

              return {
                order: section.order,
                path: data.path,
                real: data.value,
                site: siteName,
                update: data.value,
                value: data.value,
                section: section
              };
            }));

        case 'sites/sections/tags':
          return this.store.dispatch(new OrderSectionTagsFromSyncAction(
            data.site,
            data.section,
            data.tag,
            data.value
          )).pipe(
            map(state => state.sectionTags),
            map(state => {
              const order = state[data.site].section
                .find(section => section['@attributes'].name === data.section).tag
                .map(tag => tag)
                .sort((a, b) => a.order - b.order)
                .map(tag => tag['@attributes'].name);

              return {
                site_name: data.site,
                section_name: data.section,
                order: order
              };
            })
          );

        case 'sites/sections/backgrounds':
          /* Background has its own endpoint
            SYNC URL: http://local.berta.me/_api/v1/sites/sections/backgrounds
            preview.service.ts:18 SYNC DATA: {site: "0", section: "maig", file: "chrome_2018-03-21_15-39-07.jpg"}
            preview.service.ts:19 SYNC METHOD: DELETE
          */
          if (method === 'DELETE') {
            return this.appService.sync('siteSectionBackgrounds', {
              site: data.site,
              section: data.section,
              file: data.file
              },
              'DELETE'
            );

          } else {
            return this.store.dispatch(new UpdateSiteSectionBackgroundFromSyncAction(
              data.site,
              data.section,
              data.files
            ))
            .pipe(
              map(state => state.siteSections),
              map(state => {
                const section = state.find(_section => _section.site_name === data.site && _section.name === data.section);

                return {
                  site: data.site,
                  section: data.section,
                  files: section.mediaCacheData.file,
                  mediafolder: section.mediafolder
                };
              }));
          }

        case 'sites/sections/entries':
          /* trigger entry actions */
          if (method === 'POST') {
            return this.store.dispatch(new AddSectionEntryFromSyncAction(
              data.site,
              data.section,
              {
                tag: data.tag,
                before_entry: data.before_entry
              }
            )).pipe(
              map(state => state.sectionEntries),
              map(state => {
                // Newly created entry is with greatest `id`
                const entryid = Math.max.apply(
                  null,
                  state[data.site]
                  .filter(entry => entry.sectionName === data.section)
                  .map(entry => parseInt(entry.id, 10))
                );

                return {'entryid': entryid};
              })
            );

          } else if (method === 'PATCH') {
            return this.store.dispatch(new UpdateSectionEntryFromSyncAction(
              data.path,
              data.value
            ))
            .pipe(
              map(state => state.sectionEntries),
              map(state => {
                const [currentSiteName, , currentSectionName, entryId] = data.path.split('/');
                const siteName = currentSiteName === '0' ? '' : currentSiteName;
                const entry = state[siteName].find(_entry => _entry.id === entryId && _entry.sectionName === currentSectionName);
                const prop = data.path.split('/').slice(4).join('/');
                let ret: any = {
                  entry: entry,
                  path: data.path,
                  real: data.value,
                  update: data.value,
                  value: data.value
                };

                if (prop === 'tags/tag') {
                  const section = this.store.selectSnapshot(SiteSectionsState.getCurrentSiteSections)
                    .find(_section => _section.name === currentSectionName);
                  const sectionTags = this.store.selectSnapshot(SectionTagsState.getCurrentSiteTags)
                    .find(_section => _section['@attributes'].name === currentSectionName);
                  const entryTags = entry.tags ? entry.tags.tag : [];

                  ret = {
                    ...ret,
                    ...{
                      site_name: siteName,
                      section: section,
                      section_name: section.name,
                      section_order: section.order,
                      has_direct_content: section['@attributes'].has_direct_content,
                      tags: sectionTags,
                      real: entryTags.join(', '),
                      update: entryTags.join(' / '),
                      value: entryTags.join(' / ')
                    }
                  };
                }

                return ret;
              }));

          } else if (method === 'PUT') {
            return this.store.dispatch(new OrderSectionEntriesFromSyncAction(
              data.site,
              data.section,
              data.entryId,
              data.value
            )).pipe(
              map(state => state.sectionEntries),
              map(state => {
                const order = state[data.site]
                  .filter(entry => entry.sectionName === data.section)
                  .sort((a, b) => a.order - b.order)
                  .map(entry => entry.id);

                return {
                  site_name: data.site,
                  section_name: data.section,
                  order: order
                };
              }));

          } else if (method === 'DELETE') {
            return Observable.create(observer => {
              this.store.dispatch(new AppHideLoading());
              this.popupService.showPopup({
                type: 'warn',
                content: 'Are you sure you want to delete this entry?',
                showOverlay: true,
                isModal: true,
                actions: [
                  {
                    type: 'primary',
                    label: 'OK',
                    callback: (popupService) => {
                      observer.next();
                      observer.complete();
                      popupService.closePopup();
                    }
                  },
                  {
                    label: 'Cancel',
                    callback: (popupService) => {
                      observer.complete();
                      popupService.closePopup();
                    }
                  }
                ],
              });
            }).pipe(
              switchMap(() => {
                return this.store.dispatch(new DeleteSectionEntryFromSyncAction(
                  data.site,
                  data.section,
                  data.entryId
                ));
              }),
              map(() => {
                const section = this.store.selectSnapshot(SiteSectionsState.getCurrentSiteSections)
                  .find(_section => _section.name === data.section);
                const tags = this.store.selectSnapshot(SectionTagsState.getCurrentSiteTags)
                  .find(_section => _section['@attributes'].name === data.section);

                return {
                  site_name: data.site,
                  section_name: data.section,
                  entry_id: data.entryId,
                  entry_count: section['@attributes'].entry_count,
                  section: section,
                  section_order: section.order,
                  has_direct_content: section['@attributes'].has_direct_content,
                  tags: tags
                };
              })
            );
          }
          break;

        case 'sites/sections/entries/move':
          return this.store.dispatch(new MoveSectionEntryFromSyncAction(
            data.site,
            data.currentSection,
            data.entryId,
            data.toSection
          ));

        case 'sites/sections/entries/galleries':
          if (method === 'DELETE') {
            return this.appService.sync('entryGallery', {
              site: data.site,
              section: data.section,
              entryId: data.entryId,
              file: data.file
              },
              'DELETE'
            ).pipe(
              map(() => {
                return {
                  site: data.site,
                  section: data.section,
                  entry_id: data.entryId,
                  file: data.file
                };
              })
            );

          } else {
            return this.store.dispatch(new UpdateEntryGalleryFromSyncAction(
              data.site,
              data.section,
              data.entryId,
              data.files
            )).pipe(
              map(state => state.sectionEntries),
              map(state => {
                const entry = state[data.site].find(_entry => _entry.id === data.entryId && _entry.sectionName === data.section);

                return {
                  site: data.site,
                  section: data.section,
                  entry_id: data.entryId,
                  mediafolder: entry.mediafolder,
                  files: entry.mediaCacheData.file
                };
              })
            );
        }

        default:
          return this.appService.sync(url, data, method);
    }
  }

  connectIframeReload(iframe: HTMLIFrameElement) {
    /*
      Catch external links and prevent navigating away from iframe
    */
    this.catchExternalLinks(iframe.contentWindow.document);

    /*
      Reload the preview iframe after settings affecting preview change
      Because we don't have preview renderer in frontend yet.
     */
    this.iframeReloadSubscription = this.actions$.pipe(
      ofActionSuccessful(
        ...[
          CreateSiteAction,
          UpdateSiteAction,
          ReOrderSitesAction,
          DeleteSiteAction,
          AddSiteSectionsAction,
          UpdateSiteSectionAction,
          RenameSiteSectionAction,
          ReOrderSiteSectionsAction,
          DeleteSiteSectionAction,
          DeleteSiteSectionsAction,
          UpdateSiteSettingsAction,
          AddSiteSettingChildrenAction,
          UpdateSiteSettingChildreAction,
          DeleteSiteSettingChildrenAction,
          UpdateSiteTemplateSettingsAction,
          UpdateShopSettingsAction
        ]
      ),
      /* Only reload when the overlay gets closed: */
      buffer(this.store.select(AppState.getShowOverlay).pipe(
        scan(([_, prevShowOverlay]: [boolean, boolean], showOverlay: boolean) => {
          return [prevShowOverlay, showOverlay];
        }, [false, false]),
        filter(([prev, cur]) => prev !== cur && !cur)
      )),
      filter(actionsPassed => {
        return actionsPassed.length > 0 && !actionsPassed.every(action => {
          const slug = Object.keys(action.payload)[0];
          return action instanceof UpdateSiteTemplateSettingsAction && !(this.templateSettingsRequireReload[action.settingGroup] && this.templateSettingsRequireReload[action.settingGroup].indexOf(slug) > -1);
        });
      })
    ).subscribe(() => {
      iframe.contentWindow.location.reload();
    });
  }

  disconnectIframeView(iframe: HTMLIFrameElement) {
    this.iframeReloadSubscription.unsubscribe();
  }

  parseSyncUrl(url) {
    const parts = url.split('/');
    if (parts.length > 0 && /^https?:$/.test(parts[0])) {
      // http://local.berta.me/_api/v1/sites/sections => ["http:", "", "local.berta.me", "_api", "v1", "sites", "sections"]
      return parts.slice(5);
    }
    if (parts[0] === '') {
      // /sites/sections => ["", "sites", "sections"]
      return parts.slice(1);
    }
    return parts;
  }

  catchExternalLinks(document) {
    const links = document.getElementsByTagName('a');

    Array.from(links).forEach(link => {
      (link as HTMLElement).addEventListener('click', (event) => {
        const target = (event.target as HTMLElement);
        let targetHost: string;
        let url: URL;

        try {
          url = new URL(target.getAttribute('href'));
          targetHost = url.hostname;

        // in case url is relative url it can't be parsed with new URL(...)
        // pretend host is the same
        } catch {}

        targetHost = targetHost || document.location.hostname;

        if (target.getAttribute('target') === '_blank' ||
            targetHost === document.location.hostname ||
            event.defaultPrevented) {
          return;
        }

        event.preventDefault();

        this.popupService.showPopup({
          type: 'warn',
          content: 'You are about to leave Berta editor. Proceed?',
          showOverlay: true,
          actions: [
            {
              type: 'primary',
              label: 'OK',
              callback: (popupService) => {
                popupService.closePopup();
                window.location.href = url.href;
              }
            },
            {
              label: 'Cancel'
            }
          ],
        });
      });

    });
  }

}
