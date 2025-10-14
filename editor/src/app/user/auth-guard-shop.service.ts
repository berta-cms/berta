import { Injectable } from '@angular/core';
import { CanMatch } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserState } from './user.state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardShopService implements CanMatch {
  constructor(private store: Store) {}

  canMatch() {
    return this.store.selectSnapshot(UserState.hasFeatureShop);
  }
}
