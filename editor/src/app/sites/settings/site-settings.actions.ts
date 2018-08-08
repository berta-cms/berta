export class UpdateSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:UPDATE';
  constructor(public settingGroup: string,
              public payload: {[k: string]: any}) {
  }
}

export class DeleteSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:DELETE';
  constructor(public siteName: string) {
  }
}
