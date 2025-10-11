import { Injectable } from '@angular/core';
import { CanMatch } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserStateModel } from './user/user.state.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardShopService implements CanMatch {
  constructor(private store: Store) {}

  canMatch() {
    const user: UserStateModel = this.store.selectSnapshot(
      (state) => state.user
    );
    return !!user.token && user.features.includes('shop');
  }
}
