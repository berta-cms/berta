export class UpdateInputFocus {
  static readonly type = 'INPUT_FOCUS:UPDATE';
  constructor(public isFocused: boolean) {
  }
}

export class AppShowOverlay {
  static readonly type = 'OVERLAY:SHOW';
}

export class AppHideOverlay {
  static readonly type = 'OVERLAY:HIDE';
}

export class AppShowLoading {
  static readonly type = 'LOADING:SHOW';
}

export class AppHideLoading {
  static readonly type = 'LOADING:HIDE';
}
