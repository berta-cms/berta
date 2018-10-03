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
    /** @todo:
     * - Trigger appropriate actions to update the state here instead of direct sync
     * - Trigger correct actions to update the iframe when settings change
     */
    return this.appService.sync(url, data, method);
  }
}
