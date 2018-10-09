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

    if (data.path && data.path.startsWith('/settings')) {
      /* trigger setting update actions */
    }

    if (data.path && data.path.startsWith('/entry')) {
      /* trigger entry update actions */
    }

    /*


    SYNC METHOD: DELETE
    preview.service.ts:16 Sync through angular
    preview.service.ts:17 SYNC URL: http://local.berta.me/_api/v1/sites/sections/backgrounds
    preview.service.ts:18 SYNC DATA: {site: "", section: "maig", files: Array(2)}files: (2) ["tumblr-n76fa8bp2p1s3cyypo1-1280_2.png_1000x1000.png", "phone-girl.png_434x854.png"]section: "maig"site: ""__proto__: Object
    preview.service.ts:19 SYNC METHOD: PUT
    preview.service.ts:16 Sync through angular
    preview.service.ts:17 SYNC URL: http://local.berta.me/_api/v1/sites/sections/backgrounds
    preview.service.ts:18 SYNC DATA: {site: "", section: "maig", files: Array(3)}files: (3) ["tumblr-n76fa8bp2p1s3cyypo1-1280_2.png_1000x1000.png", "phone-girl.png_434x854.png", "chrome_2018-03-21_15-39-07.jpg"]section: "maig"site: ""__proto__: Object
    preview.service.ts:19 SYNC METHOD: PUT
    */

    /** @todo:
     * - Trigger appropriate actions to update the state here instead of direct sync
     * - Trigger correct actions to update the iframe when settings change
     */
    return this.appService.sync(url, data, method);
  }
}
