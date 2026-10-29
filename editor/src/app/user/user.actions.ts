export class UserLoginAction {
  static readonly type = 'USER:LOGIN';
  constructor(
    public payload: {
      username?: string;
      password?: string;
      token?: string;
    },
  ) {}
}

/** The API renewed the session token while the editor is used. */
export class UserTokenRenewedAction {
  static readonly type = 'USER:TOKEN_RENEWED';
  constructor(public token: string) {}
}

export class UserLogoutAction {
  static readonly type = 'USER:LOGOUT';
  constructor(public saveNextUrl = false) {}
}

export class SetUserNextUrlAction {
  static readonly type = 'USER:SET:NEXT_URL';
  constructor(public payload: string) {}
}
