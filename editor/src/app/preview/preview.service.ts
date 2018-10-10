import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppStateService } from '../app-state/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  constructor(
    private appService: AppStateService,
    private store: Store) {
  }

  sync(url, data, method) {
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
        */
        break;

        case 'sites/sections':
        /** trigger section update actions like gallery properties
         * @example:
        SYNC URL: http://local.berta.me/_api/v1/sites/sections
        SYNC DATA: {path: "0/section/0/mediaCacheData/@attributes/autoplay", value: "31"}
        SYNC METHOD: PATCH
        */
        break;

        case 'sites/sections/backgrounds':
        /* Background has its own endpoint
          SYNC URL: http://local.berta.me/_api/v1/sites/sections/backgrounds
          preview.service.ts:18 SYNC DATA: {site: "0", section: "maig", file: "chrome_2018-03-21_15-39-07.jpg"}
          preview.service.ts:19 SYNC METHOD: DELETE
        */

        case 'sites/sections/entries':
        /* trigger entry update actions */
        break;
    }

    /** @todo:
     * - Trigger appropriate actions to update the state here instead of direct sync
     * - Trigger correct actions to update the iframe when settings change
     */
    return this.appService.sync(url, data, method);
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
