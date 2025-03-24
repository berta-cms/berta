export class UserLoginAction {
  static readonly type = 'USER:LOGIN';
  constructor(
    public payload: {
      username?: string;
      password?: string;
      token?: string;
    }
  ) {}
}

export class UserLogoutAction {
  static readonly type = 'USER:LOGOUT';
  constructor(public saveNextUrl = false) {}
}

export class SetUserNextUrlAction {
  static readonly type = 'USER:SET:NEXT_URL';
  constructor(public payload: string) {}
}
