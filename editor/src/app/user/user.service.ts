import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, switchMap, filter } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { UserState } from './user.state';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private store: Store) {}

  changePassword(oldPassword, newPassword) {
    return this.store.select(UserState).pipe(
      filter((user) => !!user.token),
      take(1),
      switchMap((user) => {
        return this.http.patch(
          '/_api/v1/user/changepassword',
          {
            old_password: oldPassword,
            new_password: newPassword,
            retype_password: newPassword,
          },
          {
            headers: { 'X-Authorization': 'Bearer ' + user.token },
          }
        );
      })
    );
  }
}
