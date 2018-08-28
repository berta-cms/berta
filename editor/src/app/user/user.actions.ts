import { UserStateModel } from './user.state.model';

export class UserLoginAction {
  static readonly type = 'USER:LOGIN';
  constructor(
    public user: string,
    public password: string) {
  }
}

export class UserLogoutAction {
  static readonly type = 'USER:LOGOUT';
  constructor(public saveNextUrl = false) {}
}

export class ResetUserAction {
  static readonly type = 'USER:RESET';
}

export class UpdateUserAction {
  static readonly type = 'USER:UPDATE';
  constructor(public payload: Partial<UserStateModel>) {}
}

export class SetUserNextUrlAction {
  static readonly type = 'USER:SET:NEXT_URL';
  constructor(public payload: string) {}
}
