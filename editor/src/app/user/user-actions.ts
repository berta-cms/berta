export class UserLogin {
  static readonly type = 'USER:LOGIN';
  constructor(
    public name: string | null,
    public token: string | null,
    public features: string[],
    public profileUrl: string | null
  ) { }
}

export class UserLogout {
  static readonly type = 'USER:LOGOUT';
}
