export class AppShowOverlay {
  static readonly type = 'OVERLAY:SHOW';
}

export class AppHideOverlay {
  static readonly type = 'OVERLAY:HIDE';
}

export class AppLogin {
  static readonly type = 'LOGIN';
  constructor(public token: string) { }
}

export class AppLogout {
  static readonly type = 'LOGOUT';
}
