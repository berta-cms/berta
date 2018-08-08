import { SiteStateModel } from '../sites-state/site-state.model';

export class UpdateSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:UPDATE';
  constructor(public settingGroup: string,
              public payload: {[k: string]: any}) {
  }
}

export class RenameSiteTemplateSettingsSitenameAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS_SITENAME:RENAME';
  constructor(
    public site: SiteStateModel,
    public siteName: string) {
  }
}

export class DeleteSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:DELETE';
  constructor(public siteName: string) {
  }
}
