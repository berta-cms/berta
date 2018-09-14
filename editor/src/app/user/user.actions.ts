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

export class SetUserNextUrlAction {
  static readonly type = 'USER:SET:NEXT_URL';
  constructor(public payload: string) {}
}
