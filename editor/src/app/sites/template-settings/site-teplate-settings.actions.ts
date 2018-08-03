export class UpdateSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:UPDATE';
  constructor(public settingGroup: string,
              public payload: {[k: string]: any}) {
  }
}
