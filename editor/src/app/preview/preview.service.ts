import { Injectable } from '@angular/core';

import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { AppStateService } from '../app-state/app-state.service';
import { UpdateSiteSectionFromSyncAction } from '../sites/sections/sections-state/site-sections.actions';
import { UpdateSiteSettingsFromSyncAction } from '../sites/settings/site-settings.actions';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { UpdateSiteTemplateSettingsAction } from '../sites/template-settings/site-template-settings.actions';
import { SiteTemplateSettingsState } from '../sites/template-settings/site-template-settings.state';
import { combineLatest, Subscription } from 'rxjs';
import { AppState } from '../app-state/app.state';
import { SiteSettingsState } from '../sites/settings/site-settings.state';


@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  private iframeUpdateSubscriptions: Subscription[] = [];

  constructor(
    private appService: AppStateService,
    private actions$: Actions,
    private store: Store) {
  }

  sync(url, data, method) {
    /** @todo:
     * - Trigger appropriate actions to update the state here instead of direct sync
     * - Trigger correct actions to update the iframe when settings change
     */
    console.log('Sync through angular');
    console.log('SYNC URL: ' + url);
    console.log('SYNC DATA:', data);
    console.log('SYNC METHOD:', method);

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
            const [currentSite, _, settingGroupSlug, settingKey] = data.path.split('/');
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
              const [currentSite, _, sectionOrder] = data.path.split('/');
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

        case 'sites/sections/backgrounds':
        /* Background has its own endpoint
          SYNC URL: http://local.berta.me/_api/v1/sites/sections/backgrounds
          preview.service.ts:18 SYNC DATA: {site: "0", section: "maig", file: "chrome_2018-03-21_15-39-07.jpg"}
          preview.service.ts:19 SYNC METHOD: DELETE
        */

        case 'sites/sections/entries':
        /* trigger entry update actions */

        default:
          console.log('DEFAULT SYNC');

          return this.appService.sync(url, data, method).pipe(tap(resp => console.log(resp)));
    }
  }

  connectIframeView(iframe: HTMLIFrameElement) {
    this.iframeUpdateSubscriptions.push(this.actions$.pipe(
      ofActionSuccessful(UpdateSiteTemplateSettingsAction),
      switchMap(action => {
        return combineLatest(
          this.store.select(SiteTemplateSettingsState.getCurrentSiteTemplateSettings).pipe(
           map(siteTemplateSettings => {
            const settingKey = Object.keys(action.payload)[0];
            const settingGroup = siteTemplateSettings.find((group) => group.slug === action.settingGroup);
            const setting = settingGroup.settings.find(_setting => _setting.slug === settingKey);
             return {
               path: action.settingGroup + '/' + settingKey,
               value: setting.value
             };
           })
         ),
         this.store.select(AppState.getSite),
         this.store.select(SiteSettingsState.getCurrentSiteTemplate)
        ).pipe(take(1));
      })
    ).subscribe(([update, siteSlug, templateSlug]) => {
      iframe.contentWindow['redux_store'].dispatch(
        iframe.contentWindow['Actions'].updateSiteTemplateSettings({
          path: `${siteSlug}/site_template_settings/${templateSlug}/${update.path}`,
          site: siteSlug,
          value: update.value,
          real: update.value,
          update: update.value
        }));
    }));
  }

  disconnectIframeView() {
    this.iframeUpdateSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.iframeUpdateSubscriptions = [];
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
}
