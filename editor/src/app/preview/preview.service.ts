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
    return this.appService.sync(url, data, method);
  }
}
